import { Heart, Users, Star, Leaf, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ContributeSection() {
  const reasons = [
    {
      icon: Heart,
      title: "Share Your Passion",
      desc: "Show the world what makes your city truly special.",
    },
    {
      icon: Users,
      title: "Build Community",
      desc: "Connect with like-minded locals and curious travelers.",
    },
    {
      icon: Star,
      title: "Earn Recognition",
      desc: "Become a trusted voice and local guide in your area.",
    },
    {
      icon: Leaf,
      title: "Help Your City Locals Flourish",
      desc: "Promote small businesses and cultural gems that deserve recognition.",
    },
  ];

  return (
    <section
      id="contribute"
      className="relative py-24 bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300 overflow-hidden"
    >
      {/* Ethnic background pattern */}
      <div className="absolute inset-0 bg-[url('/ethnic-pattern.png')] opacity-[0.05] bg-repeat"></div>

      {/* Subtle golden glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-amber-300/40 to-transparent blur-3xl"></div>

      {/* Content */}
      <div className="relative container mx-auto px-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-orange-600 via-red-600 to-amber-700 bg-clip-text text-transparent drop-shadow-sm">
            Share Your City’s Story
          </h2>
          <p className="text-lg text-red-700 font-medium">
            Help fellow travelers discover the authentic soul of your hometown
          </p>
          <div className="mt-6 w-28 h-1 mx-auto bg-gradient-to-r from-orange-400 to-yellow-300 rounded-full shadow"></div>
        </div>

        {/* Main Flex: Text + Button */}
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 text-left">
          {/* Reasons */}
          <div className="space-y-6 flex-1">
            <h3 className="text-2xl font-bold mb-4 font-serif text-red-800 text-center lg:text-left">
              Why Contribute?
            </h3>

            {reasons.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mt-1 shadow-md flex-shrink-0">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-500">{item.title}</h4>
                    <p className="text-red-700">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Button beside content */}
          <div className="flex justify-center lg:justify-start">
            <Button
              asChild
              className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-lg font-semibold shadow-lg px-10 py-6 rounded-full transition-transform duration-300 hover:scale-105"
            >
              <Link to="/contribute">
                Contribute Now <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
