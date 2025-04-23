import { HeroSection } from "@/components/hero-section";
import { CategorySection } from "@/components/category-section";
import { FeaturedProducts } from "@/components/featured-products";
import { WhyChooseUs } from "@/components/why-choose-us";
import { TestimonialsSection } from "@/components/testimonials-section";

export default function Home() {
  return (
    <div className="leaf-pattern">
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <WhyChooseUs />
      <TestimonialsSection />
    </div>
  );
}
