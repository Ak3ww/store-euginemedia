import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function FeaturedProducts() {
  let displayProducts: any[] = [];

  try {
    displayProducts = await prisma.product.findMany({
      where: { isActive: true },
      take: 8,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.warn("DB fetch error in FeaturedProducts, fallback to static:", err);
  }

  // Fallback to static mock products if db empty
  if (displayProducts.length === 0) {
    const { sampleProducts } = await import("@/lib/data");
    displayProducts = sampleProducts.map((p) => ({
      ...p,
      slug: p.id,
      imageUrl: p.image,
      stock: 20,
      weight: 500,
    }));
  }

  return (
    <section className="bg-white py-14 sm:py-20 border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header (Cricket-Weapon Heading Style) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#ed1c24] font-['Archivo']">
              Katalog Unggulan
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 font-['Archivo'] mt-1">
              Produk Terpopuler & Rekomendasi
            </h2>
          </div>
          <Link
            href="/products"
            className="mt-3 sm:mt-0 inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-[#ed1c24] transition-colors font-['Archivo']">
            <span>Lihat Semua Produk</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 2-Column Grid on Mobile, 4-Column on Desktop */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
