"use client";

import React from "react";
import { MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InfoCard({ person }) {
  return (
    <div
      className="
        flex items-center justify-between gap-6 
        bg-gradient-to-r from-orange-50 via-amber-100 to-yellow-50 
        border border-amber-200/50 shadow-md 
        rounded-2xl p-4 transition-all duration-300 
        hover:shadow-lg hover:scale-[1.02]
      "
    >
      {/* 🖼️ Profile Photo */}
      <div className="flex-shrink-0">
        <img
          src={person.image || "/images/defaultProfile.jpg"}
          alt={person.name}
          className="w-16 h-16 rounded-full border-2 border-amber-400 object-cover"
        />
      </div>

      {/* 👤 Info Section */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-amber-800 truncate">
          {person.name}
        </h3>
        <p
          className={`text-sm ${
            person.role === "Guide"
              ? "text-blue-700 font-medium"
              : "text-green-700 font-medium"
          }`}
        >
          {person.role}
        </p>

        <p className="text-sm text-amber-700/80 mt-1 truncate">
          📞 {person.contactMethod || "Not available"}
        </p>
      </div>

      {/* ⭐ Ratings */}
      <div className="flex flex-col items-end">
        <div className="flex items-center text-amber-600">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="text-base font-semibold">
            {person.rating ?? "—"}
          </span>
        </div>
        <p className="text-xs text-amber-800/70">
          ({(person.totalReviews ?? 0).toLocaleString()} reviews)
        </p>

        {/* 💬 Chat Button */}
        <Button
          size="sm"
          className="mt-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-sm"
          onClick={() => alert(`Chat with ${person.name}`)}
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          Chat
        </Button>
      </div>
    </div>
  );
}
