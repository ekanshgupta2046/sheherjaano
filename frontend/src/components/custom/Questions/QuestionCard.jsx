import { 
  MessageCircle, 
  Eye, 
  Clock, 
  Home, 
  Map, 
  CheckCircle, 
  User 
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function QuestionCard({ question }) {
  const isResident = question.authorRole === "resident";
  
  // Dynamic styling for the "Role" badge to match the Hero's gradient feel
  // We use gradients similar to the hero button but color-coded for context
  const roleConfig = isResident
    ? {
        label: "Local",
        icon: Home,
        // Green-ish gradient, but kept warm/soft
        badgeClass: "bg-gradient-to-r from-emerald-100 via-emerald-50 to-white text-emerald-800 border-emerald-100",
        iconColor: "text-emerald-600"
      }
    : {
        label: "Tourist",
        icon: Map,
        // Blue-ish gradient, kept soft
        badgeClass: "bg-gradient-to-r from-blue-100 via-blue-50 to-white text-blue-800 border-blue-100",
        iconColor: "text-blue-600"
      };

  const RoleIcon = roleConfig.icon;

  return (
    <Card className="group cursor-pointer p-6 rounded-3xl border border-orange-100 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(249,115,22,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(249,115,22,0.25)] hover:border-orange-200 transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-5">
        <div className="flex-1 space-y-3">
          
          {/* Header Section */}
          <div>
            {/* Title: Using Montserrat to match Hero Heading */}
            <h3 className="montserrat text-xl font-bold text-orange-700 group-hover:text-orange-500 transition-colors line-clamp-1 mb-2">
              {question.title}
            </h3>
            
            {/* Description: Using Outfit to match Hero Body */}
            <p className="outfit text-gray-600/90 text-sm leading-relaxed line-clamp-2 font-light">
              {question.description}
            </p>
          </div>

          {/* Footer: Tags & Author */}
          <div className="flex items-center gap-3 flex-wrap mt-2">
            
            {/* Author Badge */}
            <div className="flex items-center gap-2 pr-3 py-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-[10px] shadow-sm border border-white">
                {question.showAuthorProfile
                  ? question.authorName.charAt(0).toUpperCase()
                  : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="outfit text-orange-300 font-medium text-sm">
                {question.showAuthorProfile ? question.authorName : "Anonymous"}
              </span>
            </div>

            {/* Role Badge - Matches Hero Button Style */}
            <span
              className={`outfit flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${roleConfig.badgeClass}`}
            >
              <RoleIcon className={`w-3.5 h-3.5 ${roleConfig.iconColor}`} />
              {roleConfig.label}
            </span>

            {/* Verified Badge */}
            {question.isVerifiedAuthor && (
              <span className="outfit flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-50 text-amber-800 border border-amber-100 shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Right Section: Stats & Time */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:pl-5 sm:border-l border-orange-100/50 min-w-fit mt-2 sm:mt-0">
          
           {/* Date */}
           <span className="outfit text-orange-900/40 text-[11px] font-medium flex items-center gap-1.5 bg-orange-50/50 px-2 py-1 rounded-full">
               <Clock className="w-3 h-3" />
               {new Date(question.createdAt).toLocaleDateString()}
            </span>

          {/* Engagement Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-orange-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="outfit text-xs font-bold text-gray-600 group-hover:text-orange-600">{question.replyCount}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-orange-600 transition-colors">
              <Eye className="w-4 h-4" />
              <span className="outfit text-xs font-bold text-gray-600 group-hover:text-orange-600">{question.viewCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}