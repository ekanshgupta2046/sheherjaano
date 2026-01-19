import { useState } from "react";
import { motion } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Edit,
  Reply,
  MoreVertical,
  Users,
  MapPin,
  ShieldCheck,
  Home,
  Map
} from "lucide-react";
import api from "@/api/axios";
import { Card } from "@/components/ui/card";

export default function ReplyCard({
  reply,
  currentUserId,
  questionId,
  onReplyCreated,
  onReplyDeleted,
  onNestedReplyAdded,
  isNested = false,
}) {
  const [upvotes, setUpvotes] = useState(reply.upvotes);
  const [downvotes, setDownvotes] = useState(reply.downvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthor = currentUserId === reply.authorId;

  const handleUpvote = async () => {
    try {
      if (hasUpvoted) {
        setUpvotes(upvotes - 1);
        setHasUpvoted(false);
      } else {
        await api.post(`/replies/${reply._id}/upvote`);
        setUpvotes(upvotes + 1);
        setHasUpvoted(true);
        if (hasDownvoted) {
          setDownvotes(downvotes - 1);
          setHasDownvoted(false);
        }
      }
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const handleDownvote = async () => {
    try {
      if (hasDownvoted) {
        setDownvotes(downvotes - 1);
        setHasDownvoted(false);
      } else {
        await api.post(`/replies/${reply._id}/downvote`);
        setDownvotes(downvotes + 1);
        setHasDownvoted(true);
        if (hasUpvoted) {
          setUpvotes(upvotes - 1);
          setHasUpvoted(false);
        }
      }
    } catch (error) {
      console.error("Error downvoting:", error);
    }
  };

  const handleNestedReplySubmit = async () => {
    if (!replyText.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await api.post("/replies/nested", {
        parentReplyId: reply._id,
        content: replyText,
        authorRole: "tourist",
      });

      setReplyText("");
      setIsReplying(false);
      onNestedReplyAdded?.();
    } catch (err) {
      console.error("Error sending nested reply:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`max-w-full ${
        isNested ? "ml-3 sm:ml-8" : ""
      } overflow-hidden`}
    >
      <Card className="w-full p-4 sm:p-6 mb-4 rounded-2xl border border-amber-100 bg-white shadow-sm hover:shadow-md transition break-words">
        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Avatar */}
            <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-300 flex items-center justify-center text-green-900 font-semibold text-sm">
              {reply.showAuthorProfile
                ? reply.authorName.charAt(0).toUpperCase()
                : "A"}
            </div>

            {/* Meta */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-orange-700 font-semibold text-sm break-words">
                  {reply.showAuthorProfile ? reply.authorName : "Anonymous"}
                </span>

                {/* Role */}
                <span
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                    reply.authorRole === "resident"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {reply.authorRole === "resident" ? (
                    <Home className="w-3 h-3" />
                  ) : (
                    <Map className="w-3 h-3" />
                  )}
                  {reply.authorRole === "resident" ? "Local" : "Tourist"}
                </span>

                {/* Verified */}
                {reply.isVerifiedAuthor && (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                )}
              </div>

              <p className="text-xs text-orange-600/70 mt-1">
                {new Date(reply.createdAt).toLocaleDateString()} at{" "}
                {new Date(reply.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {reply.editedAt && " (edited)"}
              </p>
            </div>
          </div>

          {/* Menu */}
          {isAuthor && (
            <div className="relative shrink-0">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1 rounded hover:bg-amber-50"
              >
                <MoreVertical className="w-4 h-4 text-orange-600" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-40 max-w-[80vw] bg-white border border-amber-200 rounded-lg shadow-lg z-10">
                  <button className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-amber-50 text-orange-700">
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-red-50 text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <p className="text-orange-600 text-sm leading-relaxed whitespace-pre-wrap break-words mb-4">
          {reply.content}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              hasUpvoted
                ? "bg-green-100 text-green-700"
                : "text-orange-600/70 hover:bg-amber-50"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            {upvotes}
          </button>

          <button
            onClick={handleDownvote}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              hasDownvoted
                ? "bg-red-100 text-red-700"
                : "text-orange-600/70 hover:bg-amber-50"
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            {downvotes}
          </button>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-orange-600/70 hover:bg-amber-50"
          >
            <Reply className="w-4 h-4" />
            Reply
          </button>
        </div>

        {/* Nested Reply Box */}
        {isReplying && (
          <div className="mt-3 ml-2 sm:ml-6">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full p-2 border border-amber-200 rounded-lg text-sm"
              placeholder="Write your reply…"
            />
            <button
              onClick={handleNestedReplySubmit}
              className="mt-2 px-4 py-1.5 bg-orange-600 text-white rounded-lg text-sm"
            >
              Submit Reply
            </button>
          </div>
        )}

        {/* Children */}
        {reply.children?.map((child) => (
          <ReplyCard
            key={child._id}
            reply={child}
            currentUserId={currentUserId}
            questionId={questionId}
            isNested
            onReplyCreated={onReplyCreated}
            onReplyDeleted={onReplyDeleted}
            onNestedReplyAdded={onNestedReplyAdded}
          />
        ))}
      </Card>
    </motion.div>
  );
}
