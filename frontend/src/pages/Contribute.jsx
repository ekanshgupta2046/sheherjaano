import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

export default function Contribute() {
  const navigate = useNavigate();

  const badges = [
    {
      name: "Famous Spots",
      icon: <Landmark className="w-8 h-8 text-amber-700" />,
      desc: "Add the most iconic and must-visit places in your city.",
      link: "/contribute/famous-spots",
    },
    {
      name: "Hidden Spots",
      icon: <MapPin className="w-8 h-8 text-amber-700" />,
      desc: "Share the lesser-known gems that tourists often miss.",
      link: "/contribute/hidden-spots",
    },
    {
      name: "Food",
      icon: <UtensilsCrossed className="w-8 h-8 text-amber-700" />,
      desc: "Contribute local dishes, food stalls, and culinary delights.",
      link: "/contribute/famous-foods",
    },
    {
      name: "History",
      icon: <History className="w-8 h-8 text-amber-700" />,
      desc: "Add stories, monuments, and legacies that shaped your city.",
      link: "/contribute/history",
    },
    {
      name: "Handicrafts",
      icon: <Palette className="w-8 h-8 text-amber-700" />,
      desc: "Share unique crafts, artisans, and handmade treasures.",
      link: "/contribute/handicrafts",
    },
    {
      name: "Your Info",
      icon: <User className="w-8 h-8 text-amber-700" />,
      desc: "Give your info so tourists who love your city can reach you.",
      link: "/contribute/your-info",
    },
  ];

  return (
    <section className="relative min-h-screen pt-12 pb-20 bg-gradient-to-b from-yellow-50 via-amber-100 to-orange-50 overflow-hidden">
      {/* Ethnic Pattern */}
      <div className="absolute inset-0 bg-[url('/ethnic-pattern.png')] opacity-[0.04] bg-repeat"></div>

      {/* Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-amber-200/30 to-transparent blur-3xl"></div>

      <div className="relative container mx-auto px-6 overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
            Contribute to SheherJaano
          </h2>
          <p className="text-lg text-orange-700 font-medium max-w-2xl mx-auto">
            Help travelers explore your city better — share your local treasures, stories, and experiences.
          </p>
          <div className="mt-6 w-28 h-1 mx-auto bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow"></div>
        </motion.div>

        {/* Horizontal Bar Layout */}
        <div className="flex flex-col gap-6 max-w-3xl mx-auto overflow-hidden">
          {badges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              onClick={() => navigate(badge.link)}
            >
              <Card className="group flex justify-between lg:flex-row items-center gap-6 cursor-pointer p-6 sm:p-8 rounded-2xl border border-amber-200 bg-white/70 backdrop-blur-md shadow-md hover:shadow-[0_10px_40px_rgba(255,180,0,0.3)] transition-all duration-500">
                {/* Left side: Icon + Text */}
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-full bg-gradient-to-r from-yellow-200 via-amber-100 to-white shadow-inner group-hover:shadow-amber-300/40 transition">
                    {badge.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-amber-900">{badge.name}</h3>
                    <p className="text-sm text-orange-700/80">{badge.desc}</p>
                  </div>
                </div>

                {/* Right side: Arrow */}
                <motion.div
                  whileHover={{ x: 4 }}
                  className="text-amber-700 font-semibold flex items-center gap-1 text-sm group-hover:text-orange-700 transition"
                >
                  Start <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Card>
              </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
