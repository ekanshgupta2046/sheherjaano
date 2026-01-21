"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/api/axios";
import {
  ArrowLeft,
  MapPin,
  Star,
  ExternalLink,
  Youtube,
  Instagram,
  Share2,
  Heart,
} from "lucide-react";

// Map component
import DynamicMap from "@/components/custom/DynamicMap";

export default function FamousFoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await api.get(`/famous-food/${id}`);
        setFood(res.data.data);
      } catch (err) {
        console.error("Failed to fetch food", err);
      } finally {
        setLoading(false);
      }
    };

    

    fetchFood();
    window.scrollTo(0, 0);
  }, [id]);

    useEffect(() => {
    const images = food?.images;

    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [food?.images?.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7ED]">
        <div className="w-14 h-14 border-4 border-amber-300 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl sm:text-2xl font-serif text-amber-900">
        Food not found.
      </div>
    );
  }

  /* -------- PRIMARY PLACE -------- */
  const primaryPlace = food.places?.[0];
  const hasCoords = primaryPlace?.geometry?.coordinates?.length === 2;

  const lat = hasCoords ? primaryPlace.geometry.coordinates[1] : null;
  const lng = hasCoords ? primaryPlace.geometry.coordinates[0] : null;

  const googleMapsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        `${primaryPlace?.placeName || food.foodName} ${food.city} ${food.state}`
      )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] via-[#FFF3D6] to-[#FFFBEA]">

      {/* ============= HERO ============= */}
      <div className="relative h-[55vh] sm:h-[65vh] lg:h-[75vh] overflow-hidden">

                <div className="absolute inset-0">
  {food.images.map((img, index) => (
    <motion.div
      key={img}
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        imageRendering: "auto",
      }}
      animate={{ opacity: index === currentImage ? 1 : 0 }}
      transition={{ duration: 1.2 }}
    />
  ))}
</div>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 bg-white/70 p-2 sm:p-3 rounded-full shadow-md hover:bg-white transition"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800" />
        </motion.button>

        <img
          src={food.images?.[0] || "/placeholder-image.jpg"}
          alt={food.foodName}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-amber-600/30 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 md:p-16 text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-semibold leading-tight mb-3">
            {food.foodName}
          </h1>

          <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-lg text-amber-100">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-300" />
              {food.city}, {food.state}
            </div>

            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-lg">
              <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-300 fill-yellow-300" />
              <span>{food.rating > 0 ? food.rating.toFixed(1) : "New"}</span>
              <span className="text-xs opacity-75">
                ({food.totalRatings ?? 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============= CONTENT ============= */}
      {/* ============= CONTENT ============= */}
{/* ============= CONTENT ============= */}
<div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 -mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">

  {/* LEFT COLUMN */}
  <div className="lg:col-span-2 space-y-8 sm:space-y-12">

    {/* ABOUT FOOD */}
    <section className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-lg border border-amber-100">
      <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-amber-900 mb-4 sm:mb-6">
        About the Food
      </h2>

      <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line">
        {food.description || "No description available."}
      </p>

      {(food.videoLink || food.instagramLink) && (
        <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-amber-100">
          {food.videoLink && (
            <a
              href={food.videoLink}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm"
            >
              <Youtube className="w-4 h-4" /> Watch Video
            </a>
          )}

          {food.instagramLink && (
            <a
              href={food.instagramLink}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 text-sm"
            >
              <Instagram className="w-4 h-4" /> Instagram
            </a>
          )}
        </div>
      )}
    </section>

    {/* MAP */}
    {hasCoords && (
      <section className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-[2.5rem] shadow-lg border border-amber-100 h-[300px] sm:h-[420px]">
        <DynamicMap
          defaultLat={lat}
          defaultLng={lng}
          city={food.city}
          state={food.state}
        />
      </section>
    )}
  </div>

  {/* RIGHT COLUMN */}
  <div className="space-y-6 sm:space-y-8 lg:sticky lg:top-24 h-fit">

    {/* AVAILABLE AT — moves to right on desktop */}
    <section className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-lg border border-amber-200">
      <h3 className="text-xl sm:text-2xl font-serif font-semibold text-amber-900 mb-5 sm:mb-6">
        Available At
      </h3>

      <div className="space-y-4 sm:space-y-6">
        {food.places?.map((place, i) => {
          const hasP = place.geometry?.coordinates?.length === 2;
          const pLat = hasP ? place.geometry.coordinates[1] : null;
          const pLng = hasP ? place.geometry.coordinates[0] : null;

          const placeMapUrl = hasP
            ? `https://www.google.com/maps/dir/?api=1&destination=${pLat},${pLng}`
            : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                `${place.placeName} ${food.city} ${food.state}`
              )}`;

          return (
            <div key={i} className="border-b pb-4 last:border-none">
              <p className="font-semibold text-amber-900 text-sm sm:text-base">
                {place.placeName}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">{place.address}</p>

              <a
                href={placeMapUrl}
                target="_blank"
                className="inline-flex items-center gap-1 text-amber-700 text-xs sm:text-sm mt-2 hover:underline"
              >
                Directions <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          );
        })}
      </div>
    </section>

    {/* GET DIRECTIONS — ONLY GRADIENT DIV */}
    {primaryPlace && (
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 sm:p-8 rounded-2xl text-white shadow-lg">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-white text-amber-800 font-semibold py-3 sm:py-4 rounded-xl hover:bg-amber-50 transition"
        >
          Get Directions <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
      </div>
    )}
  </div>
</div>


    </div>
  );
}
