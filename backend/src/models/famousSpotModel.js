import mongoose from "mongoose";

const famousSpotSchema = new mongoose.Schema(
  {
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
    description: {
      type: String,
      default: "",
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    videoLink: {
      type: String,
      default: "",
      trim: true,
    },
    instagramLink: {
      type: String,
      default: "",
      trim: true,
    },
    openingHours: {
      type: String,
      default: "",
      trim: true,
    },
    entryFee: {
      type: String,
      default: "",
      trim: true,
    },
    bestTime: {
      type: String,
      default: "",
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // later when you make contributor model
      required: false,
    },
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  }
);

const FamousSpot = mongoose.model("FamousSpot", famousSpotSchema);

export default FamousSpot;
