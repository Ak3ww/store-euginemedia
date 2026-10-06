"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-900" />
          <span className="text-sm font-medium text-neutral-600 font-['Roboto']">Memuat produk...</span>
        </div>
      }>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync category param with state
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Fetch Products & Categories
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/products?category=${selectedCategory}&q=${encodeURIComponent(searchQuery)}`),
          fetch("/api/categories"),
        ]);

        const prodJson = await prodRes.json();
        const catJson = await catRes.json();

        if (prodJson.success && prodJson.products?.length > 0) {
          setProducts(prodJson.products);
        } else {
          // Fallback to static data if database product list empty
          const { sampleProducts } = await import("@/lib/data");
          setProducts(sampleProducts.map((p) => ({ ...p, slug: p.id, imageUrl: p.image, stock: 25, weight: 500 })));
        }

        if (catJson.success && catJson.categories?.length > 0) {
          setCategories(catJson.categories);
        }
      } catch (err) {
        console.warn("Failed fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadData, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title & Search Bar */}
      <div className="mb-8 border-b border-neutral-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#ed1c24] font-['Archivo']">
            Katalog Resmi
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 font-['Archivo'] mt-1">
            Katalog Produk & Merchandise
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600 font-['Roboto']">
            Seluruh produk dijamin 100% original bergaransi resmi PT Eugine Media Group.
          </p>
        </div>

        {/* Search Input (Cricket-Weapon Style) */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama produk, sku..."
            className="w-full h-11 pl-10 pr-4 bg-white border border-neutral-300 rounded-[4px] text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 font-['Roboto']"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="mb-8 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`h-9 px-4 rounded-[4px] text-xs font-bold uppercase tracking-wider font-['Archivo'] transition-all shrink-0 ${
            selectedCategory === "all"
              ? "bg-neutral-900 text-white"
              : "bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-900"
          }`}>
          Semua Produk
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id || cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`h-9 px-4 rounded-[4px] text-xs font-bold uppercase tracking-wider font-['Archivo'] transition-all shrink-0 ${
              selectedCategory === cat.slug
                ? "bg-neutral-900 text-white"
                : "bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-900"
            }`}>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product List */}
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-900" />
          <span className="text-sm font-medium text-neutral-600 font-['Roboto']">Memuat produk...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-md border border-neutral-200">
          <p className="text-base font-bold font-['Archivo'] text-neutral-800">Tidak ada produk ditemukan</p>
          <p className="text-xs text-neutral-500 font-['Roboto'] mt-1">Coba gunakan kata kunci pencarian lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
