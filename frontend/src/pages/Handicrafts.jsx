"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HandicraftsCard from "@/components/custom/HandicraftsCard";
import api from "@/api/axios";

export default function Handicrafts() {
  const [handicrafts, setHandicrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { stateName, cityName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHandicrafts = async () => {
      try {
        setLoading(true);

        const res = await api.get("/handicrafts", {
          params: {
            state: stateName,
            city: cityName,
          },
        });

        setHandicrafts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch handicrafts:", err);
        setError("Failed to load handicrafts");
      } finally {
        setLoading(false);
      }
    };

    fetchHandicrafts();
  }, [stateName, cityName]);

  return (
    <section className="relative min-h-screen py-12 bg-gradient-to-b from-orange-50 via-amber-100 to-yellow-50 overflow-hidden">
      <div className="relative container mx-auto px-6 z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
            Handicrafts of {cityName}
          </h2>
          <p className="text-lg text-orange-800 font-medium">
            Discover {cityName}’s artistry through its timeless handmade treasures.
          </p>
          <div className="mt-6 w-28 h-1 mx-auto bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow"></div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-orange-700 text-lg">
            Loading handicrafts...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-600 text-lg">
            {error}
          </p>
        )}

        {/* Cards Grid */}
        {!loading && !error && (
          <div
            className="
              grid
              gap-8
              justify-items-center
              [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]
            "
          >
            {handicrafts.length === 0 ? (
              <p className="text-orange-700 text-lg">
                No handicrafts found for this city yet.
              </p>
            ) : (
              handicrafts.map((craft) => (
                <div
                  key={craft._id}
                  className="w-full max-w-sm cursor-pointer"
                  onClick={() => navigate(`/handicraft/${craft._id}`)}
                >
                  <HandicraftsCard craft={craft} />
                </div>
              ))
            )}
          </div>
        )}

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-radial from-amber-200/30 to-transparent blur-3xl pointer-events-none"></div>
      </div>
    </section>
  );
}
