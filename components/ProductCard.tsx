"use client";

import Link from "next/link";
import { Star, ShoppingBag, Eye } from "lucide-react";
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
    shopeeUrl?: string | null;
    tokopediaUrl?: string | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const displayImage = product.imageUrl || product.image || "/images/placeholder-product.png";
  const productHref = `/products/${product.slug || product.id}`;
  const ratingValue = product.rating || 5;
  const reviewCount = product.reviews || 12;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: displayImage,
      weight: product.weight || 500,
      quantity: 1,
    });
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="group relative flex flex-col justify-between bg-white border border-neutral-200/80 rounded-md overflow-hidden transition-all duration-300 hover:shadow-md hover:border-neutral-300">
      {/* Product Image Media Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-50 p-4">
        {/* Discount Badge */}
        {discountPercent ? (
          <span className="absolute top-3 left-3 z-10 bg-[#ed1c24] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase font-['Archivo']">
            -{discountPercent}%
          </span>
        ) : product.badge ? (
          <span className="absolute top-3 left-3 z-10 bg-neutral-900 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase font-['Archivo']">
            {product.badge}
          </span>
        ) : null}

        <Link href={productHref} className="block h-full w-full">
          <img
            src={displayImage}
            alt={product.name}
            className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Card Content Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Star Ratings */}
        <div className="mb-1.5 flex items-center space-x-1">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(ratingValue) ? "fill-current text-amber-500" : "text-neutral-200 fill-neutral-200"
                }`}
              />
            ))}
          </div>
          <span className="text-[12px] font-medium text-neutral-500">({reviewCount})</span>
        </div>

        {/* Product Title */}
        <Link href={productHref} className="mb-2">
          <h3 className="line-clamp-2 text-[14px] font-bold text-neutral-900 leading-snug group-hover:text-[#ed1c24] transition-colors font-['Archivo']">
            {product.name}
          </h3>
        </Link>

        {/* Price Row (Cricket-Weapon Strikethrough & Big Bold Price) */}
        <div className="mt-auto pt-2 flex items-baseline space-x-2">
          <span className="text-[16px] sm:text-[18px] font-extrabold text-neutral-900 font-['Archivo']">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[12px] font-medium text-neutral-400 line-through">
              Rp {product.originalPrice.toLocaleString("id-ID")}
            </span>
          )}
        </div>

        {/* Cricket Weapon Signature Action Button */}
        <div className="mt-3.5">
          <button
            onClick={handleAddToCart}
            className="w-full h-[42px] bg-neutral-900 text-white font-['Archivo'] font-bold text-[13px] tracking-wide rounded-[4px] uppercase flex items-center justify-center space-x-2 transition-all duration-200 hover:bg-[#ed1c24] active:scale-[0.98]">
            <ShoppingBag className="h-4 w-4" />
            <span>Tambah ke Keranjang</span>
          </button>
        </div>
      </div>
    </div>
  );
}
