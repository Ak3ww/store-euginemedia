"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 4 Original Cricket-Weapon Slides & Exact Texts
const slides = [
  {
    image: "/images/cricket-weapon/img2.png",
    quote: "Unleash Your Passion for Cricket and Embrace the Thrill of the Game",
    saleText: "Get in the game with up to 50% off on a wide range of cricket gear's",
    productText: "Shop Now",
    link: "/products",
  },
  {
    image: "/images/cricket-weapon/03.jpg",
    quote: "Experience the Unparalleled Excitement and Achieve Victory with Our Premium Cricket Equipment",
    saleText: "Limited Time Offer: Don't miss out on the opportunity to upgrade your game",
    productText: "Buy Now",
    link: "/products",
  },
  {
    image: "/images/cricket-weapon/01.jpg",
    quote: "Gear up with the Latest Innovations and Dominate the Field like Never Before",
    saleText: "Discover New Arrivals and stay ahead of the competition",
    productText: "Explore",
    link: "/products",
  },
  {
    image: "/images/cricket-weapon/04.jpg",
    quote: "Elevate Your Performance and Unleash Your True Cricketing Potential with Our Cutting-Edge Gear",
    saleText: "New Arrivals: Enhance your skills and excel on the field",
    productText: "Upgrade Now",
    link: "/products",
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
              className="w-full h-full object-cover object-center filter brightness-[0.70]"
            />

            {/* Dark gradient overlay for text readability */}
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
        title="Previous Slide"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-[#00000088] text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
        title="Next Slide"
      >
        <ChevronRight className="h-8 w-8" />
      </button>
    </div>
  );
}
