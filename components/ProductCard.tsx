"use client";

import React from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingBag, MessageCircle, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  weight: number;
  imageUrl?: string | null;
  category?: string;
  stock: number;
  shopeeUrl?: string | null;
  tokopediaUrl?: string | null;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  weight,
  imageUrl,
  category,
  stock,
}: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      slug,
      price,
      originalPrice,
      weight,
      imageUrl,
      category,
    });
  };

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-1">
      {/* Thumbnail Container */}
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-3 mb-3">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300">
              <ShoppingBag className="w-10 h-10 mb-1" />
              <span className="text-[10px] font-medium text-slate-400">EugineStore</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
            {discountPercent && (
              <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
                -{discountPercent}%
              </span>
            )}
            {category && (
              <span className="bg-white/95 backdrop-blur-sm border border-slate-200 text-[#002c60] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                {category}
              </span>
            )}
          </div>

          <div className="absolute top-2 right-2">
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
              Ready
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 min-h-[36px] sm:min-h-[40px] leading-snug group-hover:text-[#002c60] transition-colors mb-2">
          {name}
        </h3>

        {/* Price & Weight */}
        <div className="mb-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-extrabold text-[#002c60]">
              Rp {price.toLocaleString("id-ID")}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-[11px] text-slate-400 line-through">
                Rp {originalPrice.toLocaleString("id-ID")}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Berat: {weight}g</span>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100">
        <Button
          onClick={handleAddToCart}
          className="h-8 text-[11px] font-semibold bg-[#002c60] hover:bg-[#001f44] text-white rounded-md shadow-xs px-2"
        >
          <ShoppingBag className="w-3 h-3 mr-1" />
          <span>+ Keranjang</span>
        </Button>

        <a
          href={`https://wa.me/6281548727257?text=${encodeURIComponent(
            `Halo sales EugineStore, saya mau order atau tanya produk: *${name}* (Rp ${price.toLocaleString(
              "id-ID"
            )}). Apakah ready stock?`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="h-8 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md flex items-center justify-center gap-1 transition-colors px-2"
        >
          <MessageCircle className="w-3 h-3 text-emerald-600" />
          <span>Chat WA</span>
        </a>
      </div>
    </div>
  );
}

export default ProductCard;
