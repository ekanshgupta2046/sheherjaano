import { MapPin, Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";


export default function Footer() {
const sections = [
  {
    title: "Explore",
    links: [
      { label: "Popular Cities", to: "/" },
      { label: "Hidden Gems", to: "/" },
      { label: "Food & Culture", to: "/" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Contribute", to: "/contribute" },
      { label: "Local Stories", to: "/" },
      { label: "Connect", to: "/" },
    ],
  },
];


  const socialIcons = [
    { icon: <Instagram className="h-5 w-5" />, href: "#" },
    { icon: <Twitter className="h-5 w-5" />, href: "#" },
    { icon: <Facebook className="h-5 w-5" />, href: "#" },
  ];

  return (
    <footer className="border-t border-amber-300 bg-gradient-to-br from-yellow-100 to-amber-50 py-10 relative">
      <div className="container mx-auto px-6 text-center">
        {/* Top Section */}
        <div className="grid md:grid-cols-3 gap-10 mb-10 justify-items-center">
          {/* Logo and Tagline */}
          <div>
            <div className="flex flex-col items-center space-y-2 mb-3">
              <div className="h-9 w-9 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-red-700 font-serif">
                SheherJaano
              </span>
            </div>
            <p className="text-red-600 leading-relaxed max-w-xs mx-auto">
              Discover India’s hidden stories, local flavors, and the real
              essence of every city.
            </p>
          </div>

          {/* Link Sections */}
          {sections.map((section, i) => (
            <div key={i}>
              <h4 className="font-semibold text-red-700 mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2 text-red-600">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      to={link.to}
                      className="hover:text-red-800 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-amber-300 pt-6 flex flex-col sm:flex-row justify-center sm:justify-between items-center text-red-600 text-sm">
          <p className="text-center sm:text-left mb-3 sm:mb-0">
            © 2025 <span className="font-semibold">SheherJaano</span>. Made with ❤️ for travellers.
          </p>

          <div className="flex space-x-4 justify-center">
            {socialIcons.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
