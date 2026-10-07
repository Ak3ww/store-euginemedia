"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1920&auto=format&fit=crop",
    quote: "Unleash Your High-Speed Network Connectivity and Power the Digital Future",
    saleText: "Get in the game with up to 35% off on MikroTik, Fiberhome ONT & Gigabit Switch",
    productText: "Shop Now",
    link: "/products",
  },
  {
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop",
    quote: "Experience the Unparalleled Excitement and Secure Your Premises with Smart CCTV",
    saleText: "Limited Time Offer: High-definition security cameras & 24/7 recording systems",
    productText: "Buy Now",
    link: "/products?category=cctv",
  },
  {
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1920&auto=format&fit=crop",
    quote: "Gear up with the Latest Hardware Innovations and Elevate Enterprise Performance",
    saleText: "Discover New Arrivals in official IT Hardware & certified networking tools",
    productText: "Explore Now",
    link: "/products?category=hardware",
  },
];

export default function HeroSlider() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % slides.length);
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[500px] overflow-hidden bg-black select-none">
      {slides.map((slide, index) => {
        const isActive = index === activeStep;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.quote}
              className="w-full h-full object-cover object-center filter brightness-[0.65]"
            />

            {/* Dark gradient for contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* Slide Content 1:1 Cricket-Weapon */}
            <div className="absolute top-1/2 left-[10%] -translate-y-1/2 text-left text-white z-10 max-w-[45vw] px-4 sm:px-0">
              <h2 className="text-[14px] sm:text-[16px] font-[500] text-white/95 mb-2 font-['Roboto',sans-serif] leading-relaxed max-w-[30vw]">
                {slide.quote}
              </h2>

              <h3 className="text-[24px] sm:text-[32px] md:text-[36px] font-[800] text-white mb-6 font-['Roboto',sans-serif] leading-tight">
                {slide.saleText}
              </h3>

              <Link
                href={slide.link}
                className="inline-block bg-transparent text-white border border-white rounded-[4px] px-6 py-2.5 text-[14px] sm:text-[15px] font-[500] uppercase tracking-wide transition-all duration-300 hover:bg-white hover:text-black font-['Archivo',sans-serif]"
              >
                {slide.productText}
              </Link>
            </div>
          </div>
        );
      })}

      {/* Nav Buttons Full Height with #00000088 (Exact Cricket-Weapon styling) */}
      <button
        onClick={handleBack}
        className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-[#00000088] text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
        title="Sebelumnya"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-[#00000088] text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
        title="Berikutnya"
      >
        <ChevronRight className="h-8 w-8" />
      </button>
    </div>
  );
}
