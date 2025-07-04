"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import logo from "@/public/logo.png";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="space-y-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
};

export default function Footer() {
  const { theme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Subscription submitted");
    setIsLoading(false);
  };

  const handleNavigation = async (e, href) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <SkeletonLoader />}
      <footer className="bg-muted/40 border-t">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <Link
                href="/"
                onClick={(e) => handleNavigation(e, "/")}
                className="inline-block mb-4"
              >
                <Image
                  src={logo}
                  alt="Green Thicks Logo"
                  width={150}
                  height={75}
                  className="h-10 w-auto sm:h-12"
                />
              </Link>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Delivering fresh, certified organic vegetables from farm to table.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="https://facebook.com/greenthickss"
                  onClick={(e) => handleNavigation(e, "https://facebook.com/greenthickss")}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="https://www.instagram.com/greenthickss"
                  onClick={(e) => handleNavigation(e, "https://www.instagram.com/greenthickss")}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="https://twitter.com/greenthickss"
                  onClick={(e) => handleNavigation(e, "https://twitter.com/greenthickss")}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="https://youtube.com/@greenthickss"
                  onClick={(e) => handleNavigation(e, "https://youtube.com/@greenthickss")}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">YouTube</span>
                </Link>
                <Link
                  href="https://wa.me/9705045597"
                  onClick={(e) => handleNavigation(e, "https://wa.me/9705045597")}
                  className="text-muted-foreground hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">WhatsApp</span>
                </Link>
                <Link
                  href="https://t.me/greenthicks"
                  onClick={(e) => handleNavigation(e, "https://t.me/greenthicks")}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Telegram</span>
                </Link>
              </div>
            </div>
{/*
            <div>
              <h3 className="font-medium text-base sm:text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  <Link
                    href="/"
                    onClick={(e) => handleNavigation(e, "/")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    onClick={(e) => handleNavigation(e, "/products")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    onClick={(e) => handleNavigation(e, "/about")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    onClick={(e) => handleNavigation(e, "/contact")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-orders"
                    onClick={(e) => handleNavigation(e, "/my-orders")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link
                    href="/delivery/login"
                    onClick={(e) => handleNavigation(e, "/delivery/login")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Delivery Partner
                  </Link>
                </li>
              </ul>
            </div>
*/}
            <div>
              <h3 className="font-medium text-base sm:text-lg mb-4">GreenThicks Tech</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  <Link
                    href="https://greenthicks.tech"
                    onClick={(e) => handleNavigation(e, "https://greenthicks.tech")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    IntenShip Platform
                  </Link>
                </li>
                <li>
                  <Link
                    href="google.com"
                    onClick={(e) => handleNavigation(e, "google.com")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Intenship registeration Form
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    onClick={(e) => handleNavigation(e, "https://careers.greenthicks.live")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Inten verification
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-base sm:text-lg mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  <Link
                    href="/faq"
                    onClick={(e) => handleNavigation(e, "/faq")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    onClick={(e) => handleNavigation(e, "/shipping")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    onClick={(e) => handleNavigation(e, "/returns")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    onClick={(e) => handleNavigation(e, "/privacy")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    onClick={(e) => handleNavigation(e, "/terms")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    onClick={(e) => handleNavigation(e, "/login")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-base sm:text-lg mb-4">Newsletter</h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Subscribe to receive updates, access to exclusive deals, and more.
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Input placeholder="Your email" type="email" className="text-sm sm:text-base" />
                <Button onClick={handleSubscribe} className="text-sm sm:text-base">
                  Subscribe
                </Button>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm sm:text-base">
                    Hanamkonda, Warangal, Telangana, India
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="text-muted-foreground text-sm sm:text-base">
                    +91 9705045597
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="text-muted-foreground text-sm sm:text-base">
                    greenthickss@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 sm:mt-12 pt-6 text-center text-muted-foreground">
            <p className="text-sm sm:text-base">
              © {new Date().getFullYear()} Green Thicks. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}