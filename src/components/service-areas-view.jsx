"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Phone, Mail } from "lucide-react";
import { getServiceAreas, checkPincode, getNearbyServiceAreas } from "@/lib/fetch-without-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useGoogleMaps } from "@/lib/google-maps-loader";

export default function ServiceAreasView() {
  const { toast } = useToast();
  const [serviceAreas, setServiceAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchPincode, setSearchPincode] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyAreas, setNearbyAreas] = useState([]);
  const [mapError, setMapError] = useState(null);

  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]); // Store markers for cleanup

  // Use Google Maps hook
  const { isLoaded: isMapLoaded, error: googleMapsError, retry: retryGoogleMaps } = useGoogleMaps(["places", "geometry"]);

  // Fetch service areas on mount
  useEffect(() => {
    fetchServiceAreas();
  }, []);

  // Handle Google Maps loading errors
  useEffect(() => {
    if (googleMapsError) {
      setMapError(googleMapsError);
      toast({
        title: "Map Error",
        description: googleMapsError,
        variant: "destructive",
      });
    }
  }, [googleMapsError, toast]);

  // Initialize map when loaded
  useEffect(() => {
    if (isMapLoaded && !googleMapRef.current && !mapError) {
      setTimeout(() => initializeMap(), 500); // Delay for DOM stability
    }
  }, [isMapLoaded, mapError]);

  // Update map markers when serviceAreas, isMapLoaded, or userLocation change
  useEffect(() => {
    if (googleMapRef.current && isMapLoaded && serviceAreas.length > 0) {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // Add markers for service areas
      serviceAreas.forEach((area) => {
        if (area.centerLocation?.lat && area.centerLocation?.lng) {
          const marker = new window.google.maps.Marker({
            position: area.centerLocation,
            map: googleMapRef.current,
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

          // Add delivery radius circle
          if (area.deliveryRadius) {
            const circle = new window.google.maps.Circle({
              strokeColor: "#22c55e",
              strokeOpacity: 0.6,
              strokeWeight: 1,
              fillColor: "#22c55e",
              fillOpacity: 0.1,
              map: googleMapRef.current,
              center: area.centerLocation,
              radius: area.deliveryRadius * 1000, // Convert km to meters
            });
            markersRef.current.push(circle); // Track circle for cleanup
          }

          // Info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold">${area.city}, ${area.state}</h3>
                <p class="text-sm">Pincode: ${area.pincode}</p>
                <p class="text-sm">Delivery Radius: ${area.deliveryRadius || 5} km</p>
                <p class="text-sm">Est. Time: ${area.estimatedDeliveryTime}</p>
                ${
                  area.deliveryFee > 0
                    ? `<p class="text-sm">Delivery Fee: ₹${area.deliveryFee}</p>`
                    : '<p class="text-sm text-green-600">Free Delivery</p>'
                }
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(googleMapRef.current, marker);
          });

          markersRef.current.push(marker);
        }
      });

      // Add user location marker if available
      if (userLocation) {
        const userMarker = new window.google.maps.Marker({
          position: userLocation,
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
        markersRef.current.push(userMarker);
      }
    }
  }, [serviceAreas, isMapLoaded, userLocation]);

  const fetchServiceAreas = async () => {
    try {
      setIsLoading(true);
      const data = await getServiceAreas({ limit: 100 });
      if (!data.serviceAreas || !Array.isArray(data.serviceAreas)) {
        throw new Error("Invalid service areas response format.");
      }
      setServiceAreas(data.serviceAreas.filter((area) => area.isActive));
    } catch (error) {
      console.error("Error fetching service areas:", error.message);
      toast({
        title: "Error",
        description: "Failed to load service areas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeMap = () => {
    if (!window.google || !mapRef.current || googleMapRef.current) {
      console.warn("Map initialization skipped: Google Maps not loaded or map already initialized.");
      return;
    }
    if (!mapRef.current.offsetHeight) {
      console.warn("Map container has no height. Check CSS.");
      setMapError("Map container is not visible.");
      return;
    }

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.209 }, // Default to Delhi
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
      });
      googleMapRef.current = map;
      window.google.maps.event.trigger(map, "resize"); // Ensure map renders correctly
    } catch (error) {
      setMapError("Failed to initialize map.");
      console.error("Map initialization error:", error);
      toast({
        title: "Map Error",
        description: "Failed to initialize the map. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePincodeSearch = async () => {
    if (!searchPincode.match(/^\d{5,6}$/)) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 5-6 digit pincode.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await checkPincode(searchPincode);
      setSearchResult({
        available: true,
        serviceArea: response.serviceArea,
      });
      toast({
        title: "Service Available",
        description: `We deliver to ${response.serviceArea.city}, ${response.serviceArea.state}!`,
      });

      // Center map on the found service area
      if (googleMapRef.current && response.serviceArea.centerLocation) {
        googleMapRef.current.setCenter(response.serviceArea.centerLocation);
        googleMapRef.current.setZoom(10);
      }
    } catch (error) {
      setSearchResult({
        available: false,
        message: error.message || "Service not available for this pincode.",
      });
      toast({
        title: "Service Unavailable",
        description: error.message || "We don't deliver to this pincode yet.",
        variant: "destructive",
      });
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Unavailable",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);

        try {
          const response = await getNearbyServiceAreas(location.lat, location.lng, 50);
          setNearbyAreas(response.nearbyServiceAreas);
          if (response.nearbyServiceAreas.length > 0) {
            toast({
              title: "Nearby Areas Found",
              description: `Found ${response.nearbyServiceAreas.length} service areas near your location.`,
            });
          } else {
            toast({
              title: "No Nearby Areas",
              description: "No service areas found within 50km of your location.",
              variant: "destructive",
            });
          }

          // Update map
          if (googleMapRef.current) {
            googleMapRef.current.setCenter(location);
            googleMapRef.current.setZoom(10);
          }
        } catch (error) {
          console.error("Error finding nearby areas:", error);
          toast({
            title: "Error",
            description: "Failed to find nearby service areas.",
            variant: "destructive",
          });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location Error",
          description: "Could not get your location. Please check permissions.",
          variant: "destructive",
        });
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (serviceAreas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-lg font-medium">No Service Areas Available</h3>
          <p className="text-gray-600">Please try again later or contact support.</p>
        </div>
      </div>
    );
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
                          ${searchResult.serviceArea.city}, ${searchResult.serviceArea.state}
                        </p>
                        <p className="text-sm">Estimated delivery: ${searchResult.serviceArea.estimatedDeliveryTime}</p>
                        {searchResult.serviceArea.deliveryFee > 0 ? (
                          <p className="text-sm">Delivery fee: ₹${searchResult.serviceArea.deliveryFee}</p>
                        ) : (
                          <p className="text-sm">Free delivery</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">❌ Sorry, we don't deliver to this area yet</p>
                        <p className="text-sm mt-1">${searchResult.message}</p>
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
                          ${area.city}, ${area.state}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          ${area.distance} km away • ${area.estimatedDeliveryTime}
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

            {/* Debug Retry Button (Optional) */}
            {mapError && (
              <Button onClick={retryGoogleMaps} variant="outline" className="w-full">
                Retry Loading Map
              </Button>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Service Coverage Map</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Green circles show our delivery areas. Click markers for details.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                {mapError || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                  <div className="w-full h-96 lg:h-[600px] rounded-b-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Map Unavailable</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        ${mapError || "Interactive map is currently unavailable. Please use the search function above to check service areas."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div ref={mapRef} className="w-full h-96 lg:h-[600px] min-h-full rounded-b-lg relative">
                    {!isMapLoaded && (
                      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                )}
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
                  <h3 className="font-semibold">${area.city}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">${area.state}</p>
                  <p className="text-sm">Pincode: ${area.pincode}</p>
                  <p className="text-sm">Radius: ${area.deliveryRadius || 5} km</p>
                  <p className="text-sm">${area.estimatedDeliveryTime}</p>
                  {area.deliveryFee > 0 ? (
                    <p className="text-sm">Fee: ₹${area.deliveryFee}</p>
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
  );
}