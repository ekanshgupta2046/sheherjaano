"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FamousHistoryCard from "@/components/custom/HistoryCard";
import api from "@/api/axios";

export default function HistorySection() {
  const { cityName, stateName } = useParams();
  console.log("🏛️ HistorySection mounted", cityName, stateName);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cityName || !stateName) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get("/history", {
          params: {
            city: cityName,
            state: stateName,
          },
        });

        setHistory(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError("Failed to load historical places");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [cityName, stateName]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-orange-700 text-lg font-semibold">
          Loading historical places in {cityName}...
        </p>
      </section>
    );
  }

  if (!loading && history.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-orange-700 text-lg font-semibold">
          No historical places found for this city.
        </p>
      </section>
    );
  }

  const city =
    cityName.charAt(0).toUpperCase() + cityName.slice(1);

  return (
    <section className="relative min-h-screen py-12 bg-gradient-to-b from-orange-50 via-amber-100 to-yellow-50 overflow-hidden">
      <div className="relative container mx-auto px-6 z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
            Historical Places of {city}
          </h2>
          <p className="text-lg text-orange-800 font-medium">
            Explore the rich heritage and timeless stories of this city
          </p>
          <div className="mt-6 w-28 h-1 mx-auto bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow"></div>
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
          {history.map((place) => (
            <div key={place._id} className="w-full max-w-sm">
              <FamousHistoryCard place={place} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
