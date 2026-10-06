import HeroSlider from "@/components/home/HeroSlider";
import FeaturedSlider from "@/components/home/FeaturedSlider";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import Categories from "@/components/sections/Categories";
import Testimonials from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* 1. Cricket Weapon Full Viewport Hero Slider */}
      <HeroSlider />

      {/* 2. Cricket Weapon 3D Swiper Coverflow Featured Products */}
      <FeaturedSlider />

      {/* 3. Category Grid Breakdown */}
      <Categories />

      {/* 4. Trending & Popular Products (Cricket Weapon 280px Product Cards) */}
      <FeaturedProducts />

      {/* 5. Authentic Testimonials / Client Proof */}
      <Testimonials />
    </main>
  );
}
