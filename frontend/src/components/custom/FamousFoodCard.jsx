import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, IndianRupee, MapPin, Utensils } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function FamousFoodCard({ food }) {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const images = food.images ?? [];
  const places = food.places ?? [];

  // Auto image rotation
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [images.length]);

  // Calculate avg price safely
  const numericPrices = places
    .map((p) => parseInt(p.price?.replace(/[^\d]/g, ""), 10))
    .filter(Boolean);

  const avgPrice =
    numericPrices.length > 0
      ? Math.round(
          numericPrices.reduce((a, b) => a + b, 0) / numericPrices.length
        )
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        onClick={() => navigate(`/famous-food/${food._id}`)}
        className="group relative overflow-hidden rounded-3xl cursor-pointer
        border border-amber-200 shadow-lg hover:shadow-[0_10px_40px_rgba(255,180,0,0.4)]
        transition-all duration-500"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          {images.length > 0 && (
            <img
              src={images[currentImage]}
              alt={food.foodName}
              className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent rounded-3xl"></div>
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 h-80 flex flex-col justify-end px-4 pb-4">

          {/* Title + Rating */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-2xl font-bold text-yellow-300 drop-shadow-md">
              {food.foodName}
            </h3>

            <div className="flex items-center text-yellow-200 text-sm">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300 mr-1" />
              {food.rating ?? 0}
              <span className="text-yellow-100/70 ml-1">
                ({(food.totalRatings ?? 0).toLocaleString()})
              </span>
            </div>
          </div>

          {/* Category */}
          {food.category && (
            <p className="text-sm text-yellow-100 opacity-90 mb-2 flex items-center gap-1">
              <Utensils className="w-4 h-4 text-orange-500" />
              {food.category}
            </p>
          )}

          {/* Average Price */}
          {avgPrice && (
            <p className="text-sm text-yellow-100/90 mb-2 flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-orange-500" />
              Avg Price: ₹{avgPrice}
            </p>
          )}

          {/* Places */}
          {places.length > 0 && (
            <p className="text-yellow-200/90 text-sm font-medium flex items-center gap-1">
              <MapPin className="w-4 h-4 text-orange-500" />
              Available at:{" "}
              <span className="text-yellow-100/80">
                {places
                  .slice(0, 2)
                  .map((p) => p.placeName)
                  .join(", ")}
                {places.length > 2 && ` +${places.length - 2} more`}
              </span>
            </p>
          )}
        </div>

        {/* Hover shimmer */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition duration-500
          bg-gradient-to-r from-yellow-400/20 via-orange-300/20 to-red-400/20 rounded-3xl"
        ></div>
      </Card>
    </motion.div>
  );
}
