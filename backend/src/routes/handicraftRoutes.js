import express from "express";
import Handicraft from "../models/handicraftModel.js";
import FamousSpot from "../models/famousSpotModel.js";
import HiddenSpot from "../models/hiddenSpotModel.js";
import FamousFood from "../models/famousFoodModel.js";
import History from "../models/historyModel.js";
import Contribution from "../models/contributionModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import verifyJWT from "../middlewares/verifyJWT.js";
import { getCoordinates } from "../utils/geocode.js";

const router = express.Router();

// 🔑 Generate Access Token
const generateToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60s",
  });
};

// ==========================================
// 1️⃣ CREATE HANDICRAFT (POST)
// ==========================================
router.post("/", verifyJWT, async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      state,
      city,
      priceRange,
      localMarkets,
      images,
      videoLink,
      instagramLink,
      latitude,
      longitude
    } = req.body;

    // 🛑 Validation
    if (!name || !description || !state || !city) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }
    let addressForGeo = null;

// 🥇 Priority 1: First market address (if exists)
if (localMarkets?.length > 0 && localMarkets[0]?.address) {
  addressForGeo = localMarkets[0].address;
}

// 🥈 Priority 2: City + State fallback
if (!addressForGeo) {
  addressForGeo = `${city}, ${state}`;
}


    // 🌍 GET COORDINATES (same logic as FamousSpot)
    const finalCoordinates = await getCoordinates({
      name,
      address: addressForGeo,
      city,
      state,
      latitude,
      longitude,
    });

    // ---------- CHECK IF HANDICRAFT ALREADY EXISTS ----------
    let existingHandicraft = await Handicraft.findOne({
      name: new RegExp(`^${name}$`, "i"),
      city,
      state,
    });

    let place = existingHandicraft;
    let contribution = null;
    let isNewPlace = false;

    // =====================================================
    // A) HANDICRAFT EXISTS → CREATE CONTRIBUTION ONLY
    // =====================================================
    if (existingHandicraft) {
      contribution = await Contribution.create({
        placeId: existingHandicraft._id,
        userId: req.user._id,
        type: "handicraft",
        content: description,
        images,
        videoLink,
        instagramLink,
        suggestedChanges: {
          priceRange,
          localMarkets,
        },
      });

    } else {
      // =====================================================
      // B) HANDICRAFT DOES NOT EXIST → CREATE MASTER HANDICRAFT (with user field)
      // =====================================================
      isNewPlace = true;

      const newHandicraft = new Handicraft({
        name,
        category,
        description,
        state,
        city,
        priceRange,
        localMarkets,
        images,
        videoLink,
        instagramLink,
        user: req.user._id,

        // ✅ GeoJSON
        geometry: {
          type: "Point",
          coordinates: finalCoordinates,
        },
      });

      place = await newHandicraft.save();
    }

    // ---------- ROLE PROMOTION ----------
    let newRole = null;
    let newAccessToken = null;

    if (req.user.role === "user") {
      const [handicraftCount, spotCount, hiddenCount, foodCount, historyCount, contributionCount] = await Promise.all([
        Handicraft.countDocuments({ user: req.user._id }),
        FamousSpot.countDocuments({ user: req.user._id }),
        HiddenSpot.countDocuments({ user: req.user._id }),
        FamousFood.countDocuments({ user: req.user._id }),
        History.countDocuments({ user: req.user._id }),
        Contribution.countDocuments({ userId: req.user._id }),
      ]);

      const totalItems = handicraftCount + spotCount + hiddenCount + foodCount + historyCount + contributionCount;

      if (totalItems === 1) {
        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          { role: "contributor" },
          { new: true }
        );

        newAccessToken = generateToken(updatedUser._id, "contributor");
        newRole = "contributor";
      }
    }

    res.status(isNewPlace ? 201 : 200).json({
      success: true,
      message: isNewPlace
        ? "New handicraft created successfully!"
        : "Your contribution has been added!",
      place,
      contribution,
      isNewPlace,
      newRole,
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Create Handicraft Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================================
// 2️⃣ GET ALL HANDICRAFTS (FILTER BY STATE/CITY)
// ==========================================
router.get("/", async (req, res) => {
  try {
    const { state, city } = req.query;
    let query = {};

    if (state) query.state = state;
    if (city) query.city = city;

    const handicrafts = await Handicraft.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: handicrafts.length,
      data: handicrafts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================================
// 3️⃣ GET SINGLE HANDICRAFT WITH CONTRIBUTIONS
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const handicraftId = req.params.id;

    const result = await Handicraft.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(handicraftId) } },
      {
        $lookup: {
          from: "contributions",
          let: { handicraftId: "$_id" },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ["$placeId", "$$handicraftId"] }, { $eq: ["$type", "handicraft"] }] } } }
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
      return res.status(404).json({
        success: false,
        message: "Handicraft not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
