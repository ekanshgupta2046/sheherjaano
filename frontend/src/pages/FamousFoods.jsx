"use client";

import FamousFoodCard from "@/components/custom/FamousFoodCard";
import data from "@/assets/data/famousSpots";
const { famousFoods } = data;

export default function FamousFoods() {
  console.log("✅ FamousFoods mounted");

  return (
    <section className="relative min-h-screen py-12 bg-gradient-to-b from-amber-50 via-orange-100 to-yellow-50 overflow-hidden">
      {/* ✨ Warm Glow */}

      {/* 🍴 Content Container */}
      <div className="relative container mx-auto px-6 z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-amber-500 via-orange-600 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
            Famous Foods of Mumbai
          </h2>
          <p className="text-lg text-orange-900 font-medium">
            Relish the taste of Mumbai through its legendary dishes and street flavors
          </p>
          <div className="mt-6 w-28 h-1 mx-auto bg-gradient-to-r from-orange-400 to-yellow-300 rounded-full shadow"></div>
        </div>

        {/* 🍲 Cards Grid */}
        <div
          className="
            grid
            gap-8
            justify-items-center
            [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]
          "
        >
          {famousFoods.map((food, i) => (
            <div key={i} className="w-full max-w-sm">
              <FamousFoodCard food={food} />
            </div>
          ))}
        </div>

        {/* ☀️ Subtle Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-radial from-orange-200/30 to-transparent blur-3xl pointer-events-none"></div>
      </div>
    </section>
  );
}
