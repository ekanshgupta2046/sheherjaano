"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import api from "@/api/axios";
import {
  MapPin,
  Star,
  Clock,
  Ticket,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Youtube,
  Instagram,
  Share2,
  Heart,
} from "lucide-react";

// Dynamic Map
import DynamicMap from "../components/custom/DynamicMap";

export default function FamousSpotDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isHidden = location.pathname.startsWith("/hidden-spot");

  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const endpoint = isHidden
          ? `/hidden-spots/${id}`
          : `/famous-spots/${id}`;
        const res = await api.get(endpoint);
        setSpot(res.data.data);
      } catch (err) {
        console.error("Failed to fetch spot", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpot();
    window.scrollTo(0, 0);
  }, [id, isHidden]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7ED]">
        <div className="w-14 h-14 border-4 border-amber-300 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl sm:text-2xl font-serif text-amber-900">
        Spot not found.
      </div>
    );
  }

  // GeoJSON Coords
  const hasCoords = spot.geometry?.coordinates?.length === 2;
  const dbLat = hasCoords ? spot.geometry.coordinates[1] : null;
  const dbLng = hasCoords ? spot.geometry.coordinates[0] : null;

  // Maps URL
  const googleMapsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${dbLat},${dbLng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        spot.spotName + " " + spot.city + " " + spot.state
      )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] via-[#FFF3D6] to-[#FFFBEA]">

      {/* ============= HERO ============= */}
      <div className="relative h-[55vh] sm:h-[65vh] lg:h-[75vh] w-full overflow-hidden">
        
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 bg-white/70 p-2 sm:p-3 rounded-full hover:bg-white transition shadow-md"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800" />
        </motion.button>



        <img
          src={spot.images?.[0] || "/placeholder-image.jpg"}
          alt={spot.spotName}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-amber-600/30 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 md:p-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase mb-3">
              {spot.category}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-3 leading-tight">
              {spot.spotName}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-amber-100">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-yellow-300" />
                {spot.city}, {spot.state}
              </div>

              <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-lg">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span>{spot.rating > 0 ? spot.rating.toFixed(1) : "New"}</span>
                <span className="text-xs opacity-75">
                  ({spot.totalRatings} reviews)
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============= CONTENT ============= */}
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">

          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 space-y-8 sm:space-y-12"
          >

            {/* ABOUT */}
            <section className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-lg border border-amber-100">
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-amber-900 mb-4 sm:mb-6 relative inline-block">
                About the Place
                <div className="absolute -bottom-1 left-0 w-16 h-[2px] bg-amber-400 rounded-full" />
              </h2>

              <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                {spot.description || "No description available for this spot yet."}
              </p>

              {(spot.videoLink || spot.instagramLink) && (
                <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-amber-100">

                  {spot.videoLink && (
                    <a
                      href={spot.videoLink}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Youtube className="w-4 h-4" /> Watch Video
                    </a>
                  )}

                  {spot.instagramLink && (
                    <a
                      href={spot.instagramLink}
                      className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="w-4 h-4" /> Instagram
                    </a>
                  )}
                </div>
              )}
            </section>

            {/* MAP */}
            <section className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-[2.5rem] shadow-lg border border-amber-100 h-[300px] sm:h-[420px]">
              <DynamicMap
                state={spot.state}
                city={spot.city}
                address={spot.address}
                defaultLat={dbLat}
                defaultLng={dbLng}
              />
            </section>

            {/* CONTRIBUTIONS */}
            {spot.contributions?.length > 0 && (
  <section className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-lg border border-amber-100">
    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-amber-900 mb-6 relative inline-block">
      Visitor Contributions
      <div className="absolute -bottom-1 left-0 w-24 h-[2px] bg-amber-400 rounded-full" />
    </h2>

    <div className="space-y-6 sm:space-y-8">
      {spot.contributions.map((c) => (
        <div
          key={c._id}
          className="border border-amber-100 rounded-xl p-4 sm:p-6 shadow-sm bg-amber-50/50"
        >
          {/* USER HEADER */}
          <div className="flex items-center gap-3 mb-3">

            {/* ==== AVATAR FIXED HERE ==== */}
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border border-amber-200 shadow-sm">
              <AvatarImage src={c.userId?.image} alt={c.userId?.username} />

              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-semibold">
                {c.userId?.username
                  ? c.userId.username.charAt(0).toUpperCase()
                  : "A"}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold text-amber-900 text-sm sm:text-base">
                {c.userId?.username || "Anonymous user"}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <p className="text-gray-700 whitespace-pre-line text-sm sm:text-base mb-3">
            {c.content}
          </p>

          {/* IMAGES */}
          {c.images?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {c.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className="rounded-xl shadow-md h-32 sm:h-40 w-full object-cover"
                />
              ))}
            </div>
          )}

          {/* VIDEO LINK */}
          {c.videoLink && (
            <a
              href={c.videoLink}
              className="inline-flex items-center gap-1 text-red-600 mt-3 text-sm hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              🎬 Watch Video
            </a>
          )}

          {/* INSTAGRAM LINK */}
          {c.instagramLink && (
            <a
              href={c.instagramLink}
              className="block mt-2 text-pink-600 text-sm hover:underline"
              target="_blank"
            >
              📸 View on Instagram
            </a>
          )}
        </div>
      ))}
    </div>
  </section>
)}

          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-24 space-y-6 sm:space-y-8 h-fit"
          >
            {/* ESSENTIALS */}
            <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-lg border border-amber-200">
              <h3 className="text-2xl font-serif font-semibold text-amber-900 mb-4 sm:mb-6">
                Visitor Essentials
              </h3>

              <div className="space-y-4 sm:space-y-6">
                <InfoItem icon={<Calendar />} title="Best Time" value={spot.bestTime} />
                <InfoItem icon={<Clock />} title="Timings" value={spot.openingHours} />
                <InfoItem icon={<Ticket />} title="Entry Fee" value={spot.entryFee} />
              </div>
            </div>

            {/* LOCATION */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] text-white shadow-lg">
              <h3 className="text-xl sm:text-2xl font-serif font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" /> Location
              </h3>

              <p className="opacity-90 mb-5 leading-relaxed text-sm sm:text-base">
                {spot.address}
                <br />
                {spot.city}, {spot.state}
              </p>

              <a
                href={googleMapsUrl}
                className="flex items-center justify-center gap-2 w-full bg-white text-amber-800 font-semibold py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-amber-50 transition"
                target="_blank"
              >
                Get Directions <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ========== INFO ITEM ========== */
function InfoItem({ icon, title, value }) {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="bg-amber-50 p-2 sm:p-3 rounded-xl text-amber-700">
        {icon}
      </div>

      <div>
        <h4 className="font-semibold text-amber-900 text-sm sm:text-base">{title}</h4>
        <p className="text-gray-700 font-medium whitespace-pre-line text-sm sm:text-base">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}
