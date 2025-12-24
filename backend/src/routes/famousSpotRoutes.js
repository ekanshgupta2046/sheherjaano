import express from "express";
import FamousSpot from "../models/famousSpotModel.js";

const router = express.Router();

// CREATE Famous Spot (POST)
router.post("/", async (req, res) => {
  try {
    const spot = await FamousSpot.create(req.body);
    res.status(201).json({
      success: true,
      message: "Famous spot created successfully",
      data: spot,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// READ all Famous Spots (GET)
router.get("/", async (req, res) => {
  try {
    const spots = await FamousSpot.find();
    res.json(spots);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
