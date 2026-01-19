import express from "express";
import FamousFood from "../models/famousFoodModel.js";
import FamousSpot from "../models/famousSpotModel.js";
import HiddenSpot from "../models/hiddenSpotModel.js";
import Handicraft from "../models/handicraftModel.js";
import History from "../models/historyModel.js";
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
   1️⃣ CREATE FAMOUS FOOD
========================= */
router.post("/", verifyJWT, async (req, res) => {
  try {
    const {
      foodName,
      category,
      description,
      state,
      city,
      places,
      images,
      videoLink,
      instagramLink,
    } = req.body;

    if (!places || places.length === 0) {
      return res.status(400).json({ success: false, message: "At least one place is required" });
    }

    /* ---------- GEO-CODING EACH PLACE ---------- */
    const placesWithGeo = await Promise.all(
      places.map(async (place) => {
        const coordinates = await getCoordinates({
          name: place.placeName,
          address: place.address,
          city,
          state,
          latitude: place.latitude,
          longitude: place.longitude,
        });

        return {
          placeName: place.placeName,
          address: place.address,
          price: place.price,
          specialNote: place.specialNote,
          geometry: {
            type: "Point",
            coordinates,
          },
        };
      })
    );

    // ---------- CHECK IF FAMOUS FOOD ALREADY EXISTS ----------
    let existingFood = await FamousFood.findOne({
      foodName: new RegExp(`^${foodName}$`, "i"),
      city,
      state,
    });

    let place = existingFood;
    let contribution = null;
    let isNewPlace = false;

    // =====================================================
    // A) FOOD EXISTS → CREATE CONTRIBUTION ONLY
    // =====================================================
    if (existingFood) {
      contribution = await Contribution.create({
        placeId: existingFood._id,
        userId: req.user._id,
        type: "food",
        content: description,
        images,
        videoLink,
        instagramLink,
        suggestedChanges: {
          places: placesWithGeo,
          category,
        },
      });

    } else {
      // =====================================================
      // B) FOOD DOES NOT EXIST → CREATE MASTER FOOD (with user field)
      // =====================================================
      isNewPlace = true;

      const newFood = new FamousFood({
        foodName,
        category,
        description,
        state,
        city,
        places: placesWithGeo,
        images,
        videoLink,
        instagramLink,
        user: req.user._id,
      });

      place = await newFood.save();
    }

    /* ---------- PROMOTION LOGIC ---------- */
    let newRole = null;
    let newAccessToken = null;

    if (req.user.role === "user") {
      const [foodCount, spotCount, hiddenCount, handicraftCount, historyCount, contributionCount] = await Promise.all([
        FamousFood.countDocuments({ user: req.user._id }),
        FamousSpot.countDocuments({ user: req.user._id }),
        HiddenSpot.countDocuments({ user: req.user._id }),
        Handicraft.countDocuments({ user: req.user._id }),
        History.countDocuments({ user: req.user._id }),
        Contribution.countDocuments({ userId: req.user._id }),
      ]);

      const totalItems = foodCount + spotCount + hiddenCount + handicraftCount + historyCount + contributionCount;

      if (totalItems === 1 && req.user.role === "user") {
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
        ? "New food item created successfully!"
        : "Your contribution has been added!",
      place,
      contribution,
      isNewPlace,
      newRole,
      accessToken: newAccessToken,
    });

  } catch (err) {
    console.error("Create FamousFood Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   2️⃣ GET ALL FAMOUS FOODS
========================= */
router.get("/", async (req, res) => {
  try {
    const { state, city } = req.query;

    const query = {};
    if (state) query.state = state;
    if (city) query.city = city;

    const foods = await FamousFood.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   3️⃣ GET SINGLE FOOD WITH CONTRIBUTIONS
========================= */
router.get("/:id", async (req, res) => {
  try {
    const foodId = req.params.id;

    const result = await FamousFood.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(foodId) } },
      {
        $lookup: {
          from: "contributions",
          let: { foodId: "$_id" },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ["$placeId", "$$foodId"] }, { $eq: ["$type", "food"] }] } } }
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
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    res.status(200).json({ success: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
