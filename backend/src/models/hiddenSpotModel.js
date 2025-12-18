import mongoose from "mongoose";

const hiddenSpotSchema = new mongoose.Schema(
  {
    // 🔤 Basic details
    spotName: {
      type: String,
      required: [true, "Spot name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Historical", "Religious", "Natural", "Entertainment", "Food", "Shopping"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    // 🧠 Description
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // 🖼️ Media
    images: [
      {
        type: String, // will store Cloudinary or server image URLs
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

    // 🕓 Visiting Info
    openingHours: {
      type: String,
      trim: true,
    },
    entryFee: {
      type: String,
      trim: true,
    },
    bestTime: {
      type: String,
      trim: true,
    },

    // 👤 Linked to user (contributor)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔒 For moderation or visibility control
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

export default mongoose.model("HiddenSpot", hiddenSpotSchema);
