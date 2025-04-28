import { HeroSection } from "@/components/hero-section";
import { CategorySection } from "@/components/category-section";
import { FeaturedProducts } from "@/components/featured-products";
import { WhyChooseUs } from "@/components/why-choose-us";
import { TestimonialsSection } from "@/components/testimonials-section";

export const metadata = {
  title: 'GreenThicks - Fresh Organic Vegetables Delivered to Your Home',
  description: 'Order fresh, organic vegetables directly from GreenThicks farms to your doorstep. Experience purity, taste, and health with every delivery!',
  keywords: ['GreenThicks', 'organic vegetables', 'fresh vegetables', 'vegetable delivery', 'farm fresh vegetables', 'buy vegetables online'],
  authors: [{ name: 'GreenThicks Team' }],
  openGraph: {
    title: 'GreenThicks - Fresh Organic Vegetables',
    description: 'Farm-fresh organic vegetables delivered to your home. Healthy. Fresh. Pure. Taste the difference!',
    url: 'https://www.greenthicks.live',
    siteName: 'GreenThicks',
    images: [
      {
        url: 'https://github.com/ShivaKrishnaReddyBurra/greenthicks-frontend/blob/main/src/public/About.png', // Optional: If you have a nice image for sharing.
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: 'index, follow',
};



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
