import express from "express";
import FamousSpot from "../models/famousSpotModel.js";
import HiddenSpot from "../models/hiddenSpotModel.js";
import FamousFood from "../models/famousFoodModel.js";
import Handicraft from "../models/handicraftModel.js";
import History from "../models/historyModel.js";
import Contribution from "../models/contributionModel.js";

const router = express.Router();

/**
 * GET /city/:state/:city/hero-images
 * Aggregates images from all places (created) AND contributions for a city
 */
router.get("/:state/:city/hero-images", async (req, res) => {
  try {
    const { state, city } = req.params;

    // Normalize for safety (important)
    const stateQuery = state
    const cityQuery = city

    // ✅ 1. Fetch images from created places
    const [famous, hidden, food, handicraft, history] = await Promise.all([
      FamousSpot.find({ state: stateQuery, city: cityQuery }).select("images"),
      HiddenSpot.find({ state: stateQuery, city: cityQuery }).select("images"),
      FamousFood.find({ state: stateQuery, city: cityQuery }).select("images"),
      Handicraft.find({ state: stateQuery, city: cityQuery }).select("images"),
      History.find({ state: stateQuery, city: cityQuery }).select("images"),
    ]);

    // ✅ 2. Fetch images from contributions to places in this city
    const contributions = await Contribution.find()
      .populate({
        path: "placeId",
        select: "city state images",
      })
      .select("images");

    // Filter contributions by city/state and extract images
    const contributionImages = contributions
      .filter(c => c.placeId && c.placeId.state === stateQuery && c.placeId.city === cityQuery)
      .flatMap(c => c.images || []);

    // ✅ 3. Merge all images from both created places and contributions
    const images = [
      ...famous,
      ...hidden,
      ...food,
      ...handicraft,
      ...history
    ]
      .flatMap(doc => doc.images || [])
      .concat(contributionImages)
      .filter(Boolean)
      .slice(0, 10);

    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching city images:", error);
    res.status(500).json({
      message: "Failed to fetch city images",
    });
  }
});

export default router;
