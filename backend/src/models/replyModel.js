import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "Question ID is required"],
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
    content: {
      type: String,
      required: [true, "Reply content is required"],
      trim: true,
      maxlength: [2000, "Reply cannot exceed 2000 characters"],
    },
    parentReplyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reply",
      default: null,
    },
        upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    downvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
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
    editedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster queries
replySchema.index({ questionId: 1, createdAt: -1 });
replySchema.index({ authorId: 1 });
replySchema.index({ parentReplyId: 1 });

const Reply = mongoose.model("Reply", replySchema);
export default Reply;
