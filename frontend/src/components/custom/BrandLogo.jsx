import { MapPin } from "lucide-react";

export default function BrandLogo({ size = "md" }) {
  const sizes = {
    sm: {
      icon: "h-8 w-8",
      pin: "h-4 w-4",
      title: "text-xl",
      dot: "h-3 w-3",
    },
    md: {
      icon: "h-10 w-10",
      pin: "h-6 w-6",
      title: "text-2xl",
      dot: "h-4 w-4",
    },
    lg: {
      icon: "h-14 w-14",
      pin: "h-8 w-8",
      title: "text-4xl",
      dot: "h-5 w-5",
    },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center space-x-3 select-none">
      <div className="relative">
        <div
          className={`${s.icon} bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-lg`}
        >
          <MapPin className={`${s.pin} text-white`} />
        </div>

        <div
          className={`absolute -top-1 -right-1 ${s.dot} bg-yellow-400 rounded-full border-2 border-white`}
        />
      </div>

      <div>
        <span
          className={`${s.title} font-bold text-red-800 font-serif tracking-wide`}
        >
          SheherJaano
        </span>
        <p className="text-xs text-red-600 font-medium -mt-1">
          City Discovery Platform
        </p>
      </div>
    </div>
  );
}
