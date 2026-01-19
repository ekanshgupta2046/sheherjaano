import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, MessageCircle, Eye, Clock } from "lucide-react";
import api from "@/api/axios";
import { Card } from "@/components/ui/card";
import QuestionCard from "@/components/custom/Questions/QuestionCard";
import AskQuestionModal from "@/components/custom/Questions/AskQuestionModal";

export default function QuestionsHub() {
  const { cityName, stateName } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showAskModal, setShowAskModal] = useState(false);
  const [pages, setPages] = useState(0);

  const displayCity = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  const displayState = stateName.charAt(0).toUpperCase() + stateName.slice(1);

  useEffect(() => {
    fetchQuestions();
  }, [cityName, stateName, page]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/questions/${stateName}/${cityName}?page=${page}&limit=10`
      );
      setQuestions(res.data.questions);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionCreated = (newQuestion) => {
    setQuestions([newQuestion, ...questions]);
    setTotal(total + 1);
    setShowAskModal(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-white py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-500 bg-clip-text text-transparent">
            Ask About {displayCity}
          </h1>
          <p className="text-lg text-orange-700 max-w-2xl mx-auto mb-6">
            Have a question about {displayCity}? Ask the locals and tourists who know it best. Share your knowledge and help others discover the real {displayCity}.
          </p>

          {/* Ask Question Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAskModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Ask a Question
          </motion.button>
        </motion.div>

        {/* Questions Count */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8 text-orange-700/70 text-sm"
          >
            <p>
              {total} question{total !== 1 ? "s" : ""} • Page {page} of {pages}
            </p>
          </motion.div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
            </div>
          ) : questions.length > 0 ? (
            questions.map((question, index) => (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() =>
                  navigate(
                    `/city/${stateName}/${cityName}/questions/${question._id}`
                  )
                }
              >
                <QuestionCard question={question} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <MessageCircle className="w-16 h-16 mx-auto text-amber-300 mb-4 opacity-50" />
              <p className="text-orange-700 text-lg font-medium mb-4">
                No questions yet. Be the first to ask!
              </p>
              <button
                onClick={() => setShowAskModal(true)}
                className="text-amber-600 hover:text-amber-700 font-semibold underline"
              >
                Ask the first question
              </button>
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center gap-4 mt-12"
          >
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-lg bg-white border border-amber-200 text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50 transition"
            >
              Previous
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 rounded-lg transition ${
                  page === p
                    ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 font-semibold"
                    : "bg-white border border-amber-200 text-amber-700 hover:bg-amber-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-lg bg-white border border-amber-200 text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50 transition"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <AskQuestionModal
          cityName={cityName}
          stateName={stateName}
          onClose={() => setShowAskModal(false)}
          onQuestionCreated={handleQuestionCreated}
        />
      )}
    </section>
  );
}
