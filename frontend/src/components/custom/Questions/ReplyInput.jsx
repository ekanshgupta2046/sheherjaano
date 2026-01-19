import { useState } from "react";
import { motion } from "framer-motion";
import api from "@/api/axios";
import { Card } from "@/components/ui/card";

export default function ReplyInput({ questionId, onReplyCreated }) {
  const [content, setContent] = useState("");
  const [authorRole, setAuthorRole] = useState("tourist");
  const [showProfile, setShowProfile] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Please write a reply");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/replies", {
        questionId,
        content: content.trim(),
        authorRole,
        showAuthorProfile: showProfile,
      });

      onReplyCreated(res.data.reply);
      setContent("");
      setAuthorRole("tourist");
      setShowProfile(true);
      setExpanded(false);
    } catch (error) {
      console.error("Error creating reply:", error);
      setError(error.response?.data?.message || "Failed to post reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 rounded-2xl border border-amber-100 bg-white shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="Share your knowledge... What's your answer?"
          rows={expanded ? 5 : 3}
          className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white resize-none transition-all"
          maxLength={2000}
        />

        <div className="text-xs text-orange-600/70">
          {content.length}/2000
        </div>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 pt-4 border-t border-amber-100"
          >
            {/* Role Selector */}
            <div>
              <label className="block text-orange-700 font-semibold mb-2 text-sm">
                I'm replying as a...
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="tourist"
                    checked={authorRole === "tourist"}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-orange-700 text-sm">🧳 Tourist</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="resident"
                    checked={authorRole === "resident"}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-orange-700 text-sm">🏘️ Local / Resident</span>
                </label>
              </div>
            </div>

            {/* Privacy Option */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showProfile}
                onChange={(e) => setShowProfile(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-orange-700 text-sm">Show my profile</span>
            </label>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setExpanded(false);
                  setContent("");
                  setError("");
                }}
                className="px-4 py-2 bg-white border border-amber-200 text-orange-700 font-semibold rounded-lg hover:bg-amber-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
              >
                {loading ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </Card>
  );
}
