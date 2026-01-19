import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, MapPin, EyeOff, Eye,Home,Map } from "lucide-react";
import api from "@/api/axios";

export default function AskQuestionModal({
  cityName,
  stateName,
  onClose,
  onQuestionCreated,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authorRole, setAuthorRole] = useState("tourist");
  const [showProfile, setShowProfile] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/questions", {
        cityName,
        stateName,
        title: title.trim(),
        description: description.trim(),
        authorRole,
        showAuthorProfile: showProfile,
      });

      onQuestionCreated(res.data.question);
      setTitle("");
      setDescription("");
      setAuthorRole("tourist");
      setShowProfile(true);
    } catch (error) {
      console.error("Error creating question:", error);
      setError(error.response?.data?.message || "Failed to create question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex justify-between items-center px-4 sm:px-6 py-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
            <h2 className="text-lg sm:text-2xl font-bold text-orange-700">
              Ask a Question
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-amber-200 transition"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-orange-700" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="px-4 sm:px-6 py-5 sm:py-6 space-y-5 sm:space-y-6"
          >
            {/* Title */}
            <div>
              <label className="block text-orange-700 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                Question Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Best street food near the old city?"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm sm:text-base"
                maxLength={200}
              />
              <p className="text-xs text-orange-600/70 mt-1">
                {title.length}/200
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-orange-700 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                Question Details
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your question in detail…"
                rows={5}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none text-sm sm:text-base"
                maxLength={2000}
              />
              <p className="text-xs text-orange-600/70 mt-1">
                {description.length}/2000
              </p>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-orange-700 font-semibold mb-3 text-sm sm:text-base">
                I'm asking as
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="tourist"
                    checked={authorRole === "tourist"}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="flex items-center gap-2 text-orange-700 text-sm">
                    <Map className="w-4 h-4" />
                    Tourist
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="resident"
                    checked={authorRole === "resident"}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="flex items-center gap-2 text-orange-700 text-sm">
                    <Home className="w-4 h-4" />
                    Local / Resident
                  </span>
                </label>
              </div>
            </div>

            {/* Privacy */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showProfile}
                  onChange={(e) => setShowProfile(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="flex items-center gap-2 text-orange-700 text-sm">
                  {showProfile ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                  Show my profile publicly
                </span>
              </label>
              <p className="text-xs text-orange-600/70 mt-2">
                {showProfile
                  ? "Your name will be visible with your question"
                  : "Your question will be posted anonymously"}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-amber-100">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:flex-1 px-4 py-2.5 bg-white border border-amber-200 text-orange-700 font-semibold rounded-lg hover:bg-amber-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Posting..." : "Post Question"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
