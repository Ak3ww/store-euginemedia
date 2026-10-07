"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./FeatureSlider.css";

interface ProductItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

const DEFAULT_FEATURED: ProductItem[] = [
  {
    id: "cw-bat-kookaburra-ghost",
    name: "Kookaburra Ghost Pro Cricket Bat 2024",
    price: 3850000,
    originalPrice: 4500000,
    image: "/images/products/IMG-20230731-WA0015.jpg",
  },
  {
    id: "cw-bat-ss-ton-gladiator",
    name: "SS TON Gladiator English Willow Cricket Bat",
    price: 4950000,
    originalPrice: 5800000,
    image: "/images/products/IMG-20230731-WA0016.jpg",
  },
  {
    id: "cw-pads-mrf-grand-edition",
    name: "MRF Grand Edition Batting Legguard Pads",
    price: 1450000,
    originalPrice: 1750000,
    image: "/images/products/IMG-20230731-WA0021.jpg",
  },
  {
    id: "cw-gloves-sg-savage-pro",
    name: "SG Savage Pro Batting Gloves Leather Palm",
    price: 780000,
    originalPrice: 950000,
    image: "/images/products/IMG-20230731-WA0030.jpg",
  },
  {
    id: "cw-helmet-shrey-masterclass",
    name: "Shrey Masterclass AIR Cricket Helmet Titanium",
    price: 2150000,
    originalPrice: 2500000,
    image: "/images/products/IMG-20230731-WA0045.jpg",
  },
  {
    id: "cw-kitbag-kookaburra-pro",
    name: "Kookaburra Pro Wheelie Cricket Kitbag Large",
    price: 1850000,
    originalPrice: 2200000,
    image: "/images/products/IMG-20230731-WA0054.jpg",
  },
];

export default function FeaturedSlider({ products }: { products?: ProductItem[] }) {
  const displayProducts = products && products.length > 0 ? products : DEFAULT_FEATURED;

  return (
    <div className="w-full py-4">
      <Swiper
        modules={[EffectCoverflow, Pagination, A11y, Autoplay]}
        loop={true}
        speed={700}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        spaceBetween={30}
        pagination={{ clickable: true }}
        effect={"coverflow"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 70,
          modifier: 1.2,
          slideShadows: false,
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          640: {
            spaceBetween: 40,
          },
          1024: {
            spaceBetween: 50,
          },
        }}
        className="featured_swiper"
      >
        {displayProducts.map((product) => {
          const formattedPrice = `Rp ${product.price.toLocaleString("id-ID")}`;
          const formattedOldPrice = product.originalPrice
            ? `Rp ${product.originalPrice.toLocaleString("id-ID")}`
            : null;

          return (
            <SwiperSlide key={product.id} className="featured_slides">
              <Link
                href={`/products/${product.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* 1. Judul Produk DI ATAS Foto (Exact Cricket-Weapon FeatureSlider.jsx L60) */}
                <div className="featured_title line-clamp-2">{product.name}</div>

                {/* 2. Figure Foto Produk di Tengah */}
                <figure className="featured_img">
                  <img src={product.image} alt={product.name} />
                </figure>

                {/* 3. Harga Produk di Bawah (Exact Cricket-Weapon FeatureSlider.jsx L64) */}
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
