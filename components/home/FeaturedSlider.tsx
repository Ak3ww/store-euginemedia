"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./FeatureSlider.css";

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: "ftth-ont-gpon-hg680",
    name: "Modem ONT GPON Fiberhome Dual Band Gigabit",
    price: 245000,
    originalPrice: 285000,
    image: "/images/products/ont-router.png",
  },
  {
    id: "mikrotik-rb750gr3-hex",
    name: "MikroTik RB750Gr3 hEX Gigabit Routerboard",
    price: 890000,
    originalPrice: 950000,
    image: "/images/products/mikrotik-hex.png",
  },
  {
    id: "dropcore-1-core-1000m",
    name: "Kabel Fiber Optik Dropcore 1 Core 3 SEL 1000M",
    price: 365000,
    originalPrice: 420000,
    image: "/images/products/dropcore-cable.png",
  },
  {
    id: "cctv-hikvision-colorvu-2mp",
    name: "Hikvision ColorVu 2MP Full Time Color Outdoor",
    price: 385000,
    originalPrice: 450000,
    image: "/images/products/cctv-dome.png",
  },
  {
    id: "fusion-splicer-ai9",
    name: "Signalfire AI-9 Fusion Splicer Optical Fiber",
    price: 11500000,
    originalPrice: 12800000,
    image: "/images/products/splicer-machine.png",
  },
  {
    id: "kaos-polo-eugine-engineer",
    name: "Official Eugine Media Field Engineer Polo Shirt",
    price: 125000,
    originalPrice: 150000,
    image: "/images/products/polo-shirt.png",
  },
];

export default function FeaturedSlider() {
  return (
    <div className="w-full py-8">
      <Swiper
        modules={[EffectCoverflow, Pagination, A11y, Autoplay]}
        loop={true}
        speed={500}
        spaceBetween={50}
        slidesPerView={"auto"}
        pagination={{ clickable: true }}
        effect={"coverflow"}
        centeredSlides={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 10,
          depth: 50,
          modifier: 3,
          slideShadows: false,
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          768: {
            slidesPerView: 2,
            spaceBetween: 80,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 100,
          },
        }}
        className="featured_swiper"
      >
        {FEATURED_PRODUCTS.map((product) => {
          const formattedPrice = `Rp ${product.price.toLocaleString("id-ID")}`;
          const formattedOldPrice = product.originalPrice
            ? `Rp ${product.originalPrice.toLocaleString("id-ID")}`
            : null;

          return (
            <SwiperSlide key={product.id} className="featured_slides">
              <Link
                href={`/products/${product.id}`}
                style={{ textDecoration: "none", color: "inherit", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              >
                {/* 1. Judul Produk DI ATAS Foto (Exact Cricket-Weapon) */}
                <div className="featured_title line-clamp-2">{product.name}</div>

                {/* 2. Figure Foto Produk di Tengah */}
                <figure className="featured_img">
                  <img src={product.image} alt={product.name} />
                </figure>

                {/* 3. Harga Produk di Bawah */}
                <h2 className="products_price">
                  <span className="final_price">{formattedPrice}</span>
                  {formattedOldPrice && (
                    <small>
                      <del className="old_price">{formattedOldPrice}</del>
                    </small>
                  )}
                </h2>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
