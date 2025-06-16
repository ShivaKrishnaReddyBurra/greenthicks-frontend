"use client";

import { useState, useEffect } from "react";
import { DeliveryLayout } from "@/components/delivery-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { getDeliveryLocations, getCurrentLocation, updateDeliveryLocation } from "@/lib/fetch-without-auth";

const mapContainerStyle = {
  height: "600px",
  width: "100%",
};

export default function DeliveryMapPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Geocode address if coordinates are missing
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
      return null;
    } catch (error) {
      toast({ title: "Error", description: "Failed to geocode address", variant: "destructive" });
      return null;
    }
  };

  useEffect(() => {
    const loadMapData = async () => {
      setLoading(true);
      try {
        // Fetch current location
        const locationData = await getCurrentLocation();
        let updatedLocation = { ...locationData };

        if (!locationData.latitude || !locationData.longitude) {
          const coords = await geocodeAddress(locationData.address || "Hyderabad, Telangana, India");
          updatedLocation = {
            ...locationData,
            latitude: coords?.lat || 17.385,
            longitude: coords?.lng || 78.4867,
          };
        }
        setCurrentLocation(updatedLocation);

        // Fetch delivery locations
        const deliveryData = await getDeliveryLocations();
        const updatedDeliveries = await Promise.all(
          deliveryData.map(async (delivery) => {
            if (!delivery.lat || !delivery.lng) {
              const address = `${delivery.address}, ${delivery.city}, ${delivery.state}, ${delivery.zipCode}`;
              const coords = await geocodeAddress(address);
              return {
                ...delivery,
                lat: coords?.lat || 17.385,
                lng: coords?.lng || 78.4867,
              };
            }
            return delivery;
          })
        );
        setDeliveries(updatedDeliveries);
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        if (error.message.includes("Session expired")) {
          window.location.href = "/delivery/login";
        }
      } finally {
        setLoading(false);
      }
    };

    loadMapData();
  }, [toast]);

  const handleShareLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            const address = data.results[0]?.formatted_address || "Unknown address";

            await updateDeliveryLocation(latitude, longitude, address);
            setCurrentLocation({ lat: latitude, lng: longitude, address });
            toast({ title: "Success", description: "Your location has been shared with the customer" });
          },
          (error) => {
            toast({ title: "Error", description: "Failed to get current location", variant: "destructive" });
          }
        );
      } else {
        toast({ title: "Error", description: "Geolocation is not supported by this browser", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleNavigate = (delivery) => {
    window.open(`https://maps.google.com/?q=${delivery.lat},${delivery.lng}`, "_blank");
  };

  return (
    <DeliveryLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Delivery Map</h1>
        <Button onClick={handleShareLocation}>
          <MapPin className="mr-2 h-4 w-4" />
          Share My Location
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>Live Map</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={currentLocation ? { lat: currentLocation.lat, lng: currentLocation.lng } : { lat: 17.385, lng: 78.4867 }}
                    zoom={12}
                    options={{
                      styles: [
                        {
                          featureType: "poi",
                          elementType: "labels",
                          stylers: [{ visibility: "off" }],
                        },
                      ],
                    }}
                  >
                    {/* Current Location Marker */}
                    {currentLocation && (
                      <Marker
                        position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                        title="Your Location"
                        icon={{
                          url:
                            "data:image/svg+xml;charset=UTF-8," +
                            encodeURIComponent(`
                              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 2C10.48 2 6 6.48 6 12c0 7.5 10 18 10 18s10-10.5 10-18c0-5.52-4.48-10-10-10z" fill="#3b82f6" stroke="white" strokeWidth="2"/>
                                <circle cx="16" cy="12" r="4" fill="white"/>
                              </svg>
                            `),
                          scaledSize: { width: 32, height: 32 },
                        }}
                        onClick={() => setSelectedMarker("current")}
                      />
                    )}
                    {selectedMarker === "current" && currentLocation && (
                      <InfoWindow
                        position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                        onCloseClick={() => setSelectedMarker(null)}
                      >
                        <div className="p-2">
                          <h3 className="font-bold">Your Location</h3>
                          <p className="text-sm text-gray-600">{currentLocation.address}</p>
                        </div>
                      </InfoWindow>
                    )}

                    {/* Delivery Markers */}
                    {deliveries.map((delivery) => (
                      <Marker
                        key={delivery.id}
                        position={{ lat: delivery.lat, lng: delivery.lng }}
                        title={delivery.customer}
                        icon={{
                          url:
                            "data:image/svg+xml;charset=UTF-8," +
                            encodeURIComponent(`
                              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 2C10.48 2 6 6.48 6 12c0 7.5 10 18 10 18s10-10.5 10-18c0-5.52-4.48-10-10-10z" fill="#dc2626" stroke="white" strokeWidth="2"/>
                                <circle cx="16" cy="12" r="4" fill="white"/>
                              </svg>
                            `),
                          scaledSize: { width: 32, height: 32 },
                        }}
                        onClick={() => setSelectedMarker(delivery.id)}
                      />
                    ))}
                    {deliveries.map((delivery) => (
                      selectedMarker === delivery.id && (
                        <InfoWindow
                          key={delivery.id}
                          position={{ lat: delivery.lat, lng: delivery.lng }}
                          onCloseClick={() => setSelectedMarker(null)}
                        >
                          <div className="p-2">
                            <h3 className="font-bold">{delivery.customer}</h3>
                            <p className="text-sm text-gray-600">{delivery.address}</p>
                            <p className="text-sm"><strong>Order:</strong> #{delivery.id}</p>
                            <p className="text-sm"><strong>Status:</strong> {delivery.status.replace("_", " ")}</p>
                          </div>
                        </InfoWindow>
                      )
                    ))}
                  </GoogleMap>
                </LoadScript>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Today's Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : deliveries.length === 0 ? (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No deliveries assigned for today</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deliveries.map((delivery) => (
                    <div key={delivery.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{delivery.customer}</p>
                          <p className="text-sm text-muted-foreground">{delivery.address}</p>
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            delivery.status === "assigned" ? "bg-blue-100 text-blue-500" : "bg-green-100 text-green-500"
                          }`}
                        >
                          {delivery.status === "delivered" ? "Delivered" : delivery.status.replace("_", " ")}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-2"
                        onClick={() => handleNavigate(delivery)}
                      >
                        <Navigation className="ml-2 r-4 w-4" />
                        Navigate
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DeliveryLayout>
  );
}