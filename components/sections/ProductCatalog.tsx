"use client";

import React, { useState, useEffect } from "react";
import { ProductCard, ProductCardProps } from "@/components/ProductCard";
import { LayoutGrid, Layers, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function ProductCatalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories"),
          fetch(`/api/products${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`),
        ]);
        const catData = await catRes.json();
        const prodData = await prodRes.json();

        if (catData.categories) setCategories(catData.categories);
        if (prodData.products) {
          setProducts(
            prodData.products.map((p: any) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              price: p.price,
              originalPrice: p.originalPrice,
              weight: p.weight,
              imageUrl: p.imageUrl,
              category: p.category?.name,
              stock: p.stock,
              shopeeUrl: p.shopeeUrl,
              tokopediaUrl: p.tokopediaUrl,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [selectedCategory]);

  return (
    <section id="katalog" className="my-8">
      {/* Category Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Katalog Produk Resmi</h2>
          <p className="text-xs text-slate-500">Perangkat jaringan berkualitas dengan harga terbaik untuk ISP & RT-RW Net</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-[#002c60] text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            Semua Produk
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? "bg-[#002c60] text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#002c60] mb-2" />
          <span className="text-xs font-medium">Memuat katalog perangkat...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
          <Layers className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <h4 className="text-sm font-semibold text-slate-700">Belum Ada Produk di Kategori Ini</h4>
          <p className="text-xs text-slate-400 mt-1">Silakan pilih kategori lain atau lihat Semua Produk.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </section>
  );
}
