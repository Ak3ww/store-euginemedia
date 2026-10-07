import React from "react";
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedSlider from "@/components/home/FeaturedSlider";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      where: { isActive: true },
      take: 12,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.warn("DB fetch error, falling back to static samples:", err);
  }

  if (products.length === 0) {
    const { sampleProducts } = await import("@/lib/data");
    products = sampleProducts.map((p) => ({
      ...p,
      slug: p.id,
      imageUrl: p.image,
      stock: 20,
      weight: 500,
    }));
  }

  // Format featured products for FeaturedSlider
  const featuredList = products.map((p) => ({
    id: p.slug || p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice || undefined,
    image: p.imageUrl || p.image || "/images/placeholder-product.png",
  }));

  return (
    <div className="w-full pb-16">
      {/* 1. Hero Slider (Exact Cricket-Weapon calc(100vh - 64px)) */}
      <div className="w-full">
        <HeroSlider />
      </div>

      {/* 2. Featured Products Section (Exact Cricket-Weapon Home.jsx style & FeatureSlider) */}
      <div className="w-full mt-[2.7rem]">
        <h2 className="text-center font-['Archivo',sans-serif] font-[800] text-[26px] sm:text-[32px] text-black">
          Featured Products
        </h2>
        <FeaturedSlider products={featuredList} />
      </div>

      {/* 3. Trending Products Section (Exact Cricket-Weapon Home.jsx) */}
      <h2 className="text-center mt-[2.7rem] mb-[20px] font-['Archivo',sans-serif] font-[800] text-[26px] sm:text-[32px] text-black">
        Trending Products
      </h2>

      {/* 4. Trending Products Flex/Grid Container (Exact Cricket-Weapon gap: 1.8rem) */}
      <div className="flex flex-wrap justify-center gap-[1.8rem] mx-auto px-4 max-w-[1440px]">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
