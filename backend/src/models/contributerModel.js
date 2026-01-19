import mongoose from "mongoose";

const contributorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: [
        "Local Guide",
        "Craftsman / Artisan",
        "Shop Owner",
        "Resident",
        "Student / Volunteer",
        "Other",
      ],
    },
    bio: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    contactMethod: {
      type: String,
      enum: [
        "Chat on SheherJaano",
        "Phone Call",
        "Email",
        "Instagram / WhatsApp",
        "Any",
        "",
      ],
      default: "",
    },
    profilePic: {
      type: String, // URL to uploaded image (Cloudinary or other storage)
      default: "",
    },
    consent: {
      type: Boolean,
      required: true,
      default: false,
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
      ref: "User", // The user who submitted this contributor info
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // Admin approval for displaying publicly
    },
  },
  { timestamps: true }
);

const Contributor = mongoose.model("Contributor", contributorSchema);

export default Contributor;
