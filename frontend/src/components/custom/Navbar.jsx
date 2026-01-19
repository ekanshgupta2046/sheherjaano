"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import ProfileMenu from "./ProfileMenu";
import NotificationBell from "./Notifications/NotificationBell";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import BrandLogo from "@/components/custom/BrandLogo";

export default function Navbar({
  onScrollToTop,
  onScrollToAbout,
  onScrollToContribute,
}) {
  const navigate = useNavigate();
  const { auth,logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  if (auth.loading) return null;

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-amber-200 bg-amber-100/80 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <BrandLogo size="md" />
            {/* LEFT: Logo */}
            {/* <div className="flex items-center space-x-3">
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
            </div> */}

            {/* DESKTOP LINKS */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={onScrollToTop}
                className="text-red-700 hover:text-red-800 font-medium transition-colors hover:bg-red-50 px-3 py-2 rounded-lg"
              >
                Home
              </button>

              {auth.user?.role === "contributor" ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-red-700 hover:text-red-800 font-semibold transition-colors hover:bg-red-50 px-3 py-2 rounded-lg"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={onScrollToContribute}
                  className="text-red-700 hover:text-red-800 font-medium transition-colors hover:bg-red-50 px-3 py-2 rounded-lg"
                >
                  Contribute
                </button>
              )}

              <button
                onClick={onScrollToAbout}
                className="text-red-700 hover:text-red-800 font-medium transition-colors hover:bg-red-50 px-3 py-2 rounded-lg"
              >
                About
              </button>

              {auth.user ? (
                <div className="flex items-center space-x-4">
                  <NotificationBell />
                  <ProfileMenu />
                </div>
              ) : (
                <Button
                  onClick={() => navigate("/register")}
                  className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white shadow-lg font-medium px-6"
                >
                  Sign Up
                </Button>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="md:hidden relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-700"
                onClick={toggleMobile}
              >
                <Menu className="h-6 w-6" />
              </Button>

              {/* MOBILE DROPDOWN */}
              {/* MOBILE DROPDOWN */}
{mobileOpen && (
  <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl border border-amber-200 py-3 z-[999] animate-in fade-in zoom-in-90 duration-150">

    {/* USER INFO */}
    {auth.user && (
      <div className="flex items-center gap-3 px-4 pb-3 border-b border-amber-100">
        
        <Avatar className="w-10 h-10 border border-amber-300 shadow-sm">
          <AvatarImage
            src={auth.user.image}
            alt={auth.user.username}
          />
          <AvatarFallback className="bg-amber-200 text-amber-900 font-semibold">
            {auth.user.username?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="font-medium text-amber-900 text-sm">
          {auth.user.username}
        </div>
      </div>
    )}

    {/* NAV OPTIONS */}
    <button
      onClick={() => {
        setMobileOpen(false);
        onScrollToTop();
      }}
      className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50"
    >
      Home
    </button>

    {auth.user?.role === "contributor" ? (
      <button
        onClick={() => {
          setMobileOpen(false);
          navigate("/dashboard");
        }}
        className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50"
      >
        Dashboard
      </button>
    ) : (
      <button
        onClick={() => {
          setMobileOpen(false);
          onScrollToContribute();
        }}
        className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50"
      >
        Contribute
      </button>
    )}

    <button
      onClick={() => {
        setMobileOpen(false);
        onScrollToAbout();
      }}
      className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50"
    >
      About
    </button>

    {/* LOGOUT */}
    {auth.user && (
      <button
  onClick={() => {
    setMobileOpen(false);
    logout();
  }}
  className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50 border-t"
>
  Logout
</button>
    )}

    {/* SIGN UP */}
    {!auth.user && (
      <button
        onClick={() => {
          setMobileOpen(false);
          navigate("/register");
        }}
        className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50"
      >
        Sign Up
      </button>
    )}
  </div>
)}

            </div>
          </div>
        </div>
      </nav>

      {/* CLICK OUTSIDE TO CLOSE */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
