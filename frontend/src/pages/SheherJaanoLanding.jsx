"use client";

import Navbar from "@/components/custom/Navbar";
import HeroSection from "@/components/custom/HeroSection";
import AboutSection from "@/components/custom/AboutSection";
import FeaturedCitiesSection from "@/components/custom/FeaturedCitiesSection";
import ContributeSection from "@/components/custom/ContributeSection";
import CTASection from "@/components/custom/CTASection";
import Footer from "@/components/custom/Footer";

export default function SheherJaanoLanding() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContribute = () => {
    const contributeSection = document.getElementById("contribute");
    if (contributeSection) {
      contributeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToFeatured = () => {
    const featuredSection = document.getElementById("featured-cities");
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: "smooth" });
    }
  };


  return (
    <div className="min-h-screen">

      <Navbar onScrollToTop={scrollToTop} onScrollToAbout={scrollToAbout} onScrollToContribute={scrollToContribute} />
      <HeroSection onScrollToFeatured={scrollToFeatured} />
      <AboutSection />
      <FeaturedCitiesSection />
      <ContributeSection />
      <CTASection onScrollToFeatured={scrollToFeatured} />
      <Footer />
    </div>
  );
}
