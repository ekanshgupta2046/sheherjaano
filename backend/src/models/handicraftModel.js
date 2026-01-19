import mongoose from "mongoose";

const handicraftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Handicraft name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
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
    localMarkets: [
  {
    name: { type: String, trim: true },
    address: { type: String, trim: true }
  }
],
    priceRange: {
      type: String,
      trim: true,
      default: "Varies",
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
handicraftSchema.index({ geometry: '2dsphere' });
const Handicraft = mongoose.model("Handicraft", handicraftSchema);

export default Handicraft;
