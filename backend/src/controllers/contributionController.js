// Import all your distinct models
import FamousSpot from "../models/famousSpotModel.js";
import HiddenSpot from "../models/hiddenSpotModel.js";
import FamousFood from "../models/famousFoodModel.js";
import Handicraft from "../models/handicraftModel.js";
import History from "../models/historyModel.js";
import Contribution from "../models/contributionModel.js";

const getContributions = async (req, res) => {
  try {
    const userId = req.user._id;

    //  1. Fetch contributions (where user contributed to a place)
    const contributions = await Contribution.find({ userId })
      .populate("userId", "username email image role")
      .sort({ createdAt: -1 })
      .lean();

    //  Manually populate placeId based on type field (since ref is hardcoded to FamousSpot)
    const modelMap = {
      "famousSpot": FamousSpot,
      "hidden-spot": HiddenSpot,
      "food": FamousFood,
      "handicraft": Handicraft,
      "history": History,
    };

    const formattedContributions = await Promise.all(
      contributions.map(async (c) => {
        const Model = modelMap[c.type];
        let placeId = null;

        if (Model) {
          placeId = await Model.findById(c.placeId).lean();
        }

        let model = "";
        let placeType = "";
        let title = "";

        // Use the 'type' field from contribution to determine model
        if (c.type === "famousSpot") {
          model = "FamousSpot";
          placeType = "Famous Spot";
          title = placeId?.spotName;
        } else if (c.type === "hidden-spot") {
          model = "HiddenSpot";
          placeType = "Hidden Spot";
          title = placeId?.spotName;
        } else if (c.type === "food") {
          model = "FamousFood";
          placeType = "Food";
          title = placeId?.foodName;
        } else if (c.type === "handicraft") {
          model = "Handicraft";
          placeType = "Handicraft";
          title = placeId?.name;
        } else if (c.type === "history") {
          model = "History";
          placeType = "History";
          title = placeId?.placeName;
        }

        return {
          _id: c._id,
          type: placeType,       // what kind of place
          model,                 // which model
          title,
          city: placeId?.city,
          images: placeId?.images?.[0],
          user: c.userId,
          createdAt: c.createdAt,
          isNewPlace: c.type === "spot" && c.content === placeId?.description,
          isContribution: true,  // Mark as contribution
        };
      })
    );

    const formatted = formattedContributions;

    //  2. Fetch created items (where user is the creator)
    const [
      createdFamousSpots,
      createdHiddenSpots,
      createdFamousFoods,
      createdHandicrafts,
      createdHistories,
    ] = await Promise.all([
      FamousSpot.find({ user: userId }).lean(),
      HiddenSpot.find({ user: userId }).lean(),
      FamousFood.find({ user: userId }).lean(),
      Handicraft.find({ user: userId }).lean(),
      History.find({ user: userId }).lean(),
    ]);

    // Format created spots
    const createdItems = [];

    createdFamousSpots.forEach(spot => {
      createdItems.push({
        _id: spot._id,
        type: "Famous Spot",
        model: "FamousSpot",
        title: spot.spotName,
        city: spot.city,
        images: spot.images?.[0],
        user: { _id: userId },
        createdAt: spot.createdAt,
        isContribution: false, // Mark as created item
      });
    });

    createdHiddenSpots.forEach(spot => {
      createdItems.push({
        _id: spot._id,
        type: "Hidden Spot",
        model: "HiddenSpot",
        title: spot.spotName,
        city: spot.city,
        images: spot.images?.[0],
        user: { _id: userId },
        createdAt: spot.createdAt,
        isContribution: false,
      });
    });

    createdFamousFoods.forEach(food => {
      createdItems.push({
        _id: food._id,
        type: "Food",
        model: "FamousFood",
        title: food.foodName,
        city: food.city,
        images: food.images?.[0],
        user: { _id: userId },
        createdAt: food.createdAt,
        isContribution: false,
      });
    });

    createdHandicrafts.forEach(craft => {
      createdItems.push({
        _id: craft._id,
        type: "Handicraft",
        model: "Handicraft",
        title: craft.name,
        city: craft.city,
        images: craft.images?.[0],
        user: { _id: userId },
        createdAt: craft.createdAt,
        isContribution: false,
      });
    });

    createdHistories.forEach(history => {
      createdItems.push({
        _id: history._id,
        type: "History",
        model: "History",
        title: history.placeName,
        city: history.city,
        images: history.images?.[0],
        user: { _id: userId },
        createdAt: history.createdAt,
        isContribution: false,
      });
    });

    // 3. Combine and sort by createdAt
    const allItems = [...formatted, ...createdItems].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({ success: true, data: allItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


const modelMap = {
  FamousSpot,
  HiddenSpot,
  FamousFood,
  Handicraft,
  History,
};

import User from "../models/userModel.js";

const deleteContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const { model, isContribution } = req.query;
    const userId = req.user._id;

    let ownerId = null;

    //  Case 1: Deleting a CONTRIBUTION (user contributed to existing place)
    if (isContribution === "true") {
      const contribution = await Contribution.findById(id);
      if (!contribution) {
        return res.status(404).json({ message: "Contribution not found" });
      }

      // Check authorization
      if (contribution.userId.toString() !== userId.toString()) {
        return res.status(401).json({ message: "Not authorized to delete this contribution" });
      }

      ownerId = contribution.userId;

      // Delete the contribution
      await Contribution.deleteOne({ _id: id });

    } 
    //  Case 2: Deleting a CREATED ITEM (user created the place)
    else {
      const Model = modelMap[model];
      if (!Model) {
        return res.status(400).json({ message: "Invalid model" });
      }

      const item = await Model.findById(id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Check authorization - item must have user field
      if (!item.user) {
        return res.status(400).json({ message: "Item is not a created item" });
      }

      if (item.user.toString() !== userId.toString()) {
        return res.status(401).json({ message: "Not authorized to delete this item" });
      }

      ownerId = item.user;

      // Delete the item
      await Model.deleteOne({ _id: id });
    }

    // Count remaining items across ALL collections (both created and contributed)
    const [
      contributionCount,
      famousCount,
      hiddenCount,
      foodCount,
      handicraftCount,
      historyCount,
    ] = await Promise.all([
      Contribution.countDocuments({ userId: ownerId }),
      FamousSpot.countDocuments({ user: ownerId }),
      HiddenSpot.countDocuments({ user: ownerId }),
      FamousFood.countDocuments({ user: ownerId }),
      Handicraft.countDocuments({ user: ownerId }),
      History.countDocuments({ user: ownerId }),
    ]);

    const totalItems =
      contributionCount +
      famousCount +
      hiddenCount +
      foodCount +
      handicraftCount +
      historyCount;

    //  Downgrade role to "user" if no items left
    if (totalItems === 0) {
      await User.findByIdAndUpdate(ownerId, { role: "user" });
    }

    res.status(200).json({
      id,
      message: "Deleted successfully",
      totalItems,
      roleUpdated: totalItems === 0,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { getContributions, deleteContribution };