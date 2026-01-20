import express from "express";
import FamousSpot from "../models/famousSpotModel.js";
import HiddenSpot from "../models/hiddenSpotModel.js";
import FamousFood from "../models/famousFoodModel.js";
import Handicraft from "../models/handicraftModel.js";
import History from "../models/historyModel.js";
import User from "../models/userModel.js";
import Contribution from "../models/contributionModel.js";
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

//1. create Famous Spot (POST) 
// POST /famous-spots (Create or Contribute)
router.post("/", verifyJWT, async (req, res) => {
  try {
    const {
      spotName,
      category,
      address,
      description,
      images,
      videoLink,
      instagramLink,
      openingHours,
      entryFee,
      bestTime,
      state,
      city,
      latitude,
      longitude,
    } = req.body;

    // ---------- 1️⃣ GEO-CODING ----------
    const coordinates = await getCoordinates({
      name: spotName,
      address,
      city,
      state,
      latitude,
      longitude,
    });

    // ---------- 2️⃣ CHECK IF SPOT ALREADY EXISTS ----------
    let existingSpot = await FamousSpot.findOne({
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
        type: "famousSpot",
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
      place = await FamousSpot.create({
        spotName,
        category,
        address,
        description,
        images,
        videoLink,
        instagramLink,
        openingHours,
        entryFee,
        bestTime,
        state,
        city,
        user: req.user._id,
        geometry: {
          type: "Point",
          coordinates,
        },
      });

      isNewPlace = true;
    }


    // =====================================================
    // 🔥 PROMOTION LOGIC (applies for BOTH cases)
    // =====================================================

    let newRole = null;
    let newAccessToken = null;

    if (req.user.role === "user") {
      // Count BOTH contributions AND created items
      const [
        contributionCount,
        createdSpotsCount,
        createdHiddenCount,
        createdFoodCount,
        createdHandicraftCount,
        createdHistoryCount,
      ] = await Promise.all([
        Contribution.countDocuments({ userId: req.user._id }),
        FamousSpot.countDocuments({ user: req.user._id }),
        HiddenSpot.countDocuments({ user: req.user._id }),
        FamousFood.countDocuments({ user: req.user._id }),
        Handicraft.countDocuments({ user: req.user._id }),
        History.countDocuments({ user: req.user._id }),
      ]);

      const totalItems = contributionCount + createdSpotsCount + createdHiddenCount + createdFoodCount + createdHandicraftCount + createdHistoryCount;

      if (totalItems === 1) {
        // Promote user
        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          { role: "contributor" },
          { new: true }
        );

        newRole = "contributor";
        newAccessToken = generateToken(updatedUser._id, updatedUser.role);
      }
    }


    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(isNewPlace ? 201 : 200).json({
      success: true,
      message: isNewPlace
        ? "New place created successfully!"
        : "Your contribution has been added!",
      place,
      contribution,
      isNewPlace,
      newRole,
      accessToken: newAccessToken,
    });


  } catch (err) {
    console.error("Create FamousSpot Error:", err);
    res.status(500).json({ success: false, message: err.message });
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

    const spots = await FamousSpot.find(queryObj);

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
// 3. GET SINGLE SPOT (GET) - (KEPT SAME)
// ==========================================
// ==========================================
// 3. GET SINGLE SPOT WITH CONTRIBUTIONS
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const spotId = req.params.id;

    const result = await FamousSpot.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(spotId) } },

      // JOIN contributions
      {
        $lookup: {
          from: "contributions",
          let: { spotId: "$_id" },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ["$placeId", "$$spotId"] }, { $eq: ["$type", "famousSpot"] }] } } }
          ],
          as: "contributions"
        }
      },

      // Populate user details in contributions
      {
        $lookup: {
          from: "users",
          localField: "contributions.userId",
          foreignField: "_id",
          as: "userDetails"
        }
      },

      // Merge userDetails back into contributions
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
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$userDetails",
                        as: "u",
                        cond: { $eq: ["$$u._id", "$$c.userId"] }
                      }
                    },
                    0
                  ]
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

      // Remove userDetails array
      { $project: { userDetails: 0 } }
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, message: "Spot not found" });
    }

    res.status(200).json({
      success: true,
      data: result[0],
    });

  } catch (err) {
    console.error("Error fetching spot with contributions:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});



export default router;