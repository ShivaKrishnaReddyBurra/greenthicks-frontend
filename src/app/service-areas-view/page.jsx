"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Phone, Mail } from "lucide-react";
import { getServiceAreas, checkPincode, getNearbyServiceAreas } from "@/lib/fetch-without-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ServiceAreasView() {
  const [serviceAreas, setServiceAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [searchPincode, setSearchPincode] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyAreas, setNearbyAreas] = useState([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapRef = useRef(null);
  const googleMapRef = useRef(null);

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="animate-pulse">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 space-y-2">
          <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </CardContent>
      </Card>
    </div>
  );

  // Leaf Loader Component for Buttons
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

  useEffect(() => {
    fetchServiceAreas();
  }, []);

  useEffect(() => {
    if (serviceAreas.length > 0 && !isMapLoaded) {
      loadGoogleMaps()
        .then(() => {
          setIsMapLoaded(true);
          setTimeout(() => initializeMap(), 100);
        })
        .catch((error) => {
          console.error("Failed to load Google Maps:", error);
        });
    }
  }, [serviceAreas, isMapLoaded]);

  const loadGoogleMaps = () => {
    if (window.google) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const fetchServiceAreas = async () => {
    try {
      setIsLoading(true);
      const data = await getServiceAreas({ limit: 100, active: true });

      const areas = Array.isArray(data?.serviceAreas) ? data.serviceAreas : [];

      setServiceAreas(
        areas.map((area) => ({
          ...area,
          estimatedDeliveryTime: formatDeliveryTime(area.estimatedDeliveryTime),
        }))
      );
    } catch (error) {
      console.error("Error fetching service areas:", error);
      setServiceAreas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDeliveryTime = (minutes) => {
    if (typeof minutes === "string") return minutes; // Already formatted
    return minutes ? `${Math.max(15, minutes - 5)}-${minutes + 5} minutes` : "30-45 minutes";
  };

  const initializeMap = () => {
    if (!window.google || !mapRef.current || googleMapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 17.9784, lng: 79.5941 }, // Warangal
      zoom: 6,
      mapTypeControl: false,
      streetViewControl: false,
    });

    googleMapRef.current = map;

    serviceAreas.forEach((area) => {
      if (area.centerLocation && area.centerLocation.lat && area.centerLocation.lng) {
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
        });

        if (area.deliveryRadius) {
          new window.google.maps.Circle({
            strokeColor: "#22c55e",
            strokeOpacity: 0.6,
            strokeWeight: 1,
            fillColor: "#22c55e",
            fillOpacity: 0.1,
            map: map,
            center: area.centerLocation,
            radius: area.deliveryRadius * 1000,
          });
        }

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="
              padding: 12px;
              background-color: #ecfdf5;
              border: 1px solid #22c55e;
              color: #065f46;
              border-radius: 8px;
              font-family: sans-serif;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              max-width: 260px;
            ">
              <h3 style="margin: 0 0 6px 0; font-weight: bold; font-size: 16px;">
                ${area.city}, ${area.state}
              </h3>
              <p style="margin: 2px 0; font-size: 14px;">Pincode: ${area.pincode}</p>
              <p style="margin: 2px 0; font-size: 14px;">Delivery Radius: ${area.deliveryRadius || 5} km</p>
              <p style="margin: 2px 0; font-size: 14px;">Est. Time: ${area.estimatedDeliveryTime}</p>
              ${
                area.deliveryFee > 0
                  ? `<p style="margin: 2px 0; font-size: 14px;">Delivery Fee: ₹${area.deliveryFee}</p>`
                  : `<p style="margin: 2px 0; font-size: 14px; color: #15803d;">Free Delivery</p>`
              }
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      }
    });
  };

  const handlePincodeSearch = async () => {
    if (!searchPincode.match(/^\d{5,6}$/)) {
      alert("Please enter a valid 5-6 digit pincode");
      return;
    }

    setIsButtonLoading(true);
    try {
      const response = await checkPincode(searchPincode);
      setSearchResult(response);
      if (response.available && googleMapRef.current && response.serviceArea.centerLocation) {
        googleMapRef.current.setCenter(response.serviceArea.centerLocation);
        googleMapRef.current.setZoom(10);
      }
    } catch (error) {
      setSearchResult({
        available: false,
        message: error.message || "Error checking pincode availability",
      });
    } finally {
      setIsButtonLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      setIsButtonLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);

          try {
            const response = await getNearbyServiceAreas(location.lat, location.lng, 50);
            setNearbyAreas(response.nearbyServiceAreas || []);
          } catch (error) {
            console.error("Error finding nearby areas:", error);
            setNearbyAreas([]);
          }

          if (googleMapRef.current) {
            googleMapRef.current.setCenter(location);
            googleMapRef.current.setZoom(10);

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
            });
          }
          setIsButtonLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Could not get your location. Please check permissions.");
          setIsButtonLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsButtonLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="w-full h-96 lg:h-[600px] bg-gray-200 dark:bg-gray-700 rounded-b-lg animate-pulse"></div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="mt-12">
            <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen leaf-pattern-2 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Service Areas</h1>
          <p className="text-gray-600 dark:text-gray-300">Check if we deliver to your location</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
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
                    <Button onClick={handlePincodeSearch} disabled={isButtonLoading}>
                      {isButtonLoading ? <LeafLoader /> : "Check"}
                    </Button>
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
                        <p className="text-sm">
                          Estimated delivery: {searchResult.serviceArea.estimatedDeliveryTime}
                        </p>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Use Current Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={getCurrentLocation}
                  variant="outline"
                  className="w-full"
                  disabled={isButtonLoading}
                >
                  {isButtonLoading ? <LeafLoader /> : "Find Service Areas Near Me"}
                </Button>

                {nearbyAreas.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="font-medium">Nearby Service Areas:</p>
                    {nearbyAreas.slice(0, 3).map((area) => (
                      <div key={area._id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
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

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>+91 9705045597</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>greenthickss@gmail.com</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Contact us to request service in your area
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Service Coverage Map</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Green circles show our service areas. Click markers for details.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div ref={mapRef} className="w-full h-96 lg:h-[600px] rounded-b-lg relative">
                  {!isMapLoaded && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">All Service Areas</h2>
          {serviceAreas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {serviceAreas.map((area) => (
                <Card key={area._id} className="hover:shadow-md transition-shadow">
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
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No service areas available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}