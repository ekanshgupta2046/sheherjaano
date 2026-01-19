import { motion } from "framer-motion";
import { X, Trash2, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onDelete,
  onClearAll,
  onClose,
}) {
  const navigate = useNavigate();

const handleNotificationClick = (notification) => {
  onMarkAsRead(notification._id);

  navigate(
  `/city/${notification.stateName}/${notification.cityName}/questions/${notification.questionId._id}`
);


  onClose();
};


  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 top-12 w-96 bg-white border border-amber-200 rounded-2xl shadow-2xl z-50"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-2xl">
        <h3 className="font-bold text-orange-700">Notifications</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-amber-200 rounded transition"
        >
          <X className="w-5 h-5 text-orange-700" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-amber-100">
            {notifications.map((notification) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 cursor-pointer hover:bg-amber-50 transition ${
                  !notification.isRead ? "bg-blue-50/30" : ""
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div
                    className="flex-1"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="w-4 h-4 text-orange-600" />
                      <p className="text-sm font-semibold text-orange-700">
                        {notification.message}
                      </p>
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 ml-auto"></span>
                      )}
                    </div>
                    <p className="text-xs text-orange-600/70">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(notification._id);
                    }}
                    className="p-1 hover:bg-red-100 rounded transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-orange-700/70">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-amber-100 bg-amber-50 rounded-b-2xl">
          <button
            onClick={onClearAll}
            className="w-full text-sm text-orange-700 hover:text-orange-800 font-semibold transition"
          >
            Clear All
          </button>
        </div>
      )}
    </motion.div>
  );
}
