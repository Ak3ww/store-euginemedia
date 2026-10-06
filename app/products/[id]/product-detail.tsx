"use client";

import { useState } from "react";
import { Star, ShoppingBag, ShieldCheck, Truck, ArrowLeft, ExternalLink, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";

interface ProductDetailPageProps {
  product: {
    id: string;
    slug?: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    imageUrl?: string | null;
    image?: string;
    images?: string[] | any;
    description?: string;
    weight?: number;
    stock?: number;
    specifications?: Record<string, string> | any;
    shopeeUrl?: string | null;
    tokopediaUrl?: string | null;
    rating?: number;
    reviews?: number;
  };
  relatedProducts?: any[];
}

export default function ProductDetailPage({ product, relatedProducts = [] }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedImage, setSelectedImage] = useState(0);

  const imagesList = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.imageUrl || product.image || "/images/placeholder-product.png"];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imagesList[0],
      weight: product.weight || 500,
      quantity,
    });
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center space-x-2 text-xs font-semibold text-neutral-500 font-['Roboto'] uppercase tracking-wider">
        <Link href="/" className="hover:text-neutral-900 transition-colors">Beranda</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-neutral-900 transition-colors">Produk</Link>
        <span>/</span>
        <span className="text-neutral-900 truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-md border border-neutral-200 bg-white p-6 flex items-center justify-center overflow-hidden">
            {discountPercent && (
              <span className="absolute top-4 left-4 z-10 bg-[#ed1c24] text-white text-xs font-black px-2.5 py-1 rounded-xs uppercase tracking-wider font-['Archivo']">
                Diskon {discountPercent}%
              </span>
            )}
            <img
              src={imagesList[selectedImage] || "/images/placeholder-product.png"}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {imagesList.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {imagesList.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-20 w-20 shrink-0 rounded-md border p-1 bg-white transition-all ${
                    selectedImage === idx ? "border-neutral-900 ring-2 ring-neutral-900" : "border-neutral-200 opacity-70 hover:opacity-100"
                  }`}>
                  <img src={img} alt={`${product.name}-${idx}`} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Meta & Purchase Controls */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <span className="inline-block bg-neutral-100 text-neutral-800 text-[11px] font-bold px-2 py-0.5 rounded-sm font-['Archivo'] tracking-widest uppercase mb-2">
              Official Store — Eugine Media Group
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-['Archivo'] leading-tight">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="mt-3 flex items-center space-x-3">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current text-amber-500" />
                ))}
              </div>
              <span className="text-xs font-semibold text-neutral-600 font-['Roboto']">
                (4.9 • 38 Ulasan Terverifikasi)
              </span>
              <span className="text-neutral-300">|</span>
              <span className="text-xs font-bold text-emerald-700 font-['Roboto']">
                Stok Tersedia ({product.stock ?? 25} Unit)
              </span>
            </div>

            {/* Price Box */}
            <div className="mt-6 rounded-md bg-neutral-50 p-4 border border-neutral-200/80">
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl sm:text-3xl font-black text-neutral-900 font-['Archivo']">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm font-semibold text-neutral-400 line-through font-['Roboto']">
                    Rp {product.originalPrice.toLocaleString("id-ID")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-neutral-500 font-['Roboto']">
                Estimasi berat pengiriman: {product.weight || 500} gram
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center space-x-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 font-['Archivo']">
                Jumlah:
              </span>
              <div className="flex items-center border border-neutral-300 rounded-[4px] bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="px-3 text-sm font-bold font-['Archivo'] text-neutral-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons (Cricket Weapon Style) */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full h-[48px] bg-neutral-900 text-white font-['Archivo'] font-bold text-sm tracking-wider uppercase rounded-[4px] flex items-center justify-center space-x-2 transition-all duration-200 hover:bg-[#ed1c24] active:scale-[0.99]">
                <ShoppingBag className="h-4 w-4" />
                <span>Tambah ke Keranjang Belanja</span>
              </button>

              {/* Multi-Marketplace Links */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                {product.tokopediaUrl && (
                  <a
                    href={product.tokopediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-10 border border-emerald-600 text-emerald-700 text-xs font-bold font-['Archivo'] uppercase rounded-[4px] flex items-center justify-center space-x-1.5 hover:bg-emerald-50 transition-colors">
                    <span>Beli di Tokopedia</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {product.shopeeUrl && (
                  <a
                    href={product.shopeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-10 border border-orange-500 text-orange-600 text-xs font-bold font-['Archivo'] uppercase rounded-[4px] flex items-center justify-center space-x-1.5 hover:bg-orange-50 transition-colors">
                    <span>Beli di Shopee</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Guarantees */}
            <div className="mt-8 border-t border-neutral-200 pt-4 grid grid-cols-2 gap-4 text-xs text-neutral-600 font-['Roboto']">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-neutral-800 shrink-0" />
                <span>Pengiriman Cepat JNE, J&T, SiCepat</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Produk Original & Bergaransi Resmi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Technical Specifications */}
      <div className="mt-14 border-t border-neutral-200 pt-8">
        <h2 className="text-xl font-bold font-['Archivo'] uppercase tracking-tight text-neutral-900 mb-4">
          Deskripsi & Spesifikasi Teknis
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 prose prose-sm max-w-none text-neutral-700 font-['Roboto'] leading-relaxed whitespace-pre-line">
            {product.description || "Perangkat berkualitas tinggi siap pakai untuk kebutuhan infrastruktur jaringan dan internet Anda."}
          </div>

          {/* Technical Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="lg:col-span-5">
              <div className="rounded-md border border-neutral-200 overflow-hidden bg-white">
                <div className="bg-neutral-900 px-4 py-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white font-['Archivo']">
                    Spesifikasi Hardware
                  </h3>
                </div>
                <div className="divide-y divide-neutral-100 text-xs font-['Roboto']">
                  {Object.entries(product.specifications).map(([key, val]: [string, any]) => (
                    <div key={key} className="flex px-4 py-2.5">
                      <span className="w-1/2 font-semibold text-neutral-600 capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="w-1/2 text-neutral-900 font-medium">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
