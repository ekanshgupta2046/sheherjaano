import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Landmark,
  UtensilsCrossed,
  History,
  Palette,
  User,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function CityLanding() {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const displayName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

  // Background images from public/images
  const images = Array.from({ length: 5 }, (_, i) => `/images/${cityName}/${i + 1}.jpg`);
  const [currentImage, setCurrentImage] = useState(0);

  // Rotate every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  const badges = [
    {
      name: "Famous Spots",
      icon: <Landmark className="w-8 h-8 text-amber-700" />,
      desc: "Explore the iconic landmarks and must-visit attractions.",
      link: `/city/${cityName}/famous-spots`,
    },
    {
      name: "Hidden Spots",
      icon: <MapPin className="w-8 h-8 text-amber-700" />,
      desc: "Discover secret gems known only to locals.",
      link: `/city/${cityName}/hidden-spots`,
    },
    {
      name: "Food",
      icon: <UtensilsCrossed className="w-8 h-8 text-amber-700" />,
      desc: "Taste the authentic local dishes and street food.",
      link: `/city/${cityName}/famous-foods`,
    },
    {
      name: "History",
      icon: <History className="w-8 h-8 text-amber-700" />,
      desc: "Dive into stories and monuments that define the city.",
      link: `/city/${cityName}/history`,
    },
    {
      name: "Handicrafts",
      icon: <Palette className="w-8 h-8 text-amber-700" />,
      desc: "Admire traditional craftsmanship and unique art forms.",
      link: `/city/${cityName}/handicrafts`,
    },
    {
      name: "Local Guides",
      icon: <User className="w-8 h-8 text-amber-700" />,
      desc: "Meet friendly locals who can guide your journey.",
      link: `/city/${cityName}/locals`,
    },
  ];

  const scrollToCards = () => {
    const el = document.getElementById("city-cards");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden">
      {/* Hero Section with Background Slideshow */}
      <div className="relative h-screen flex flex-col justify-center items-center text-center text-white">
        <AnimatePresence>
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${images[currentImage]})`,
              filter: "brightness(0.6)",
            }}
          />
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-transparent"></div>

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <h1 className="text-6xl sm:text-7xl font-extrabold mb-6 bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-lg font-serif">
            Discover {displayName}
          </h1>
          <p className="text-lg sm:text-xl text-yellow-100 mb-8 max-w-xl mx-auto font-medium">
            Explore its beauty, culture, and stories shared by locals.
          </p>
          <motion.button
            onClick={scrollToCards}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Start Exploring
          </motion.button>
        </motion.div>
      </div>

      {/* Cards Section */}
      {/* Enhanced Cards Section */}
<div
  id="city-cards"
  className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-amber-50 via-yellow-50 to-white"
>
  {/* Ambient golden aura */}
  <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-radial from-amber-200/30 to-transparent blur-3xl"></div>
  <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-orange-200/20 to-transparent blur-2xl"></div>

  <div className="relative container mx-auto max-w-6xl">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h3 className="text-4xl font-bold mb-3 font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-500 bg-clip-text text-transparent">
        What do you want to explore?
      </h3>
      <p className="text-lg text-orange-800/80 font-medium">
        Dive into the city's essence — places, food, art, and people.
      </p>
      <div className="mt-6 w-28 h-1 mx-auto bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow"></div>
    </motion.div>

    {/* Cards Grid */}
    {/* Cards Grid */}
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
  {badges.map((badge, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -6 }}
      transition={{ duration: 0.5, delay: i * 0.05 }}
      viewport={{ once: true }}
      onClick={() => navigate(badge.link)}
    >
      <Card
        className="group relative cursor-pointer p-6 sm:p-7 rounded-2xl border border-amber-100
                   bg-gradient-to-br from-white/90 via-amber-50/70 to-yellow-50/80
                   backdrop-blur-xl shadow-md hover:shadow-[0_8px_25px_rgba(255,180,0,0.25)]
                   transition-all duration-500 flex flex-col h-full"
      >
        {/* Decorative top line */}
        <div className="absolute top-0 left-0 w-0 h-[3px] bg-gradient-to-r from-amber-400 to-orange-400 group-hover:w-full transition-all duration-500 rounded-full"></div>

        {/* Card Content */}
        <div className="flex flex-col items-center flex-grow">
          <div className="flex items-start gap-5 mb-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-100 via-amber-50 to-white shadow-inner group-hover:shadow-[inset_0_0_12px_rgba(255,200,0,0.25)] transition-all duration-300">
              {badge.icon}
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-amber-900 group-hover:text-orange-800 transition-colors duration-300">
                {badge.name}
              </h4>
              <p className="text-sm text-orange-700/70 mt-1 leading-snug">
                {badge.desc}
              </p>
            </div>
          </div>

          {/* Spacer pushes button to bottom only when needed */}
          <div className="flex-grow"></div>

          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-1 text-amber-700 text-sm font-medium opacity-80 group-hover:opacity-100 transition-all duration-300"
          >
            Explore <ArrowRight className="h-4 w-4" />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  ))}
</div>

  </div>
</div>
  
    </section>
    
  );
}
