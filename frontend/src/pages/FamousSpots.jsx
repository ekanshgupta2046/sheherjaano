"use client";
import FamousSpotCard from "@/components/custom/FamousSpotCard";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useParams,useNavigate } from "react-router-dom";

export default function FamousSpots() {

  const { cityName,stateName } = useParams();
  const navigate = useNavigate();
  console.log("FamousSpots mounted",cityName,stateName);

  const [famousSpots, setFamousSpots] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!cityName || !stateName) return;

  setLoading(true);

  const fetchSpots = async () => {
    try {
      const res = await api.get("/famous-spots", {
        params: { 
          city: cityName,
          state: stateName
         },
      });
      setFamousSpots(res.data.data || []);
    } catch (error) {
      console.error("Error fetching famous spots", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSpots();
}, [cityName,stateName]);


  if (loading) {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <p className="text-orange-700 text-lg font-semibold">
        Loading famous spots in {cityName}...
      </p>
    </section>
    
  );
}

const city = cityName.charAt(0).toUpperCase() + cityName.slice(1);
const state = stateName.charAt(0).toUpperCase() + stateName.slice(1);


if (!loading && famousSpots.length === 0) {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <p className="text-orange-700 text-lg font-semibold">
        No famous spots found for this city.
      </p>
    </section>
  );
}

  return (
    <section className="relative min-h-screen py-12 bg-gradient-to-b from-orange-50 via-amber-100 to-yellow-50 overflow-hidden">
      {/*Golden Glow */}

      {/*  Content Container */}
      <div className="relative container mx-auto px-6 z-10 ">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-orange-500 via-amber-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
            Famous Spots of {city}
          </h2>
          <p className="text-lg text-orange-800 font-medium">
            Discover the soul of the city through its iconic landmarks
          </p>
          <div className="mt-6 w-28 h-1 mx-auto bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow"></div>
        </div>

        {/* Cards Grid */}        
          <div
            className="
              grid
              gap-8
              justify-items-center
              [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]
            "
          >

          {famousSpots.map((spot) => (
            <div key={spot._id} className="w-full max-w-sm" onClick={() => navigate(`/famous-spot/${spot._id}`)}>
              <FamousSpotCard spot={spot} /> 
            </div>
          ))}
        </div>

        {/* Subtle Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-radial from-amber-200/30 to-transparent blur-3xl pointer-events-none"></div>
      </div>
    </section>
  );
}
