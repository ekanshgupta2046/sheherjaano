import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient ID is required"],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender ID is required"],
    },
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
    type: {
      type: String,
      enum: ["reply_to_question", "reply_to_reply"],
      required: [true, "Notification type is required"],
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "Question ID is required"],
    },
    replyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reply",
      default: null,
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      index: { expireAfterSeconds: 0 }, // Auto-delete after expiration
    },
  },
  { timestamps: true }
);

// Index for faster queries
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ senderId: 1 });
notificationSchema.index({ questionId: 1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
