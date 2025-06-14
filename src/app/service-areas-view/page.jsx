"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Navigation, Phone, Mail } from "lucide-react"
import { fetchWithoutAuth } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ServiceAreasView() {
  const [serviceAreas, setServiceAreas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchPincode, setSearchPincode] = useState("")
  const [searchResult, setSearchResult] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [nearbyAreas, setNearbyAreas] = useState([])

  const mapRef = useRef(null)
  const googleMapRef = useRef(null)

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) return Promise.resolve()

      return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`
        script.async = true
        script.defer = true
        script.onload = resolve
        document.head.appendChild(script)
      })
    }

    loadGoogleMaps().then(() => {
      initializeMap()
    })
  }, [])

  useEffect(() => {
    fetchServiceAreas()
  }, [])

  const fetchServiceAreas = async () => {
    try {
      setIsLoading(true)
      const data = await fetchWithoutAuth("/api/service-areas?limit=100")
      setServiceAreas(data.serviceAreas.filter((area) => area.isActive))
    } catch (error) {
      console.error("Error fetching service areas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 28.6139, lng: 77.209 }, // Default to Delhi
      zoom: 6,
      mapTypeControl: false,
      streetViewControl: false,
    })

    googleMapRef.current = map

    // Add markers for all service areas
    serviceAreas.forEach((area) => {
      if (area.centerLocation) {
        const marker = new window.google.maps.Marker({
          position: area.centerLocation,
          map: map,
          title: `${area.city}, ${area.state}`,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#22c55e"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24),
          },
        })

        // Add delivery radius circle
        if (area.deliveryRadius) {
          new window.google.maps.Circle({
            strokeColor: "#22c55e",
            strokeOpacity: 0.6,
            strokeWeight: 1,
            fillColor: "#22c55e",
            fillOpacity: 0.1,
            map: map,
            center: area.centerLocation,
            radius: area.deliveryRadius * 1000, // Convert km to meters
          })
        }

        // Info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-bold">${area.city}, ${area.state}</h3>
              <p class="text-sm">Pincode: ${area.pincode}</p>
              <p class="text-sm">Delivery Radius: ${area.deliveryRadius || 5} km</p>
              <p class="text-sm">Est. Time: ${area.estimatedDeliveryTime}</p>
              ${area.deliveryFee > 0 ? `<p class="text-sm">Delivery Fee: ₹${area.deliveryFee}</p>` : '<p class="text-sm text-green-600">Free Delivery</p>'}
            </div>
          `,
        })

        marker.addListener("click", () => {
          infoWindow.open(map, marker)
        })
      }
    })
  }

  const handlePincodeSearch = async () => {
    if (!searchPincode.match(/^\d{5,6}$/)) {
      alert("Please enter a valid 5-6 digit pincode")
      return
    }

    try {
      const response = await fetchWithoutAuth(`/api/service-areas/check?pincode=${searchPincode}`)
      setSearchResult({
        available: true,
        serviceArea: response.serviceArea,
      })
    } catch (error) {
      setSearchResult({
        available: false,
        message: error.message,
      })
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)

          // Check nearby service areas
          try {
            const response = await fetchWithoutAuth(
              `/api/service-areas/nearby?lat=${location.lat}&lng=${location.lng}&radius=50`,
            )
            setNearbyAreas(response.nearbyServiceAreas)
          } catch (error) {
            console.error("Error finding nearby areas:", error)
          }

          // Update map
          if (googleMapRef.current) {
            googleMapRef.current.setCenter(location)
            googleMapRef.current.setZoom(10)

            // Add user location marker
            new window.google.maps.Marker({
              position: location,
              map: googleMapRef.current,
              title: "Your Location",
              icon: {
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#3b82f6"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24),
              },
            })
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          alert("Could not get your location. Please check permissions.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Service Areas</h1>
          <p className="text-gray-600 dark:text-gray-300">Check if we deliver to your location</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search and Info Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pincode Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Check Your Pincode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pincode">Enter Pincode</Label>
                  <div className="flex gap-2">
                    <Input
                      id="pincode"
                      value={searchPincode}
                      onChange={(e) => setSearchPincode(e.target.value)}
                      placeholder="e.g., 110001"
                      pattern="\d{5,6}"
                    />
                    <Button onClick={handlePincodeSearch}>Check</Button>
                  </div>
                </div>

                {searchResult && (
                  <div
                    className={`p-3 rounded-md ${
                      searchResult.available
                        ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                        : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {searchResult.available ? (
                      <div>
                        <p className="font-medium">✅ We deliver to your area!</p>
                        <p className="text-sm mt-1">
                          {searchResult.serviceArea.city}, {searchResult.serviceArea.state}
                        </p>
                        <p className="text-sm">Estimated delivery: {searchResult.serviceArea.estimatedDeliveryTime}</p>
                        {searchResult.serviceArea.deliveryFee > 0 ? (
                          <p className="text-sm">Delivery fee: ₹{searchResult.serviceArea.deliveryFee}</p>
                        ) : (
                          <p className="text-sm">Free delivery</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">❌ Sorry, we don't deliver to this area yet</p>
                        <p className="text-sm mt-1">{searchResult.message}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location-based Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Use Current Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={getCurrentLocation} variant="outline" className="w-full">
                  Find Service Areas Near Me
                </Button>

                {nearbyAreas.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="font-medium">Nearby Service Areas:</p>
                    {nearbyAreas.slice(0, 3).map((area) => (
                      <div key={area.pincode} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        <p className="font-medium">
                          {area.city}, {area.state}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {area.distance} km away • {area.estimatedDeliveryTime}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>+91 1234567890</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>support@greenthicks.com</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Contact us to request service in your area</p>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Service Coverage Map</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Green circles show our交付 areas. Click markers for details.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div ref={mapRef} className="w-full h-96 lg:h-[600px] rounded-b-lg" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Service Areas List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">All Service Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {serviceAreas.map((area) => (
              <Card key={area.pincode} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-semibold">{area.city}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{area.state}</p>
                  <p className="text-sm">Pincode: {area.pincode}</p>
                  <p className="text-sm">Radius: {area.deliveryRadius || 5} km</p>
                  <p className="text-sm">{area.estimatedDeliveryTime}</p>
                  {area.deliveryFee > 0 ? (
                    <p className="text-sm">Fee: ₹{area.deliveryFee}</p>
                  ) : (
                    <p className="text-sm text-green-600">Free delivery</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}