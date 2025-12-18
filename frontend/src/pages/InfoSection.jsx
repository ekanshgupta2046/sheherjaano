"use client";

import InfoCard from "@/components/custom/InfoCard";
import data from "@/assets/data/famousSpots";
const { famousPeople } = data;

export default function InfoSection() {
  console.log("💬 InfoSection mounted");

  return (
    <section className="relative min-h-screen py-12 bg-gradient-to-b from-orange-50 via-amber-100 to-yellow-50 overflow-hidden">
      {/* ✨ Golden Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-200/30 via-yellow-100/10 to-transparent pointer-events-none"></div>

      {/* 👥 Content Container */}
      <div className="relative container mx-auto px-6 z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
            Meet the Locals & Guides
          </h2>
          <p className="text-lg text-orange-800 font-medium">
            Connect with friendly locals and guides for an authentic experience of Mumbai.
          </p>
          <div className="mt-6 w-28 h-1 mx-auto bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow"></div>
        </div>

        {/* 🗣️ Cards Grid */}
        <div className="space-y-6">
          {famousPeople.map((person, i) => (
            <InfoCard key={i} person={person} />
          ))}
        </div>

        {/* ☀️ Subtle Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-radial from-amber-200/30 to-transparent blur-3xl pointer-events-none"></div>
      </div>
    </section>
  );
}
