"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

interface ProductCardProps {
  product: {
    id: string;
    slug?: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    imageUrl?: string | null;
    image?: string;
    rating?: number;
    reviews?: number;
    weight?: number;
    description?: string;
    badge?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const displayImage = product.imageUrl || product.image || "/images/placeholder-product.png";
  const productHref = `/products/${product.slug || product.id}`;
  const ratingValue = product.rating || 5;
  const reviewCount = product.reviews || 12;

  // Exact truncated title & description from Cricket-Weapon ProductCard.jsx
  const nameTruncated =
    product.name.split(" ").slice(0, 4).join(" ") + (product.name.split(" ").length > 4 ? "..." : "");

  const descriptionTruncated = product.description
    ? product.description.split(" ").slice(0, 7).join(" ") + "..."
    : "Perangkat original bergaransi resmi PT Eugine Media Group...";

  const discountPriceFormatted = `Rp ${product.price.toLocaleString("id-ID")}`;
  const oldPriceFormatted =
    product.originalPrice && product.originalPrice > product.price
      ? `Rp ${product.originalPrice.toLocaleString("id-ID")}`
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: displayImage,
      weight: product.weight || 500,
      quantity: 1,
    });
  };

  return (
    <div className="w-[280px] bg-white rounded-[4px] shadow-[0_0_5px_rgba(0,0,0,0.15)] flex flex-col justify-between m-2 overflow-hidden hover:shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-shadow">
      <Link href={productHref} className="block text-inherit no-underline">
        {/* Media Image (Exact 200px height with margin: 1rem 1rem 0 1rem) */}
        <div className="h-[200px] w-[90%] mx-auto mt-4 overflow-hidden flex items-center justify-center bg-transparent">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Content Box */}
        <div className="p-4 text-left">
          {/* Product Name (Bold, Black, Font-Roboto/Archivo) */}
          <h3 className="font-['Roboto',sans-serif] font-[700] text-[15px] text-black leading-snug line-clamp-1 mb-1">
            {nameTruncated}
          </h3>

          {/* Rating (Red Stars #ed1c24, Exact Cricket-Weapon) */}
          <div className="flex items-center space-x-1 mb-1.5">
            <div className="flex items-center text-[#ed1c24]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(ratingValue) ? "fill-[#ed1c24] text-[#ed1c24]" : "text-neutral-300 fill-neutral-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-[12px] text-neutral-500 font-['Roboto']">({reviewCount})</span>
          </div>

          {/* Truncated Description */}
          <p className="text-[12px] font-[500] text-neutral-500 leading-tight line-clamp-2 h-8 mb-2 font-['Roboto']">
            {descriptionTruncated}
          </p>

          {/* Price Box (Old Price coret + Final Bold Price) */}
          <div className="flex items-center space-x-2">
            {oldPriceFormatted && (
              <span className="text-[14px] font-bold text-neutral-400 line-through font-['Archivo']">
                {oldPriceFormatted}
              </span>
            )}
            <span className="text-[16px] font-bold text-black font-['Archivo']">
              {discountPriceFormatted}
            </span>
          </div>
        </div>
      </Link>

      {/* Button Add to Cart (Black with hover #ed1c24) */}
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full h-[45px] bg-black text-white font-['Archivo'] font-bold text-[14px] rounded-[4px] uppercase tracking-wide transition-colors duration-200 hover:bg-[#ed1c24] hover:text-black flex items-center justify-center cursor-pointer active:scale-[0.99]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
