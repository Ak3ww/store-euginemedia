"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Star, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

interface FeaturedProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
}

const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: "ftth-ont-gpon-hg680",
    name: "Modem ONT GPON Fiberhome Dual Band Gigabit",
    category: "FTTH & Jaringan",
    price: 245000,
    originalPrice: 285000,
    image: "/images/products/ont-router.png",
    rating: 5,
    reviews: 48,
  },
  {
    id: "mikrotik-rb750gr3-hex",
    name: "MikroTik RB750Gr3 hEX Gigabit Routerboard",
    category: "Router & Mikrotik",
    price: 890000,
    originalPrice: 950000,
    image: "/images/products/mikrotik-hex.png",
    rating: 5,
    reviews: 64,
  },
  {
    id: "dropcore-1-core-1000m",
    name: "Kabel Fiber Optik Dropcore 1 Core 3 SEL 1000M",
    category: "Kabel & FTTH",
    price: 365000,
    originalPrice: 420000,
    image: "/images/products/dropcore-cable.png",
    rating: 5,
    reviews: 32,
  },
  {
    id: "cctv-hikvision-colorvu-2mp",
    name: "Hikvision ColorVu 2MP Full Time Color Outdoor",
    category: "CCTV & Security",
    price: 385000,
    originalPrice: 450000,
    image: "/images/products/cctv-dome.png",
    rating: 5,
    reviews: 29,
  },
  {
    id: "fusion-splicer-ai9",
    name: "Signalfire AI-9 Fusion Splicer Optical Fiber",
    category: "Tools & Splicer",
    price: 11500000,
    originalPrice: 12800000,
    image: "/images/products/splicer-machine.png",
    rating: 5,
    reviews: 14,
  },
  {
    id: "kaos-polo-eugine-engineer",
    name: "Official Eugine Media Field Engineer Polo Shirt",
    category: "Merchandise",
    price: 125000,
    originalPrice: 150000,
    image: "/images/products/polo-shirt.png",
    rating: 5,
    reviews: 82,
  },
];

export default function FeaturedSlider() {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <section className="w-full py-14 bg-[#121212] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8 text-center">
        {/* Cricket-Weapon Style Section Header */}
        <p className="text-[11px] font-bold tracking-[0.25em] text-[#ed1c24] uppercase font-['Archivo'] mb-1">
          Koleksi Pilihan Terbaik
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight font-['Archivo'] text-white">
          Featured Products
        </h2>
        <div className="w-16 h-1 bg-[#ed1c24] mx-auto mt-3" />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 25,
            stretch: 0,
            depth: 120,
            modifier: 1.5,
            slideShadows: true,
          }}
          modules={[EffectCoverflow, Autoplay, Pagination]}
          className="featured-swiper py-10"
        >
          {FEATURED_PRODUCTS.map((product) => (
            <SwiperSlide
              key={product.id}
              className="w-[280px] sm:w-[320px] bg-white text-neutral-900 rounded-[4px] overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              {/* Image Box */}
              <div className="relative aspect-square w-full bg-neutral-100 p-6 flex items-center justify-center">
                <span className="absolute top-3 left-3 bg-[#ed1c24] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider font-['Archivo']">
                  Featured
                </span>
                <Link href={`/products/${product.id}`} className="block w-full h-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </Link>
              </div>

              {/* Card Details */}
              <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 font-['Roboto'] mb-1">
                    {product.category}
                  </p>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-[14px] font-bold text-neutral-900 font-['Archivo'] line-clamp-2 hover:text-[#ed1c24] transition-colors leading-tight">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1 mt-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-amber-500" />
                      ))}
                    </div>
                    <span className="text-[11px] font-medium text-neutral-400">
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <div className="flex items-baseline space-x-2 mb-3">
                    <span className="text-[16px] font-extrabold text-neutral-900 font-['Archivo']">
                      Rp {product.price.toLocaleString("id-ID")}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] font-medium text-neutral-400 line-through">
                        Rp {product.originalPrice.toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        weight: 500,
                        quantity: 1,
                      })
                    }
                    className="w-full h-[40px] bg-[#121212] text-white font-['Archivo'] font-bold text-[12px] tracking-wide rounded-[3px] uppercase flex items-center justify-center space-x-2 transition-all duration-200 hover:bg-[#ed1c24] active:scale-[0.98]"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Tambah ke Keranjang</span>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
