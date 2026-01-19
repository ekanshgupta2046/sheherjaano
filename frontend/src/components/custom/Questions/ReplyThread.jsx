import { motion } from "framer-motion";
import ReplyCard from "./ReplyCard";

export default function ReplyThread({
  replies,
  currentUserId,
  currentUserRole,
  onReplyDeleted,
  onNestedReplyAdded,
}) {
  if (!replies || replies.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {replies.map((reply) => (
        <ReplyCard
          key={reply._id}
          reply={reply}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          onReplyDeleted={onReplyDeleted}
          onNestedReplyAdded={onNestedReplyAdded}
        />
      ))}
    </motion.div>
  );
}
