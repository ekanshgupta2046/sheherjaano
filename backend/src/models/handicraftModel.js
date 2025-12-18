import mongoose from "mongoose";

const handicraftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Handicraft name is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Textile", "Metalwork", "Woodcraft", "Pottery", "Jewelry", "Painting", "Other"],
      default: "Other",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    originCity: {
      type: String,
      required: [true, "Origin city or region is required"],
      trim: true,
    },
    culturalSignificance: {
      type: String,
      trim: true,
    },
    materialsUsed: {
      type: [String],
      default: [],
    },
    priceRange: {
      type: String,
      trim: true,
      default: "Varies",
    },
    images: {
      type: [String], // store image URLs (e.g., from Cloudinary)
      validate: [(v) => v.length > 0, "At least one image is required"],
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
      ref: "User", // Reference to the user or contributor who uploaded it
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // set true when admin approves it for display
    },
  },
  { timestamps: true }
);

const Handicraft = mongoose.model("Handicraft", handicraftSchema);

export default Handicraft;
