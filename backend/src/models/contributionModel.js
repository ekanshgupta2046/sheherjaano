import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema(
  {
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FamousSpot",   
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["famousSpot", "history", "food","handicraft", "hidden-spot"],
      default: "famousSpot",     
    },

    
    content: {
      type: String,
      trim: true,
      default: "",
    },

    // User-submitted media
    images: {
      type: [String],
      default: [],
    },

    videoLink: {
      type: String,
      trim: true,
      default: "",
    },

    instagramLink: {
      type: String,
      trim: true,
      default: "",
    },

    
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    
    suggestedChanges: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Contribution = mongoose.model("Contribution", contributionSchema);

export default Contribution;
