import { motion } from "framer-motion";
import { Star, Camera, Utensils, Heart, Clock, Users } from "lucide-react";

export default function AboutSection() {
  const aboutCards = [
    {
      title: "Famous Spots",
      description:
        "Explore iconic landmarks and must-visit attractions that define each city's character. From architectural marvels and ancient temples to cultural hotspots, discover the places that make each destination truly special.",
      image: "famous.jpg",
      icon: <Star className="h-7 w-7 text-amber-700" />,
      reverse: false,
    },
    {
      title: "Hidden Spots",
      description:
        "Discover offbeat gems that only locals know. From secret viewpoints to quiet temples tucked away in old alleys, find the magic beyond the map.",
      image: "hidden spots.jpg",
      icon: <Camera className="h-7 w-7 text-amber-700" />,
      reverse: true,
    },
    {
      title: "Local Food Scene",
      description:
        "Taste the city’s soul through its flavors — from spicy street food to royal thalis. Every bite tells a story, curated by those who cook with love.",
      image: "thali.webp",
      icon: <Utensils className="h-7 w-7 text-amber-700" />,
      reverse: false,
    },
    {
      title: "Handicrafts",
      description:
        "Step into artisan lanes where traditions live through hands — pottery, textiles, and carvings that whisper centuries of creativity.",
      image: "handicraft.jpg",
      icon: <Heart className="h-7 w-7 text-amber-700" />,
      reverse: true,
    },
    {
      title: "Rich History",
      description:
        "Uncover timeless tales carved into stones and palaces. History breathes here — in every monument, every melody, every street.",
      image: "/ancient-indian-historical-monuments-and-heritage-a.png",
      icon: <Clock className="h-7 w-7 text-amber-700" />,
      reverse: false,
    },
    {
      title: "Connect with Locals",
      description:
        "Meet the heartbeat of the city — its people. Listen to their stories, laughter, and wisdom. Because no guidebook tells you what a smile can.",
      image: "locals.jpg",
      icon: <Users className="h-7 w-7 text-amber-700" />,
      reverse: true,
    },
  ];

  return (
    <section
      id="about-section"
      className="relative py-24 bg-gradient-to-b from-amber-100 via-yellow-100 to-orange-50 overflow-hidden"
    >
      {/* Ethnic pattern overlay */}
      <div className="absolute inset-0 bg-[url('/ethnic-pattern.png')] opacity-[0.05] bg-repeat"></div>

      {/* Section Header */}
      <div className="relative text-center mb-20 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="playfair-display text-5xl font-bold font-serif text-orange-600 drop-shadow-sm"
        >
          What Makes Us Different
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 text-lg text-red-700 max-w-2xl mx-auto font-medium"
        >
          We connect you with authentic local experiences and hidden stories that guidebooks miss
        </motion.p>
        <div className="mt-6 w-28 h-1 mx-auto bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 rounded-full shadow-sm"></div>
      </div>

      {/* Cards */}
      <div className="relative max-w-7xl mx-auto space-y-10 sm:space-y-16 px-6 md:px-10">
        {aboutCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.015 }}
            className={`flex flex-col lg:flex-row items-stretch rounded-3xl overflow-hidden shadow-[0_8px_28px_rgba(255,180,0,0.25)] bg-gradient-to-br from-yellow-50 to-amber-100 backdrop-blur-sm border border-amber-200 hover:shadow-[0_10px_35px_rgba(255,190,0,0.35)] transition-all duration-300 ${
              card.reverse ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Image Section */}
            <div className="relative lg:w-[45%] w-full group overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-[220px] sm:h-[260px] md:h-[380px] lg:h-[420px]object-cover rounded-none transition-transform duration-500 group-hover:scale-105"
              />
              {/* Golden glow border */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-600/20 to-transparent group-hover:from-amber-600/30"></div>
              <div className="absolute inset-0 rounded-none ring-1 ring-amber-300/40 group-hover:ring-amber-400/60 transition-all duration-500"></div>
            </div>

            {/* Text Section */}
            <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center lg:w-[55%]">

              <div className="h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-50 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 shadow-md border border-amber-300">
                {card.icon}
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-700 mb-4 font-serif tracking-tight">
                {card.title}
              </h3>
              <p className="text-base sm:text-lg text-red-800 leading-relaxed tracking-wide font-medium">
                {card.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Golden glow accent */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-gradient-radial from-yellow-200/40 to-transparent rounded-full blur-3xl"></div>
    </section>
  );
}
