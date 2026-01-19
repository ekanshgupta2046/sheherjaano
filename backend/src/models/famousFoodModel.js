import mongoose from "mongoose";


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
    geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});


const famousFoodSchema = new mongoose.Schema(
  {
    
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

   
    places: {
      type: [placeSchema],
      validate: [(v) => v.length > 0, "At least one place must be added"],
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
  { timestamps: true }
);
famousFoodSchema.index({ "places.geometry": "2dsphere" });

export default mongoose.model("FamousFood", famousFoodSchema);