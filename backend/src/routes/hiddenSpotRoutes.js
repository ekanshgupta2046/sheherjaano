import express from "express";
import HiddenSpot from "../models/hiddenSpotModel.js";
import FamousSpot from "../models/famousSpotModel.js";
import FamousFood from "../models/famousFoodModel.js";
import Handicraft from "../models/handicraftModel.js";
import History from "../models/historyModel.js";
import Contribution from "../models/contributionModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import verifyJWT from "../middlewares/verifyJWT.js";
import { access } from "fs";
import mongoose from "mongoose";
import { getCoordinates } from "../utils/geocode.js";


const router = express.Router();


const generateToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60s", // Or whatever your expiry is
  });
};

//1. create Hidden Spot (POST) - Create or Contribute
router.post("/",verifyJWT, async (req, res) => {
  try {
    const { 
      spotName, category, address, description, 
      state, city, openingHours, entryFee, bestTime,
      images, videoLink, instagramLink, 
      latitude, longitude
    } = req.body;

    const finalCoordinates = await getCoordinates({
      name: spotName,
      address,
      city,
      state,
      latitude,
      longitude,
    });

    // ---------- CHECK IF HIDDEN SPOT ALREADY EXISTS ----------
    let existingSpot = await HiddenSpot.findOne({
      spotName: new RegExp(`^${spotName}$`, "i"),
      city,
      state,
    });

    let place = existingSpot;
    let contribution = null;
    let isNewPlace = false;

    // =====================================================
    // A) SPOT EXISTS → CREATE CONTRIBUTION ONLY
    // =====================================================
    if (existingSpot) {
      contribution = await Contribution.create({
        placeId: existingSpot._id,
        userId: req.user._id,
        type: "hidden-spot",
        content: description,
        images,
        videoLink,
        instagramLink,
        suggestedChanges: {
          openingHours,
          entryFee,
          bestTime,
          address,
        },
      });

    } else {

      // =====================================================
      // B) SPOT DOES NOT EXIST → CREATE MASTER SPOT (with user field)
      // =====================================================
      place = await HiddenSpot.create({
        spotName,
        category,
        address,
        description,
        state,
        city,
        openingHours,
        entryFee,
        bestTime,
        images,
        videoLink,
        instagramLink,
        user: req.user._id,
        geometry: {
          type: 'Point',
          coordinates: finalCoordinates
        }
      });

      isNewPlace = true;
    }

    // =====================================================
    // PROMOTION LOGIC (applies for BOTH cases)
    // =====================================================
    let newRole = null;
    let newAccessToken = null;

    if (req.user.role === "user") {
      const [hiddenCount, famousCount, foodCount, handicraftCount, historyCount] = await Promise.all([
        HiddenSpot.countDocuments({ user: req.user._id }),
        FamousSpot.countDocuments({ user: req.user._id }),
        FamousFood.countDocuments({ user: req.user._id }),
        Handicraft.countDocuments({ user: req.user._id }),
        History.countDocuments({ user: req.user._id }),
      ]);

      const totalItems = hiddenCount + famousCount + foodCount + handicraftCount + historyCount;

      if (totalItems === 1) {
        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          { role: "contributor" },
          { new: true }
        );

        newRole = "contributor";
        newAccessToken = generateToken(updatedUser._id, updatedUser.role);
      }
    }

    res.status(isNewPlace ? 201 : 200).json({
      success: true,
      message: isNewPlace
        ? "New hidden spot created successfully!"
        : "Your contribution has been added!",
      place,
      contribution,
      isNewPlace,
      newRole,
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Create HiddenSpot Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================================
// 2. READ Famous Spots (GET) - (KEPT SAME)
// ==========================================
router.get("/", async (req, res) => {
  try {
    const { state, city } = req.query;
    let queryObj = {};

    if (state) queryObj.state = state; 
    if (city) queryObj.city = city;

    const spots = await HiddenSpot.find(queryObj);

    res.status(200).json({
      success: true,
      count: spots.length,
      data: spots
    });
    
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================================
// 3. GET SINGLE SPOT WITH CONTRIBUTIONS
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const spotId = req.params.id;

    const result = await HiddenSpot.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(spotId) } },
      {
        $lookup: {
          from: "contributions",
          let: { spotId: "$_id" },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ["$placeId", "$$spotId"] }, { $eq: ["$type", "hidden-spot"] }] } } }
          ],
          as: "contributions"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "contributions.userId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $addFields: {
          contributions: {
            $map: {
              input: "$contributions",
              as: "c",
              in: {
                _id: "$$c._id",
                placeId: "$$c.placeId",
                userId: {
                  $arrayElemAt: [{ $filter: { input: "$userDetails", as: "u", cond: { $eq: ["$$u._id", "$$c.userId"] } } }, 0]
                },
                type: "$$c.type",
                content: "$$c.content",
                images: "$$c.images",
                videoLink: "$$c.videoLink",
                instagramLink: "$$c.instagramLink",
                suggestedChanges: "$$c.suggestedChanges",
                status: "$$c.status",
                createdAt: "$$c.createdAt"
              }
            }
          }
        }
      },
      { $project: { userDetails: 0 } }
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, message: "Spot not found" });
    }

    res.status(200).json({ success: true, data: result[0] });
  } catch (err) {
    if (err.name === "CastError") {
        return res.status(400).json({ success: false, message: "Invalid ID format" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});



export default router;