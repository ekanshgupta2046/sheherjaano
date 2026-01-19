import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import api from "@/api/axios";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications?limit=10");
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(notifications.filter((n) => n._id !== notificationId));
      setUnreadCount(
        unreadCount > 0 && !notifications.find(n => n._id === notificationId)?.isRead
          ? unreadCount - 1
          : unreadCount
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete("/notifications");
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-amber-100 rounded-lg transition"
      >
        <Bell className="w-6 h-6 text-amber-700" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <NotificationDropdown
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            onClearAll={handleClearAll}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
