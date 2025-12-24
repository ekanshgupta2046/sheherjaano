"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import ProfileMenu from "./ProfileMenu";

export default function Navbar({
  onScrollToTop,
  onScrollToAbout,
  onScrollToContribute,
}) {
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Prevent flicker while refresh/auth check is running
  if (auth.loading) return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-amber-200 bg-amber-100/80 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* LEFT: Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-10 w-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <span className="text-2xl font-bold text-red-800 font-serif tracking-wide">
                SheherJaano
              </span>
              <p className="text-xs text-red-600 font-medium -mt-1">
                City Discovery Platform
              </p>
            </div>
          </div>

          {/* CENTER LINKS (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={onScrollToTop}
              className="text-red-700 hover:text-red-800 font-medium transition-colors hover:bg-red-50 px-3 py-2 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={onScrollToContribute}
              className="text-red-700 hover:text-red-800 font-medium transition-colors hover:bg-red-50 px-3 py-2 rounded-lg"
            >
              Contribute
            </button>
            <button
              onClick={onScrollToAbout}
              className="text-red-700 hover:text-red-800 font-medium transition-colors hover:bg-red-50 px-3 py-2 rounded-lg"
            >
              About
            </button>

            {/* AUTH SECTION */}
            {auth.user ? (
              <ProfileMenu />
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => navigate("/register")}
                  className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white shadow-lg font-medium px-6"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* MOBILE MENU ICON */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-red-700">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
