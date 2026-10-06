"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { ProductCard } from "@/components/ProductCard";
import {
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  Award,
  ArrowLeft,
  Plus,
  Minus,
  CheckCircle2,
  ExternalLink,
  Layers,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { addItem } = useCartStore();
  const { customer, openAuthModal } = useAuthStore();

  useEffect(() => {
    if (!slug) return;
    async function loadProduct() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          setRelated(data.related || []);
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#002c60] mb-2" />
        <span className="text-xs font-medium">Memuat detail spesifikasi produk...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mb-6">Produk mungkin sudah tidak aktif atau tautan salah.</p>
        <Link href="/">
          <Button variant="outline" className="text-xs">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali ke Katalog
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        weight: product.weight,
        imageUrl: product.imageUrl,
        category: product.category?.name,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (!customer) {
      openAuthModal();
    } else {
      router.push("/checkout");
    }
  };

  const specs = product.specifications as Record<string, string> | null;

  return (
    <div className="space-y-12">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#002c60]">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Produk
      </Link>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Product Image */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl bg-white border border-slate-200 p-8 flex items-center justify-center shadow-sm relative overflow-hidden">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain" />
            ) : (
              <ShoppingBag className="w-24 h-24 text-slate-200" />
            )}

            <div className="absolute top-4 left-4">
              <span className="bg-[#002c60] text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                {product.category?.name || "Jaringan"}
              </span>
            </div>

            <div className="absolute top-4 right-4">
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready Stock
              </span>
            </div>
          </div>

          {/* Quick Perks */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center text-xs">
              <ShieldCheck className="w-4 h-4 text-[#002c60] mx-auto mb-1" />
              <div className="font-bold text-slate-800">100% Asli</div>
              <div className="text-[10px] text-slate-400">Garansi Pabrik</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center text-xs">
              <Truck className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <div className="font-bold text-slate-800">Siap Kirim</div>
              <div className="text-[10px] text-slate-400">Seluruh Wilayah</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center text-xs">
              <Award className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="font-bold text-slate-800">Tukar Baru</div>
              <div className="text-[10px] text-slate-400">Jika Cacat Unit</div>
            </div>
          </div>
        </div>

        {/* Right: Info & Purchase Controls */}
        <div className="space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              {product.sku && <span>SKU: <strong className="text-slate-700">{product.sku}</strong></span>}
              <span>•</span>
              <span>Berat Pengiriman: <strong className="text-slate-700">{product.weight} gram</strong></span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <div className="text-xs text-slate-400 font-medium mb-1">Harga Distributor Resmi:</div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#002c60]">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">
                  Rp {product.originalPrice.toLocaleString("id-ID")}
                </span>
              )}
            </div>
          </div>

          {/* Quantity Selector & Direct Purchase */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-300 rounded-lg bg-white h-11 px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 h-11 border-slate-300 text-slate-800 font-semibold text-xs rounded-lg hover:bg-slate-50"
              >
                <ShoppingBag className="w-4 h-4 mr-2 text-[#002c60]" />
                Tambah ke Keranjang
              </Button>
            </div>

            <Button
              onClick={handleBuyNow}
              className="w-full h-11 bg-[#002c60] hover:bg-[#001f44] text-white font-bold text-xs rounded-lg shadow-sm"
            >
              Beli Sekarang (Checkout Cepat)
            </Button>

            <a
              href={`https://wa.me/6281548727257?text=${encodeURIComponent(
                `Halo sales EugineStore, saya ingin konsultasi atau pesan produk: *${product.name}* (Rp ${product.price.toLocaleString(
                  "id-ID"
                )}). Apakah stok masih tersedia?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Konsultasi Spesifikasi via WhatsApp</span>
            </a>
          </div>

          {/* Official Marketplace Links Section */}
          {(product.shopeeUrl || product.tokopediaUrl || product.tiktokUrl) && (
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Opsi Beli di Marketplace Resmi:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.shopeeUrl && (
                  <a
                    href={product.shopeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg border border-[#EE4D2D]/30 bg-[#EE4D2D]/5 hover:bg-[#EE4D2D]/10 text-xs font-semibold text-[#EE4D2D] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <img src="/images/marketplaces/shopee.svg" alt="Shopee" className="w-4 h-4" />
                      <span>Beli di Shopee</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                )}

                {product.tokopediaUrl && (
                  <a
                    href={product.tokopediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg border border-[#03AC0E]/30 bg-[#03AC0E]/5 hover:bg-[#03AC0E]/10 text-xs font-semibold text-[#03AC0E] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <img src="/images/marketplaces/tokopedia.svg" alt="Tokopedia" className="w-4 h-4" />
                      <span>Beli di Tokopedia</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Description & Technical Specs */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Deskripsi Produk</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>

            {specs && Object.keys(specs).length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Spesifikasi Teknis</h3>
                <div className="rounded-lg border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                  {Object.entries(specs).map(([key, val]) => (
                    <div key={key} className="flex px-3 py-2 bg-white">
                      <span className="w-1/3 text-slate-500 font-medium capitalize">{key}</span>
                      <span className="w-2/3 text-slate-800 font-semibold">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">Produk Terkait Lainnya</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                slug={item.slug}
                price={item.price}
                originalPrice={item.originalPrice}
                weight={item.weight}
                imageUrl={item.imageUrl}
                category={product.category?.name}
                stock={item.stock}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
