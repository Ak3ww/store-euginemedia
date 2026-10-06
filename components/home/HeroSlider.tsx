"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1920&auto=format&fit=crop",
    quote: "Performa Maksimal untuk Kecepatan Jaringan Tanpa Kompromi",
    saleText: "Diskon hingga 35% untuk Router MikroTik, Switch Managed & OLT FTTH",
    productText: "Belanja Sekarang",
    link: "/products?category=ftth",
  },
  {
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop",
    quote: "Keamanan Terintegrasi & Pengawasan Proaktif 24/7",
    saleText: "Solusi CCTV Resolusi Tinggi & Server Penyimpanan Andal",
    productText: "Lihat Produk CCTV",
    link: "/products?category=cctv",
  },
  {
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1920&auto=format&fit=crop",
    quote: "Distribusi Resmi Hardware & Komputer Bisnis Bergaransi",
    saleText: "Perangkat Keras, Server Rackmount, & Aksesoris Original",
    productText: "Katalog Hardware",
    link: "/products?category=hardware",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[calc(100vh-97px)] min-h-[500px] max-h-[750px] overflow-hidden bg-black select-none">
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}>
            {/* Background Image with Dark Contrast Gradient Overlay */}
            <img
              src={slide.image}
              alt={slide.quote}
              className="w-full h-full object-cover object-center filter brightness-65"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

            {/* Slide Content (Cricket-Weapon Authentic Positioning & Typography) */}
            <div className="absolute top-1/2 left-[8%] -translate-y-1/2 text-left text-white max-w-2xl px-4 sm:px-0">
              <p className="text-sm sm:text-base font-medium tracking-wide text-neutral-300 mb-2 font-['Roboto'] uppercase">
                {slide.quote}
              </p>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-['Roboto'] leading-tight mb-6">
                {slide.saleText}
              </h1>

              {/* Cricket-Weapon Signature Transparent Bordered Button */}
              <Link
                href={slide.link}
                className="inline-block px-8 py-3.5 border border-white text-white font-bold text-xs uppercase tracking-wider rounded-[3px] font-['Archivo'] transition-all duration-300 hover:bg-white hover:text-black">
                {slide.productText}
              </Link>
            </div>
          </div>
        );
      })}

      {/* Slider Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-[#ed1c24] transition-colors"
        title="Sebelumnya">
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-[#ed1c24] transition-colors"
        title="Berikutnya">
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-2 transition-all rounded-full ${
              currentSlide === i ? "w-8 bg-[#ed1c24]" : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
