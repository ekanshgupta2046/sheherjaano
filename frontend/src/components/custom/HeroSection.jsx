import { Badge } from "@/components/ui/badge";
import React from "react";
import { ArrowRight } from "lucide-react";

const Hero = ({onScrollToFeatured}) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-[url('/heroImage.png')] bg-cover bg-center opacity-20"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/70 via-orange-500 via-amber-100 to-yellow-400 mix-blend-multiply"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center mt-10 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 text-white min-h-screen">
        <Badge className="
          bg-gradient-to-r from-yellow-200/80 via-yellow-100/80 to-white/90 text-orange-800 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 text-xs sm:text-sm md:text-xl lg:text-2xl rounded-full font-bold shadow-lg">
          Discover cities like never before
        </Badge>

        <h1 className="montserrat text-4xl sm:text-5xl md:text-6xl lg:text-[7rem] mb-4 mt-6 drop-shadow-lg text-center break-words">
          Dive into Every City
        </h1>

        <div className="flex items-center mb-5 w-full">
          {/* Left fading line */}
          <div className="flex-1 h-0.5 md:mt-5 bg-gradient-to-r from-white/0 to-white/70"></div>

          {/* Text */}
          <p className="outfit sm:text-xl md:text-2xl lg:text-3xl md:mt-4 drop-shadow-md px-2 sm:px-4 text-white text-center">
            Hear from the ones who live it
          </p>

          {/* Right fading line */}
          <div className="flex-1 h-0.5 md:mt-5 bg-gradient-to-l from-white/0 to-white/70"></div>
        </div>

        <p className="text-base sm:text-lg md:text-lg text-center mt-12 text-white/95 max-w-3xl mx-auto leading-relaxed outfit drop-shadow-md bg-black/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
          Discover hidden gems, famous spots, local food, rich culture, and fascinating history. Connect with locals who know their city best and share your own discoveries.
        </p>

        <button
          onClick={onScrollToFeatured}
          className="mt-10 px-8 py-3 rounded-full font-bold text-orange-800 
          bg-gradient-to-r from-yellow-200 via-yellow-100 to-white 
          shadow-md hover:shadow-lg active:scale-95 transition-transform duration-200 
          flex items-center gap-2"
        >
          Explore Cities
          <ArrowRight className="h-5 w-5 text-orange-800" />
        </button>
      </div>
    </div>
  )
}

export default Hero;
