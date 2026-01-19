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
      type: [String],
      default: [],
    },
    videoLink: {
      type: String,
      trim: true,
    },
    instagramLink: {
      type: String,
      trim: true,
    },
        state: { 
      type: String,
      required: [true, "State is required"],  
      trim: true 
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalRatings: {
      type: Number,
      default: 0
    },

    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0] // Default until you add the map feature
      }
    },
    user: {
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
historySchema.index({ geometry: '2dsphere' });
const History = mongoose.model("History", historySchema);

export default History;
