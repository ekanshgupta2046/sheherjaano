"use client";

import FamousHistoryCard from "@/components/custom/HistoryCard";
import data from "@/assets/data/famousSpots";
const { famousHistory } = data;

export default function HistorySection() {
  console.log("🏛️ HistorySection mounted");

  return (
    <section className="relative min-h-screen py-12 bg-gradient-to-b from-orange-50 via-amber-100 to-yellow-50 overflow-hidden">
      {/* ✨ Golden Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-200/20 via-yellow-100/10 to-transparent pointer-events-none"></div>

      {/* 🏰 Content Container */}
      <div className="relative container mx-auto px-6 z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
            Historical Places of Mumbai
          </h2>
          <p className="text-lg text-orange-800 font-medium">
            Explore Mumbai’s rich heritage — from ancient temples to colonial landmarks.
          </p>
          <div className="mt-6 w-28 h-1 mx-auto bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow"></div>
        </div>

        {/* 🏛️ Cards Grid */}
        <div
          className="
            grid
            gap-8
            justify-items-center
            [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]
          "
        >
          {famousHistory.map((place, i) => (
            <div key={i} className="w-full max-w-sm">
              <FamousHistoryCard place={place} />
            </div>
          ))}
        </div>

        {/* ☀️ Subtle Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-radial from-amber-200/30 to-transparent blur-3xl pointer-events-none"></div>
      </div>
    </section>
  );
}
