"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { getBannerImages } from "@/lib/api"
import img from "@/public/hero.jpg"

// LeafLoader component (used only for button actions)
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
  )
}

// Skeleton Loader component for HeroSection
const SkeletonLoader = () => {
  return (
    <div className="container mx-auto px-4 py-2 md:py-10 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          {/* Skeleton for ImageBanner */}
          <div className="w-full h-16 bg-gray-200 rounded-lg"></div>
          {/* Skeleton for heading */}
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          {/* Skeleton for paragraph */}
          <div className="h-6 bg-gray-200 rounded w-5/6"></div>
          <div className="h-6 bg-gray-200 rounded w-4/6"></div>
          {/* Skeleton for buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-12 bg-gray-200 rounded w-32"></div>
            <div className="h-12 bg-gray-200 rounded w-32"></div>
          </div>
          {/* Skeleton for feature list */}
          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
        <div className="relative">
          {/* Skeleton for image */}
          <div className="bg-gray-200 rounded-lg aspect-square"></div>
          {/* Skeleton for badge */}
          <div className="fixed -bottom-0 -right-0 bg-gray-200 rounded-full p-6">
            <div className="bg-gray-300 rounded-full p-4">
              <div className="text-center">
                <div className="h-8 bg-gray-200 rounded w-12 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced ImageBanner component with backend integration and swipe functionality
const ImageBanner = ({ isMobile }) => {
  const [bannerImages, setBannerImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Fetch banner images from backend
  useEffect(() => {
    const fetchBannerImages = async () => {
      try {
        setIsLoading(true)
        const response = await getBannerImages(isMobile ? "mobile" : "desktop")
        setBannerImages(response.images || [])
        setError(null)
      } catch (err) {
        console.error("Failed to fetch banner images:", err)
        setError("Failed to load banner images")
        // Fallback to empty array
        setBannerImages([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchBannerImages()
  }, [isMobile])

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || bannerImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [bannerImages.length, isAutoPlaying])

  // Touch handlers for swipe functionality
  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsAutoPlaying(false)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }

    // Resume auto-play after 3 seconds
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  // Mouse handlers for desktop swipe
  const onMouseDown = (e) => {
    setTouchEnd(null)
    setTouchStart(e.clientX)
    setIsAutoPlaying(false)
  }

  const onMouseMove = (e) => {
    if (touchStart === null) return
    setTouchEnd(e.clientX)
  }

  const onMouseUp = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }

    setTouchStart(null)
    setTouchEnd(null)

    // Resume auto-play after 3 seconds
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1))
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 3000)
  }

  if (isLoading) {
    return (
      <div className="relative w-full h-16 mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 animate-pulse">
        <div className="w-full h-full bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  if (error || bannerImages.length === 0) {
    return (
      <div className="relative w-full h-16 mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">{error || "No banner images available"}</p>
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-16 mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 cursor-grab active:cursor-grabbing select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {bannerImages.map((image, index) => (
          <div key={image._id || index} className="flex-shrink-0 w-full h-full relative">
            <Image
              src={image.imageUrl || "/placeholder.svg"}
              alt={image.altText || `Banner ${index + 1}`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0}
              onError={(e) => {
                e.target.style.display = "none"
                e.target.parentElement.style.background = `linear-gradient(45deg, hsl(var(--primary)) ${index * 25}%, hsl(var(--primary)) ${(index + 1) * 25}%)`
              }}
            />
            {image.link && (
              <Link
                href={image.link}
                className="absolute inset-0 z-10"
                aria-label={`Go to ${image.altText || "banner link"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {bannerImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-all duration-200 z-20"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-all duration-200 z-20"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {bannerImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white shadow-lg" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {bannerImages.length > 1 && (
        <div className="absolute top-2 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {bannerImages.length}
        </div>
      )}

      {/* Auto-play indicator */}
      <div className="absolute top-2 left-3 flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-green-400" : "bg-gray-400"}`}></div>
        <span className="text-xs text-white/70">{isAutoPlaying ? "Auto" : "Manual"}</span>
      </div>
    </div>
  )
}

export function HeroSection() {
  const [isLoading, setIsLoading] = useState(false) // For button actions
  const [isContentLoading, setIsContentLoading] = useState(true) // For page content
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  // Simulate content loading (replace with actual data fetching if needed)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoading(false)
    }, 1000) // Reduced loading time

    return () => clearTimeout(timer)
  }, [])

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleNavigation = async (e, href) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate async action
    router.push(href)
    setIsLoading(false)
  }

  if (isContentLoading) {
    return <SkeletonLoader />
  }

  return (
    <>
      {isLoading && <LeafLoader />}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-2 md:py-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
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
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
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
              <div className="absolute -inset-4 bg-primary/5 mt-0 rounded-full"></div>
              <div className="relative rounded-lg overflow-hidden aspect-square">
                <Image
                  src={img || "/placeholder.svg"}
                  alt="Fresh organic vegetables"
                  width={1000}
                  height={1000}
                  className="object-cover rounded-lg mt-20"
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
  )
}
