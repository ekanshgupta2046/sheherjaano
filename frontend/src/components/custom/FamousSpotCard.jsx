import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, IndianRupee, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function FamousSpotCard({ spot }) {
  const [currentImage, setCurrentImage] = useState(0);

  // Auto image changer
  useEffect(() => {
    if (!spot.images || spot.images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % spot.images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [spot.images]);

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
            src={spot.images[currentImage] || "/placeholder.jpg"}
            alt={spot.spotName}
            className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent rounded-3xl"></div>
        </div>

        {/* Overlay content */}
        <div className="relative z-10 h-80 flex flex-col justify-end px-4">

          {/* Title */}
          <h3 className="text-2xl font-bold text-yellow-300 drop-shadow-md mb-2">
            {spot.spotName}
          </h3>

          {/* Location */}
          {spot.address && (
            <p className="text-sm text-yellow-100 opacity-90 mb-3 outfit flex items-center gap-1">
              <MapPin className="w-4 h-4 text-orange-500" />
              {spot.address}
            </p>
          )}

          {/* Entry fee + Timing */}
          <div className="text-yellow-100/90 text-sm leading-relaxed space-y-1 outfit">

            {/* Entry fee */}
            {typeof spot.entryFee === "number" && (
              <p className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-orange-500" />
                {spot.entryFee > 0 ? `₹${spot.entryFee}` : "Free"}
              </p>
            )}

            {/* Opening hours */}
            {spot.openingHours && (
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                {spot.openingHours}
              </p>
            )}
          </div>
        </div>

        {/* Hover shimmer */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition duration-500 bg-gradient-to-r from-yellow-400/20 via-orange-300/20 to-red-400/20 rounded-3xl"></div>
      </Card>
    </motion.div>
  );
}
