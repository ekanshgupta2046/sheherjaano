import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    placeName: {
      type: String,
      required: [true, "Place name is required"],
      trim: true,
    },
    era: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Fort", "Palace", "Monument", "Temple", "Museum", "Memorial", "Other"],
      default: "Other",
    },
    shortDescription: {
      type: String,
      trim: true,
      required: [true, "Short description is required"],
    },
    builtBy: {
      type: String,
      trim: true,
    },
    yearBuilt: {
      type: String,
      trim: true,
    },
    historyDescription: {
      type: String,
      required: [true, "Historical description is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    mapLink: {
      type: String,
      trim: true,
    },
    images: {
      type: [String], // Array of image URLs (from Cloudinary or file uploads)
      validate: [(v) => v.length > 0, "At least one image must be added"],
    },
    videoLink: {
      type: String,
      trim: true,
    },
    instagramLink: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // user who added this history record
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // for admin approval
    },
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);

export default History;
