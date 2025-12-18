import mongoose from "mongoose";

// 📍 Sub-schema for places where the food is famous
const placeSchema = new mongoose.Schema({
  placeName: {
    type: String,
    required: [true, "Place name is required"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
  price: {
    type: String,
    trim: true,
    default: "",
  },
  specialNote: {
    type: String,
    trim: true,
    default: "", 
  },
});

// 🍲 Main schema for famous foods
const famousFoodSchema = new mongoose.Schema(
  {
    // 🔤 Basic details
    foodName: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Street Food", "Sweet", "Beverage", "Snack", "Main Course"],
    },
    description: {
      type: String,
      trim: true,
    },

    // 🧭 Array of subdocuments
    places: {
      type: [placeSchema],
      validate: [(v) => v.length > 0, "At least one place must be added"],
    },

    // 🖼️ Media
    foodImages: [
      {
        type: String, // Cloudinary or local image URL
      },
    ],
    videoLink: {
      type: String,
      trim: true,
    },
    instagramLink: {
      type: String,
      trim: true,
    },

    // 👤 Linked to user (the one who submitted)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔒 Optional moderation
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FamousFood", famousFoodSchema);