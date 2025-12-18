import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function FamousSpotCard({ spot }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % spot.images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [spot.images.length]);

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
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={spot.images[currentImage]}
            alt={spot.name}
            className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent rounded-3xl"></div>
        </div>

        {/* Overlay content */}
        <div className="relative z-10 h-80 flex flex-col justify-end pl-4 pr-4">
          {/* Top line: name left, rating right */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-2xl font-bold text-yellow-300 drop-shadow-md ">
              {spot.name}
            </h3>

            {/* Rating on right */}
            <div className="flex items-center text-yellow-200 text-sm">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300 mr-1" />
              {spot.rating}
              <span className="text-yellow-100/70 ml-1 outfit">
                ({spot.totalRatings.toLocaleString()})
              </span>
            </div>
          </div>

          {/* Location */}
          <p className="text-sm text-yellow-100 opacity-90 mb-3 outfit">
            📍 {spot.location}
          </p>

          {/* Entry fee and timing */}
          <div className="text-yellow-100/90 text-sm leading-relaxed space-y-1 outfit">
            <p>
              💰 Entry Fee:{" "}
              {spot.entryFee > 0 ? `₹${spot.entryFee}` : "Free"}
            </p>
            <p>
              🕒 {spot.openingTime}  {spot.closingTime}
            </p>
          </div>
        </div>

        {/* Hover shimmer */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition duration-500 bg-gradient-to-r from-yellow-400/20 via-orange-300/20 to-red-400/20 rounded-3xl"></div>
      </Card>
    </motion.div>
  );
}
