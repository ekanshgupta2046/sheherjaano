import express from "express";
import History from "../models/historyModel.js";
import FamousSpot from "../models/famousSpotModel.js"; 
import FamousFood from "../models/famousFoodModel.js";
import HiddenSpot from "../models/hiddenSpotModel.js";
import Handicraft from "../models/handicraftModel.js";
import Contribution from "../models/contributionModel.js";
import User from "../models/userModel.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { getCoordinates } from "../utils/geocode.js";

const router = express.Router();

/* =========================
    TOKEN GENERATOR
========================= */
const generateToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60s",
  });
};

/* =========================
    1️⃣ CREATE HISTORY
========================= */
router.post("/", verifyJWT, async (req, res) => {
  try {
    const {
      placeName,
      era,
      category,
      shortDescription,
      builtBy,
      yearBuilt,
      historyDescription,
      address,
      mapLink,
      images,
      videoLink,
      instagramLink,
      state,
      city,
      latitude,
      longitude,
    } = req.body;

    /* ---------- GEO CODING ---------- */
    const coordinates = await getCoordinates({
      name: placeName,
      address,
      city,
      state,
      latitude,
      longitude,
    });

    const newHistory = new History({
      placeName,
      era,
      category,
      shortDescription,
      builtBy,
      yearBuilt,
      historyDescription,
      address,
      mapLink,
      images,
      videoLink,
      instagramLink,
      state,
      city,
      geometry: {
        type: "Point",
        coordinates,
      },
      user: req.user._id,
    });

    // ---------- CHECK IF HISTORY ALREADY EXISTS ----------
    let existingHistory = await History.findOne({
      placeName: new RegExp(`^${placeName}$`, "i"),
      city,
      state,
    });

    let place = existingHistory;
    let contribution = null;
    let isNewPlace = false;

    // =====================================================
    // A) HISTORY EXISTS → CREATE CONTRIBUTION ONLY
    // =====================================================
    if (existingHistory) {
      contribution = await Contribution.create({
        placeId: existingHistory._id,
        userId: req.user._id,
        type: "history",
        content: historyDescription || shortDescription,
        images,
        videoLink,
        instagramLink,
        suggestedChanges: {
          era,
          builtBy,
          yearBuilt,
        },
      });

    } else {
      // =====================================================
      // B) HISTORY DOES NOT EXIST → CREATE MASTER HISTORY (with user field)
      // =====================================================
      isNewPlace = true;

      const newHistoryRecord = new History({
        placeName,
        era,
        category,
        shortDescription,
        builtBy,
        yearBuilt,
        historyDescription,
        address,
        mapLink,
        images,
        videoLink,
        instagramLink,
        state,
        city,
        geometry: {
          type: "Point",
          coordinates,
        },
        user: req.user._id,
      });

      place = await newHistoryRecord.save();
    }

    /* ---------- PROMOTION LOGIC ---------- */
    let newRole = null;
    let newAccessToken = null;

    if (req.user.role === "user") {
      const [historyCount, foodCount, famousSpotCount, hiddenSpotCount, handicraftCount, contributionCount] = await Promise.all([
        History.countDocuments({ user: req.user._id }),
        FamousFood.countDocuments({ user: req.user._id }),
        FamousSpot.countDocuments({ user: req.user._id }),
        HiddenSpot.countDocuments({ user: req.user._id }),
        Handicraft.countDocuments({ user: req.user._id }),
        Contribution.countDocuments({ userId: req.user._id }),
      ]);

      const totalItems = historyCount + foodCount + famousSpotCount + hiddenSpotCount + handicraftCount + contributionCount;

      if (totalItems === 1) {
        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          { role: "contributor" },
          { new: true }
        );

        newRole = "contributor";
        newAccessToken = generateToken(updatedUser._id, "contributor");
      }
    }

    res.status(isNewPlace ? 201 : 200).json({
      success: true,
      message: isNewPlace
        ? "New history record created successfully!"
        : "Your contribution has been added!",
      place,
      contribution,
      isNewPlace,
      newRole,
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Create History Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
    2️⃣ GET ALL HISTORY PLACES
========================= */
router.get("/", async (req, res) => {
  try {
    const { state, city } = req.query;

    const query = {};
    if (state) query.state = state;
    if (city) query.city = city;

    const historyPlaces = await History.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: historyPlaces.length,
      data: historyPlaces,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
    3️⃣ GET SINGLE HISTORY PLACE WITH CONTRIBUTIONS
========================= */
router.get("/:id", async (req, res) => {
  try {
    const historyId = req.params.id;

    const result = await History.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(historyId) } },
      {
        $lookup: {
          from: "contributions",
          let: { historyId: "$_id" },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ["$placeId", "$$historyId"] }, { $eq: ["$type", "history"] }] } } }
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
      return res
        .status(404)
        .json({ success: false, message: "History place not found" });
    }

    res.status(200).json({ success: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
