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
      ref: "User", 
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

famousSpotSchema.index({ geometry: '2dsphere' });

const FamousSpot = mongoose.model("FamousSpot", famousSpotSchema);

export default FamousSpot;
