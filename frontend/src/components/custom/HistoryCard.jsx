"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function HistoryCard({ place }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % place.images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [place.images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        className="group relative overflow-hidden rounded-3xl cursor-pointer
                   border border-amber-200 shadow-lg hover:shadow-[0_10px_40px_rgba(255,180,0,0.4)]
                   transition-all duration-500"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={place.images[currentImage]}
            alt={place.name}
            className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent rounded-3xl"></div>
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 h-80 flex flex-col justify-end px-4 pb-4">
          {/* Name + Rating */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-2xl font-bold text-yellow-300 drop-shadow-md">
              {place.name}
            </h3>
            <div className="flex items-center text-yellow-200 text-sm">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300 mr-1" />
              {place.rating}
              <span className="text-yellow-100/70 ml-1 outfit">
                ({place.totalReviews.toLocaleString()})
              </span>
            </div>
          </div>

          {/* Category */}
          <p className="text-sm text-yellow-100 opacity-90 mb-2 outfit">
            🏷️ {place.category}
          </p>

          {/* Era */}
          <p className="text-sm text-yellow-100/90 outfit mb-2">
            🕰️ Era: {place.era}
          </p>

          {/* Address */}
          <p className="text-yellow-200/90 text-sm font-medium outfit">
            📍 {place.address}
          </p>
        </div>

        {/* Hover shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition duration-500 bg-gradient-to-r from-yellow-400/20 via-orange-300/20 to-red-400/20 rounded-3xl"></div>
      </Card>
    </motion.div>
  );
}
