"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import img from "@/public/hero.jpg";
import bnimg1 from "@/public/Free delivery.png";
import bnimg2 from "@/public/Free delivery 1.png";
import bnimg3 from "@/public/Free delivery.png";
import bnimg4 from "@/public/Free delivery 1.png";
import mobilebnimg1 from "@/public/mobile Free delivery .png";
import mobilebnimg2 from "@/public/mobile Free delivery 1.png";
import mobilebnimg3 from "@/public/mobile Free delivery .png";
import mobilebnimg4 from "@/public/mobile Free delivery 1.png";

const LeafLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="leafbase">
        <div className="lf">
          <div className="leaf1">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf2">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf3">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="tail"></div>
        </div>
      </div>
    </div>
  );
};

const ImageBanner = ({ isMobile }) => {
  // Select banner images based on device type
  const bannerImages = isMobile
    ? [mobilebnimg1, mobilebnimg2, mobilebnimg3, mobilebnimg4]
    : [bnimg1, bnimg2, bnimg3, bnimg4];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <div className="relative w-full h-16 mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {bannerImages.map((image, index) => (
          <div key={index} className="flex-shrink-0 w-full h-full relative">
            <Image
              src={image}
              alt={`Banner ${index + 1}`}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback to a gradient background if image fails to load
                e.target.style.display = 'none';
                e.target.parentElement.style.background = 
                  `linear-gradient(45deg, hsl(var(--primary)) ${index * 25}%, hsl(var(--primary)) ${(index + 1) * 25}%)`;
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white shadow-lg' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      {/* Image counter */}
      <div className="absolute top-2 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
        {currentIndex + 1} / {bannerImages.length}
      </div>
    </div>
  );
};

export function HeroSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Detect mobile device based on window width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's 'sm' breakpoint
    };

    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LeafLoader />}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-2 md:py-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {/* Image Banner */}
              <ImageBanner isMobile={isMobile} />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Fresh Organic <span className="text-primary">Vegetables</span> Delivered to Your Door
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Farm-fresh, certified organic produce harvested at peak ripeness and delivered within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" onClick={(e) => handleNavigation(e, "/products")}>
                  <Button size="lg" className="w-full sm:w-auto">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about" onClick={(e) => handleNavigation(e, "/about")}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">100% Organic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Next Day Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Farm Fresh</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/5 rounded-full"></div>
              <div className="relative rounded-lg overflow-hidden aspect-square">
                <Image
                  src={img}
                  alt="Fresh organic vegetables"
                  width={1000}
                  height={1000}
                  className="object-cover"
                />
              </div>
              <div className="fixed -bottom-0 -right-0 bg-primary/10 rounded-full p-6">
                <div className="bg-background rounded-full p-4 shadow-lg">
                  <div className="text-center">
                    <span className="text-3xl font-bold">24h</span>
                    <p className="text-sm">Farm to Table</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}