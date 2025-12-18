import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FeaturedCities() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const cities = [
    { name: "Mumbai", spots: "1,247", image: "mumbai.jpg" },
    { name: "Delhi", spots: "892", image: "delhi.jpg" },
    { name: "Bangalore", spots: "634", image: "bangalore.jpg" },
    { name: "Kolkata", spots: "578", image: "kolkata.jpg" },
  ];

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleExplore = () => {
    if (query.trim()) {
      navigate(`/city/${query.trim().toLowerCase()}`);
    }
  };

  return (
    <section
      id="featured-cities"
      className="relative py-24 bg-gradient-to-b from-orange-50 via-amber-100 to-yellow-50 overflow-hidden"
    >
      {/* Ethnic subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/ethnic-pattern.png')] opacity-[0.04] bg-repeat"></div>

      {/* Golden glow effect */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-amber-200/30 to-transparent blur-3xl"></div>

      <div className="relative container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
            Explore Every City
          </h2>
          <p className="text-lg text-orange-700 font-medium">
            Start your journey with these vibrant destinations
          </p>
          <div className="mt-6 w-28 h-1 mx-auto bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow"></div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <div className="flex items-center bg-white/80 border border-amber-300 rounded-full shadow-md px-4 py-2 w-full sm:w-96 backdrop-blur-md">
            <Search className="text-amber-700 w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Search for a city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-amber-900 placeholder-amber-700/60"
            />
          </div>

          <button
            onClick={handleExplore}
            className="flex items-center gap-2 px-6 py-2 rounded-full font-bold text-orange-800
            bg-gradient-to-r from-yellow-200 via-yellow-100 to-white
            shadow-md hover:shadow-lg active:scale-95 transition-transform duration-200"
          >
            Explore
            <ArrowRight className="h-5 w-5 text-orange-800" />
          </button>
        </motion.div>

        {/* City Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredCities.map((city, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Card
                onClick={() => navigate(`/city/${city.name.toLowerCase()}`)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-lg hover:shadow-[0_10px_40px_rgba(255,170,0,0.4)] transition-all duration-500 border border-amber-200"
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-orange-800/50 to-transparent rounded-3xl"></div>
                </div>

                {/* Overlay Content */}
                <div className="relative z-10 h-72 flex flex-col justify-end p-6">
                  <h3 className="text-3xl font-bold font-serif text-yellow-300 drop-shadow-md">
                    {city.name}
                  </h3>
                  <p className="text-sm text-orange-100 opacity-90">
                    {city.spots} spots to explore
                  </p>
                </div>

                {/* Golden shimmer on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition duration-500 bg-gradient-to-r from-yellow-400/20 to-orange-300/20 rounded-3xl"></div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
