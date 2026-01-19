import Notification from "../models/notificationModel.js";

// GET USER NOTIFICATIONS
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("senderId", "username")
      .populate("questionId", "title")
      .select("-__v");

    const total = await Notification.countDocuments({ recipientId: userId });

    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      total,
      unreadCount,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

// GET UNREAD NOTIFICATION COUNT
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching unread count",
      error: error.message,
    });
  }
};

// MARK NOTIFICATION AS READ
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Check if user is the recipient
    if (notification.recipientId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own notifications",
      });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification: updatedNotification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notification",
      error: error.message,
    });
  }
};

// MARK ALL NOTIFICATIONS AS READ
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking all notifications as read",
      error: error.message,
    });
  }
};

// DELETE NOTIFICATION
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Check if user is the recipient
    if (notification.recipientId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own notifications",
      });
    }

    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    });
  }
};

// CLEAR ALL NOTIFICATIONS
export const clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ recipientId: userId });

    res.status(200).json({
      success: true,
      message: "All notifications cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error clearing notifications",
      error: error.message,
    });
  }
};
