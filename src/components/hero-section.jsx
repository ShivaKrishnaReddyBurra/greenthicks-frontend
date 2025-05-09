import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import img from "@/public/hero.jpg";  

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Fresh Organic <span className="text-primary">Vegetables</span> Delivered to Your Door
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Farm-fresh, certified organic produce harvested at peak ripeness and delivered within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
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
                width={1200}
                height={1200}
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
  );
}
