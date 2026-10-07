"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const STORE_CATEGORIES = [
  { name: "Cricket Bats", slug: "bats" },
  { name: "Batting Pads", slug: "pads" },
  { name: "Batting Gloves", slug: "gloves" },
  { name: "Helmets", slug: "helmets" },
  { name: "Kit Bags", slug: "bags" },
  { name: "Cricket Shoes", slug: "shoes" },
  { name: "Balls & Gear", slug: "balls" },
];

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-900" />
          <span className="text-sm font-medium text-neutral-600 font-['Roboto']">Memuat produk...</span>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const queryParam = searchParams.get("q") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States (Exact Cricket-Weapon Products.jsx)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [selectedRating, setSelectedRating] = useState("all");

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const prodRes = await fetch(
          `/api/products?category=${selectedCategory || "all"}&q=${encodeURIComponent(queryParam)}`
        );
        const prodJson = await prodRes.json();

        if (prodJson.success && prodJson.products?.length > 0) {
          setProducts(prodJson.products);
        } else {
          const { sampleProducts } = await import("@/lib/data");
          setProducts(
            sampleProducts.map((p) => ({ ...p, slug: p.id, imageUrl: p.image, stock: 25, weight: 500 }))
          );
        }
      } catch (err) {
        console.warn("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadData, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, queryParam]);

  // Client-side Price, Category & Rating Filter
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      !selectedCategory || selectedCategory === "all"
        ? true
        : (p.category?.slug === selectedCategory || p.category === selectedCategory);

    const matchPrice = p.price >= minPrice && p.price <= maxPrice;
    const matchRating =
      selectedRating === "all"
        ? true
        : selectedRating === "4"
        ? (p.rating || 5) >= 4
        : selectedRating === "3"
        ? (p.rating || 5) >= 3
        : true;
    return matchCategory && matchPrice && matchRating;
  });

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-8">
      {/* Container 2-Kolom: Sidebar Kiri (filterBox) + Grid Kanan (products) persis Products.jsx */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ============================================================ */}
        {/* 1. SIDEBAR FILTER KIRI (Exact Cricket-Weapon filterBox)       */}
        {/* ============================================================ */}
        <aside className="w-full lg:w-[280px] bg-white rounded-[5px] p-6 shadow-[0_0_5px_rgba(0,0,0,0.2)] shrink-0">
          {/* Price Filter Header */}
          <h3 className="text-[17px] font-[700] text-[#414141] font-['Roboto'] mb-3">Price Range (Rp)</h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                className="w-full h-9 px-2 text-xs border border-neutral-300 rounded-[3px] font-['Roboto']"
                placeholder="Min"
              />
              <span className="text-sm text-[#414141] font-medium">to</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value) || 10000000)}
                className="w-full h-9 px-2 text-xs border border-neutral-300 rounded-[3px] font-['Roboto']"
                placeholder="Max"
              />
            </div>
            <div className="text-[11px] text-neutral-400">
              Rp {minPrice.toLocaleString("id-ID")} — Rp {maxPrice.toLocaleString("id-ID")}
            </div>
          </div>

          <div className="w-full h-[0.8px] bg-[#d7d5d2d4] mb-6" />

          {/* Categories Filter */}
          <h3 className="text-[17px] font-[700] text-[#414141] font-['Roboto'] mb-3">Categories</h3>

          <ul className="space-y-2 mb-6">
            <li className="flex items-center space-x-2.5">
              <input
                type="checkbox"
                id="cat-all"
                checked={selectedCategory === "" || selectedCategory === "all"}
                onChange={() => setSelectedCategory("")}
                className="w-4 h-4 accent-[#414141] cursor-pointer"
              />
              <label htmlFor="cat-all" className="text-[14px] font-[500] text-[#414141] cursor-pointer hover:text-[#ed1c24] font-['Roboto']">
                Semua Kategori
              </label>
            </li>

            {STORE_CATEGORIES.map((cat) => (
              <li key={cat.slug} className="flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  id={`cat-${cat.slug}`}
                  checked={selectedCategory === cat.slug}
                  onChange={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
                  className="w-4 h-4 accent-[#414141] cursor-pointer"
                />
                <label htmlFor={`cat-${cat.slug}`} className="text-[14px] font-[500] text-[#414141] cursor-pointer hover:text-[#ed1c24] font-['Roboto']">
                  {cat.name}
                </label>
              </li>
            ))}
          </ul>

          <div className="w-full h-[0.8px] bg-[#d7d5d2d4] mb-6" />

          {/* Ratings Above Filter */}
          <h3 className="text-[17px] font-[700] text-[#414141] font-['Roboto'] mb-3">Ratings Above</h3>

          <div className="space-y-2 mb-6">
            <label className="flex items-center space-x-2 cursor-pointer text-sm text-[#414141] font-['Roboto']">
              <input
                type="radio"
                name="rating"
                value="all"
                checked={selectedRating === "all"}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="accent-[#ed1c24]"
              />
              <span>Semua Rating</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-sm text-[#414141] font-['Roboto']">
              <input
                type="radio"
                name="rating"
                value="4"
                checked={selectedRating === "4"}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="accent-[#ed1c24]"
              />
              <span>4★ & above</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-sm text-[#414141] font-['Roboto']">
              <input
                type="radio"
                name="rating"
                value="3"
                checked={selectedRating === "3"}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="accent-[#ed1c24]"
              />
              <span>3★ & above</span>
            </label>
          </div>

          {/* Reset Filter Button */}
          <button
            onClick={() => {
              setSelectedCategory("");
              setMinPrice(0);
              setMaxPrice(10000000);
              setSelectedRating("all");
            }}
            className="w-full h-9 bg-neutral-100 hover:bg-[#ed1c24] hover:text-white text-[#414141] text-xs font-bold uppercase rounded-[3px] transition-colors font-['Archivo'] cursor-pointer"
          >
            Reset Filter
          </button>
        </aside>

        {/* ============================================================ */}
        {/* 2. GRID PRODUK KANAN (Exact Cricket-Weapon products)         */}
        {/* ============================================================ */}
        <main className="flex-1 w-full">
          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-black" />
              <span className="text-sm font-medium text-neutral-600 font-['Roboto']">Memuat produk...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[5px] shadow-[0_0_5px_rgba(0,0,0,0.15)] p-8">
              <h3 className="text-xl font-bold font-['Archivo'] text-neutral-800">Product Not Found</h3>
              <p className="text-sm text-neutral-500 font-['Roboto'] mt-1">
                Tidak ada produk yang cocok dengan filter harga atau kategori ini.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setMinPrice(0);
                  setMaxPrice(10000000);
                  setSelectedRating("all");
                }}
                className="mt-4 px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-[3px] hover:bg-[#ed1c24] transition-colors"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center sm:justify-start gap-[1.5rem]">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
