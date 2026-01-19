import mongoose from "mongoose";

const hiddenSpotSchema = new mongoose.Schema(
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
      trim: true,
      default: "",
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
      required: true,
    },


    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);
hiddenSpotSchema.index({ geometry: '2dsphere' });
export default mongoose.model("HiddenSpot", hiddenSpotSchema);
