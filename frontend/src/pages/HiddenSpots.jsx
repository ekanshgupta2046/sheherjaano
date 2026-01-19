"use client";

import { useEffect, useState } from "react";
import api from "@/api/axios";
import FamousSpotCard from "@/components/custom/FamousSpotCard";
import { useParams, useNavigate } from "react-router-dom";

export default function HiddenSpots() {
  const { cityName, stateName } = useParams();
  const navigate = useNavigate();

  const [hiddenSpots, setHiddenSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("📍 HiddenSpots mounted:", cityName, stateName);

  useEffect(() => {
    if (!cityName || !stateName) return;

    const fetchHiddenSpots = async () => {
      try {
        setLoading(true);

        const res = await api.get("/hidden-spots", {
          params: {
            city: cityName,
            state: stateName,
          },
        });

        setHiddenSpots(res.data.data || []);
      } catch (err) {
        console.error("❌ Failed to load hidden spots:", err);
        setError("Failed to load hidden spots");
      } finally {
        setLoading(false);
      }
    };

    fetchHiddenSpots();
  }, [cityName, stateName]);

  // Capitalize city for heading
  const city =
    cityName?.charAt(0).toUpperCase() + cityName?.slice(1);

  const state =
    stateName?.charAt(0).toUpperCase() + stateName?.slice(1);

  // Loading screen
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-orange-700 text-lg font-semibold">
          Loading hidden spots in {city}...
        </p>
      </section>
    );
  }

  // Empty state
  if (!loading && hiddenSpots.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-orange-700 text-lg font-semibold">
          No hidden spots found for this city.
        </p>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen py-12 bg-gradient-to-b from-orange-50 via-amber-100 to-yellow-50 overflow-hidden">
      <div className="relative container mx-auto px-6 z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
            Hidden Spots of {city}
          </h2>
          <p className="text-lg text-orange-800 font-medium">
            Step off the beaten path to discover this city’s hidden gems.
          </p>
          <div className="mt-6 w-28 h-1 mx-auto bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow" />
        </div>

        {/* Cards Grid */}
        <div
          className="
            grid
            gap-8
            justify-items-center
            [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]
          "
        >
          {hiddenSpots.map((spot) => (
            <div
              key={spot._id}
              className="w-full max-w-sm"
              onClick={() => navigate(`/hidden-spot/${spot._id}`)}
            >
              <FamousSpotCard spot={spot} />
            </div>
          ))}
        </div>

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-radial from-amber-200/30 to-transparent blur-3xl pointer-events-none"></div>
      </div>
    </section>
  );
}
