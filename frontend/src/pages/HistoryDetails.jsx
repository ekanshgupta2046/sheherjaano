"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/api/axios";

import {
  MapPin,
  Star,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Youtube,
  Instagram,
  Share2,
  Heart,
  Landmark,
  Clock4,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DynamicMap from "../components/custom/DynamicMap";

export default function HistoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
   const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/history/${id}`);
        setHistory(res.data.data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    window.scrollTo(0, 0);
  }, [id]);

    useEffect(() => {
    const images = history?.images;

    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [history?.images?.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7ED]">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-amber-300 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!history) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl sm:text-2xl font-serif text-amber-900">
        History record not found.
      </div>
    );
  }

  const hasCoords = history.geometry?.coordinates?.length === 2;
  const dbLat = hasCoords ? history.geometry.coordinates[1] : null;
  const dbLng = hasCoords ? history.geometry.coordinates[0] : null;

  const googleMapsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${dbLat},${dbLng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        `${history.placeName} ${history.city} ${history.state}`
      )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] via-[#FFF3D6] to-[#FFFBEA]">

      {/* ================= HERO ================= */}
      <div className="relative h-[55vh] sm:h-[65vh] lg:h-[75vh] overflow-hidden">

                <div className="absolute inset-0">
  {history.images.map((img, index) => (
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
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 bg-white/70 p-2 sm:p-3 rounded-full shadow-md hover:bg-white"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800" />
        </motion.button>

        <img
          src={history.images?.[0] || "/placeholder-image.jpg"}
          alt={history.placeName}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-amber-600/30 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 md:p-16 text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-3">
            {history.placeName}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm sm:text-base text-amber-100">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-yellow-300" />
              {history.city}, {history.state}
            </div>

            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-lg">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              {history.rating > 0 ? history.rating.toFixed(1) : "New"}
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8 sm:space-y-12">

            {/* ABOUT */}
            <section className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-amber-100">
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-amber-900 mb-4">
                About This Place
              </h2>

              <p className="text-gray-700 text-sm sm:text-lg whitespace-pre-line mb-4">
                {history.shortDescription}
              </p>

              <p className="text-gray-700 text-sm sm:text-lg whitespace-pre-line">
                {history.historyDescription}
              </p>

              {(history.videoLink || history.instagramLink) && (
                <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-amber-100">
                  {history.videoLink && (
                    <a
                      href={history.videoLink}
                      target="_blank"
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm"
                    >
                      <Youtube className="w-4 h-4" /> Watch Video
                    </a>
                  )}

                  {history.instagramLink && (
                    <a
                      href={history.instagramLink}
                      target="_blank"
                      className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-lg text-sm"
                    >
                      <Instagram className="w-4 h-4" /> Instagram
                    </a>
                  )}
                </div>
              )}
            </section>

            {/* MAP */}
            <section className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg border border-amber-100 h-[280px] sm:h-[420px]">
              <DynamicMap
                state={history.state}
                city={history.city}
                address={history.address}
                defaultLat={dbLat}
                defaultLng={dbLng}
              />
            </section>

            {/* CONTRIBUTIONS */}
            {history.contributions?.length > 0 && (
              <section className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-amber-100">
                <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-amber-900 mb-6">
                  Visitor Contributions
                </h2>

                <div className="space-y-6">
                  {history.contributions.map((c) => (
                    <div
                      key={c._id}
                      className="border border-amber-100 rounded-xl p-4 sm:p-6 bg-amber-50/50"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                          <AvatarImage src={c.userId?.image} />
                          <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                            {c.userId?.username?.[0] || "A"}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-semibold text-amber-900 text-sm sm:text-base">
                            {c.userId?.username || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm sm:text-base whitespace-pre-line">
                        {c.content}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-24 space-y-6 h-fit">
            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-amber-200">
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-amber-900 mb-4">
                Historical Facts
              </h3>

              <InfoItem icon={<Landmark />} title="Built By" value={history.builtBy} />
              <InfoItem icon={<Calendar />} title="Year Built" value={history.yearBuilt} />
              <InfoItem icon={<Clock4 />} title="Era" value={history.era} />
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 sm:p-8 rounded-2xl text-white shadow-lg">
              <a
                href={googleMapsUrl}
                target="_blank"
                className="flex items-center justify-center gap-2 bg-white text-amber-800 py-3 rounded-xl font-semibold"
              >
                Get Directions <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, title, value }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="bg-amber-50 p-2 rounded-lg text-amber-700">{icon}</div>
      <div>
        <p className="font-semibold text-amber-900 text-sm">{title}</p>
        <p className="text-gray-700 text-sm">{value || "—"}</p>
      </div>
    </div>
  );
}
