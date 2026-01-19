import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      
      trim: true,
      lowercase: true,
    },
    stateName: {
      type: String,
      
      trim: true,
      lowercase: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author ID is required"],
    },
    authorName: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    authorRole: {
      type: String,
      enum: ["tourist", "resident"],
      required: [true, "Author role is required"],
    },
    showAuthorProfile: {
      type: Boolean,
      default: true,
    },
    isVerifiedAuthor: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Question description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    replyCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
questionSchema.index({ cityName: 1, stateName: 1, createdAt: -1 });
questionSchema.index({ authorId: 1 });

const Question = mongoose.model("Question", questionSchema);
export default Question;
