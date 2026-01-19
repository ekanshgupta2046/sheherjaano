"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FamousFoodCard from "@/components/custom/FamousFoodCard";
import api from "@/api/axios";

export default function FamousFoods() {
  const { cityName, stateName } = useParams();
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("🍽️ FamousFoods mounted:", cityName, stateName);

  useEffect(() => {
    if (!cityName || !stateName) return;

    const fetchFoods = async () => {
      try {
        setLoading(true);

        const res = await api.get("/famous-food", {
          params: {
            city: cityName,
            state: stateName,
          },
        });

        setFoods(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch famous foods:", err);
        setError("Failed to load foods");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [cityName, stateName]);

  // Capitalized text for UI
  const city = cityName
    ? cityName.charAt(0).toUpperCase() + cityName.slice(1)
    : "";

  const state = stateName
    ? stateName.charAt(0).toUpperCase() + stateName.slice(1)
    : "";

  // Loading
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-orange-700 text-lg font-semibold">
          Loading famous foods in {city}...
        </p>
      </section>
    );
  }

  // Empty state
  if (!loading && foods.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-orange-700 text-lg font-semibold">
          No famous foods found in {city}.
        </p>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen py-12 bg-gradient-to-b from-amber-50 via-orange-100 to-yellow-50 overflow-hidden">
      <div className="relative container mx-auto px-6 z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-amber-500 via-orange-600 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
            Famous Foods of {city}
          </h2>
          <p className="text-lg text-orange-900 font-medium">
            Relish iconic dishes and street flavors loved by locals
          </p>
          <div className="mt-6 w-28 h-1 mx-auto bg-gradient-to-r from-orange-400 to-yellow-300 rounded-full shadow"></div>
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
          {foods.map((food) => (
            <div
              key={food._id}
              className="w-full max-w-sm cursor-pointer"
              onClick={() => navigate(`/famous-food/${food._id}`)}
            >
              <FamousFoodCard food={food} />
            </div>
          ))}
        </div>

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-radial from-orange-200/30 to-transparent blur-3xl pointer-events-none"></div>
      </div>
    </section>
  );
}
