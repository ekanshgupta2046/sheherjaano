"use client";

import HandicraftsCard from "@/components/custom/HandicraftsCard";
import data from "@/assets/data/famousSpots";
const { famousHandicrafts } = data;

export default function Handicrafts() {
  console.log("🧵 Handicrafts mounted");

  return (
    <section className="relative min-h-screen py-12 bg-gradient-to-b from-orange-50 via-amber-100 to-yellow-50 overflow-hidden">
      {/* ✨ Golden Glow */}

      {/* 🧶 Content Container */}
      <div className="relative container mx-auto px-6 z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
            Handicrafts of Mumbai
          </h2>
          <p className="text-lg text-orange-800 font-medium">
            Discover Mumbai’s artistry through its timeless handmade treasures.
          </p>
          <div className="mt-6 w-28 h-1 mx-auto bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow"></div>
        </div>

        {/* 🧵 Cards Grid */}
        <div
          className="
            grid
            gap-8
            justify-items-center
            [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]
          "
        >
          {famousHandicrafts.map((craft, i) => (
            <div key={i} className="w-full max-w-sm">
              <HandicraftsCard craft={craft} />
            </div>
          ))}
        </div>

        {/* ☀️ Subtle Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-radial from-amber-200/30 to-transparent blur-3xl pointer-events-none"></div>
      </div>
    </section>
  );
}
