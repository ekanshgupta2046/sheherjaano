import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MessageCircle,
  Eye,
  Clock,
  MoreVertical,
  Trash2,
  Edit,
  Share2,
  ShieldCheck,
  User,
  MapPin,
  Heart,
  AlertCircle,
  Sparkles
} from "lucide-react";
import api from "@/api/axios";
import ReplyThread from "@/components/custom/Questions/ReplyThread";
import ReplyInput from "@/components/custom/Questions/ReplyInput";
import { useAuth } from "@/context/AuthProvider";

// --- Theme Constants ---
const THEME = {
  bg: "bg-[#FDF8F6]", 
  cardBg: "bg-white",
  primaryGradient: "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500",
  textGradient: "bg-clip-text text-transparent bg-gradient-to-r from-amber-800 via-orange-700 to-amber-900",
  subtleGradient: "bg-gradient-to-br from-amber-50 to-orange-50",
  fontHeading: "'Playfair Display', serif",
  fontBody: "'Outfit', sans-serif",
};

export default function QuestionDetail() {
  const { cityName, stateName, questionId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // 1. Inject Theme Fonts Dynamically
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    fetchQuestion();
    fetchReplies();
  }, [questionId]);

  const handleNestedReplyAdded = () => {
  fetchReplies();  // Reload threaded reply tree correctly
};


  const fetchQuestion = async () => {
    try {
      const res = await api.get(`/questions/detail/${questionId}`);
      setQuestion(res.data.question);
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      setRepliesLoading(true);
      const res = await api.get(`/replies/question/${questionId}`);
      setReplies(res.data.replies);
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setRepliesLoading(false);
    }
  };

  const handleReplyCreated = (newReply) => {
    setReplies([newReply, ...replies]);
    setQuestion({ ...question, replyCount: question.replyCount + 1 });
  };

  const handleDeleteQuestion = async () => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await api.delete(`/questions/${questionId}`);
        navigate(`/city/${stateName}/${cityName}/questions`);
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  // Helper to check authorship
  const isAuthor = auth.user && question && auth.user._id === question.authorId;

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col justify-center items-center ${THEME.bg}`}>
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full border-4 border-amber-200 opacity-30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 animate-spin"></div>
        </div>
        <p className="mt-4 text-amber-800 font-medium font-serif animate-pulse">Loading Discussion...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className={`min-h-screen flex flex-col justify-center items-center ${THEME.bg}`}>
        <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-amber-100 text-center max-w-md">
          <MessageCircle className="w-16 h-16 text-amber-300 mb-6 mx-auto" />
          <h2 className="text-2xl font-bold text-stone-800 mb-2" style={{ fontFamily: THEME.fontHeading }}>
            Discussion Not Found
          </h2>
          <p className="text-stone-500 mb-6" style={{ fontFamily: THEME.fontBody }}>
            This question may have been removed or represents a hidden gem we can't find yet.
          </p>
          <button
            onClick={() => navigate(`/city/${stateName}/${cityName}/questions`)}
            className={`${THEME.primaryGradient} text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all`}
          >
            Return to Forum
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className={`min-h-screen relative overflow-hidden ${THEME.bg}`} style={{ fontFamily: THEME.fontBody }}>
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-orange-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl relative z-10">
        
        {/* Navigation Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Question Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-[2rem] shadow-xl shadow-amber-900/5 border border-amber-100/80 overflow-hidden ${THEME.cardBg} relative group`}
            >
              <div className={`w-full h-2 ${THEME.primaryGradient}`} />
              <div className="p-8 md:p-10">
                {/* Header: Author Info */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-[2px] rounded-full bg-gradient-to-br from-amber-400 to-orange-300">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-amber-800 font-bold font-serif text-lg">
                        {question.showAuthorProfile ? question.authorName.charAt(0).toUpperCase() : <User className="w-6 h-6 opacity-50"/>}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-stone-800 text-lg">
                          {question.showAuthorProfile ? question.authorName : "Anonymous"}
                        </h3>
                        {question.isVerifiedAuthor && (
                          <ShieldCheck className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-stone-400 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          question.authorRole === "resident" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {question.authorRole === "resident" ? "Local Resident" : "Tourist"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-stone-300"/>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(question.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Show Menu only if current user is author */}

                </div>

                <h1 
                  className={`text-3xl md:text-5xl font-bold mb-6 leading-tight pb-1 ${THEME.textGradient}`}
                  style={{ fontFamily: THEME.fontHeading }}
                >
                  {question.title}
                </h1>

                <div className="text-stone-600 text-lg leading-relaxed mb-8 font-light tracking-wide border-l-2 border-amber-100 pl-4">
                  {question.description}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-amber-50">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-amber-700 font-medium px-3 py-1 bg-amber-50 rounded-lg">
                      <MessageCircle className="w-4 h-4" />
                      <span>{question.replyCount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-500 font-medium px-3 py-1">
                      <Eye className="w-4 h-4" />
                      <span>{question.viewCount}</span>
                    </div>
                  </div>
                  <button onClick={handleDeleteQuestion} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm flex items-center gap-2">
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                </div>
              </div>
            </motion.div>

            {/* Reply Section */}
            <div className="pt-4">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-stone-800" style={{ fontFamily: THEME.fontHeading }}>
                  Community Insights
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              {/* LOGIC: 
                  1. If not logged in -> Show Login Prompt
                  2. If logged in & NOT Author -> Show Input 
                  3. If logged in & Author -> Show Nothing (Input hidden)
              */}
              {!auth.user ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${THEME.subtleGradient} rounded-[2rem] p-8 text-center border border-amber-100 mb-8`}>
                  <p className="text-amber-900/80 text-lg font-serif mb-4">"Join our community to unlock local secrets."</p>
                  <button onClick={() => navigate("/signin")} className={`${THEME.primaryGradient} text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-orange-200 transition-all`}>
                    Login to Contribute
                  </button>
                </motion.div>
              ) : !isAuthor ? (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 bg-white p-2 rounded-2xl shadow-sm border border-stone-100">
                    <ReplyInput questionId={questionId} onReplyCreated={handleReplyCreated} />
                 </motion.div>
              ) : (
                // If Author, render nothing or a simple spacer
                null
              )}

              <div className="space-y-6">
                {repliesLoading ? (
                   <div className="space-y-4">
                     {[1,2].map(i => <div key={i} className="h-32 bg-white/50 rounded-2xl animate-pulse"/>)}
                   </div>
                ) : replies.length > 0 ? (
                  <ReplyThread replies={replies} onReplyDeleted={() => fetchReplies()} currentUserId={auth.user?._id} onNestedReplyAdded={handleNestedReplyAdded}/>
                ) : (
                  <div className="py-12 text-center bg-white/40 rounded-[2rem] border border-dashed border-stone-300">
                    <MessageCircle className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500 font-serif text-lg">No insights shared yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar with Guidelines */}
          <div className="hidden lg:block lg:col-span-4 space-y-6">
             
             {/* Guidelines Card */}
             <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-lg shadow-stone-200/50 sticky top-24">
                
                {/* About City Context */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3 text-amber-600">
                    <MapPin className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">SheherJaano Forum</span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-800 mb-3" style={{ fontFamily: THEME.fontHeading }}>
                    Discussion Etiquette
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    To keep our community helpful and welcoming, please adhere to these golden rules:
                  </p>
                </div>

                {/* Rules List */}
                <ul className="space-y-5">
                  <li className="flex items-start gap-3">
                     <div className="mt-0.5 p-1.5 bg-rose-50 rounded-lg shrink-0">
                        <Heart className="w-4 h-4 text-rose-500" />
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-stone-800">Cultivate Kindness</h4>
                       <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                         Abusive language, hate speech, or harassment is strictly prohibited. Let's keep the conversation warm.
                       </p>
                     </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                     <div className="mt-0.5 p-1.5 bg-blue-50 rounded-lg shrink-0">
                        <AlertCircle className="w-4 h-4 text-blue-500" />
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-stone-800">Stay Relevant</h4>
                       <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                         Ensure your contributions add value to the city's narrative. Avoid spam or unrelated topics.
                       </p>
                     </div>
                  </li>

                  <li className="flex items-start gap-3">
                     <div className="mt-0.5 p-1.5 bg-amber-50 rounded-lg shrink-0">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-stone-800">Be Authentic</h4>
                       <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                         Share genuine experiences. Authenticity helps fellow travelers the most.
                       </p>
                     </div>
                  </li>
                </ul>

             </div>
          </div>

        </div>
      </div>
    </section>
  );
}