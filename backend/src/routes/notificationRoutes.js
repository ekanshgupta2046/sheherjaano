import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

// GET user notifications (protected)
notificationRouter.get("/", verifyJWT, getUserNotifications);

// GET unread notification count (protected)
notificationRouter.get("/unread-count", verifyJWT, getUnreadCount);

// PATCH mark notification as read (protected)
notificationRouter.patch("/:notificationId/read", verifyJWT, markAsRead);

// PATCH mark all notifications as read (protected)
notificationRouter.patch("/mark-all-read", verifyJWT, markAllAsRead);

// DELETE single notification (protected)
notificationRouter.delete("/:notificationId", verifyJWT, deleteNotification);

// DELETE all notifications (protected)
notificationRouter.delete("/", verifyJWT, clearAllNotifications);

export default notificationRouter;
