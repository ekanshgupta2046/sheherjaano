import { useEffect, useState } from "react";
import axios from "axios";
import { Droplets, Wind, Loader2, MapPin, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function WeatherWidget({ city, showAqi = true, isEmptyCity = false }) {
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!city) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);


        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
        const weatherRes = await axios.get(weatherUrl);
        const weatherData = weatherRes.data;

        setWeather(weatherData);

        if (showAqi) {
          const { lat, lon } = weatherData.coord;
          const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
          
          const aqiRes = await axios.get(aqiUrl);
          
          console.log("AQI Data Received:", aqiRes.data);

          if (aqiRes.data.list && aqiRes.data.list.length > 0) {
            setAqi(aqiRes.data.list[0]);
          } else {
            console.warn("AQI data was empty");
          }
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city, showAqi]); 

  const getAqiLabel = (index) => {
    const labels = {
      1: { text: "Good", color: "text-green-300" },
      2: { text: "Fair", color: "text-lime-300" },
      3: { text: "Mod", color: "text-yellow-300" },
      4: { text: "Poor", color: "text-orange-400" },
      5: { text: "Bad", color: "text-red-500" },
    };
    return labels[index] || { text: "N/A", color: "text-gray-300" };
  };

  if (error) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 shadow-lg">
        <Loader2 className="w-5 h-5 text-white animate-spin" />
        <span className="text-white font-medium tracking-wide">Scanning skies...</span>
      </div>
    );
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  
  // Calculate AQI info
  const aqiInfo = aqi ? getAqiLabel(aqi.main.aqi) : { text: "--", color: "text-white" };

  const bgTheme = isEmptyCity
    ? "bg-gradient-to-br from-amber-500 to-orange-600 border-orange-700/40"
    : "bg-gradient-to-br from-white/40 via-white/10 to-transparent border-white/40";


  const accentTheme = isEmptyCity
    ? "from-pink-400 via-orange-300 to-yellow-400"
    : "from-amber-400 via-yellow-300 to-orange-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden ${
        showAqi ? "w-80" : "w-72"
      } rounded-[2rem] border backdrop-blur-xl bg-gradient-to-br ${bgTheme} text-white shadow-[0_8px_32px_rgba(0,0,0,0.2)]`}
    >
      {/* Accent strip */}
      <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${accentTheme}`} />
      

      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-start p-5 pb-0 relative z-10">
        <div>
          <h3 className="flex items-center gap-1 font-bold text-lg drop-shadow-md">
            <MapPin className="w-4 h-4 text-yellow-300" />
            {weather.name}
          </h3>
          <p className="text-sm font-medium text-white/90 capitalize pl-5">
            {weather.weather[0].description}
          </p>
        </div>
        <div className="bg-white/20 rounded-full p-1 shadow-inner backdrop-blur-sm">
          <img src={iconUrl} alt="Weather" className="w-14 h-14 drop-shadow-lg" />
        </div>
      </div>

      {/* Temp Body */}
      <div className="px-5 py-2 relative z-10">
        <div className="flex items-end gap-2">
          <span className="text-6xl font-bold tracking-tighter drop-shadow-lg">
            {Math.round(weather.main.temp)}°
          </span>
          <div className="mb-2 text-sm font-medium opacity-90 flex flex-col">
            <span>Feels like</span>
            <span className="font-bold">{Math.round(weather.main.feels_like)}°</span>
          </div>
        </div>
      </div>

      {/* Footer Grid */}
      <div className={`grid ${showAqi ? "grid-cols-3" : "grid-cols-2"} gap-px bg-white/10 mt-2 border-t border-white/20`}>
        
        {/* Humidity */}
        <div className="p-3 flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-colors">
          <Droplets className="w-4 h-4 text-blue-200" />
          <span className="text-xs font-semibold">{weather.main.humidity}%</span>
        </div>
        
        {/* Wind */}
        <div className="p-3 flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-colors border-l border-white/20">
          <Wind className="w-4 h-4 text-gray-200" />
          <span className="text-xs font-semibold">{weather.wind.speed} m/s</span>
        </div>

        {showAqi && aqi && (
          <div className="p-3 flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-colors border-l border-white/20">
            <Leaf className={`w-4 h-4 ${aqiInfo.color}`} />
            <span className="text-sm font-bold">{aqi.main.aqi}</span>
            <span className={`text-[10px] font-semibold uppercase ${aqiInfo.color}`}>
              {aqiInfo.text}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
