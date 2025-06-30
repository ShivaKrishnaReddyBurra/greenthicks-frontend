"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DeliveryLayout } from "@/components/delivery-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Truck } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useToast } from "@/hooks/use-toast";
import { getDeliveryOrders, getUserProfile } from "@/lib/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function DeliveryMapPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 17.385, lng: 78.4867 });
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    console.log("API Key:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
    const loadMapData = async () => {
      try {
        // Fetch user profile to get current location
        const userProfile = await getUserProfile();
        
        // Fetch delivery orders
        const deliveryData = await getDeliveryOrders(1, 10);
        const pendingDeliveries = deliveryData.orders.filter(
          (order) => order.deliveryStatus !== "delivered"
        );

        // Set current location from geolocation or user profile
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCurrentLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                address: userProfile.address || "Current Location",
              });
              setMapCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            (error) => {
              toast({
                title: "Error",
                description: "Failed to get current location",
                variant: "destructive",
              });
              // Fallback to default or profile-based location
              setCurrentLocation({
                lat: userProfile.location?.latitude || 17.385,
                lng: userProfile.location?.longitude || 78.4867,
                address: userProfile.address || "Hyderabad, Telangana, India",
              });
              setMapCenter({
                lat: userProfile.location?.latitude || 17.385,
                lng: userProfile.location?.longitude || 78.4867,
              });
            }
          );
        } else {
          setCurrentLocation({
            lat: userProfile.location?.latitude || 17.385,
            lng: userProfile.location?.longitude || 78.4867,
            address: userProfile.address || "Hyderabad, Telangana, India",
          });
          setMapCenter({
            lat: userProfile.location?.latitude || 17.385,
            lng: userProfile.location?.longitude || 78.4867,
          });
        }

        // Transform deliveries to match the expected format
        const formattedDeliveries = pendingDeliveries.map((order) => ({
          id: order.globalId,
          customer: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
          address: `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}`,
          lat: parseFloat(order.shippingAddress.location?.latitude) || 17.385,
          lng: parseFloat(order.shippingAddress.location?.longitude) || 78.4867,
          status: order.deliveryStatus,
        }));

        setDeliveries(formattedDeliveries);
      } catch (error) {
        console.error("Error loading map data:", error);
        setMapError(error.message || "Failed to load map data");
        if (error.message.includes("Token expired")) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push("/delivery/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadMapData();
  }, [router, toast]);

  const handleShareLocation = () => {
    if (currentLocation) {
      toast({
        title: "Success",
        description: "Your location has been shared with the customer",
      });
    } else {
      toast({
        title: "Error",
        description: "Current location not available",
        variant: "destructive",
      });
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
            <CardContent className="h-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : mapError ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500">Error: {mapError}</p>
                </div>
              ) : !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500">Error: Google Maps API key is missing</p>
                </div>
              ) : (
                <div className="map-container h-full" style={{ backgroundColor: "#f0f0f0" }}>
                  <LoadScript
                    googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    onLoad={() => console.log("Google Maps script loaded")}
                    onError={(e) => {
                      console.error("Google Maps script failed to load:", e);
                      setMapError("Failed to load Google Maps script");
                    }}
                  >
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapCenter}
                      zoom={12}
                      onLoad={() => console.log("Map rendered successfully")}
                      onError={(e) => console.error("Map rendering error:", e)}
                    >
                      {currentLocation && (
                        <Marker
                          position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                          icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                          }}
                          title="Your Location"
                        />
                      )}
                      {deliveries.map((delivery) => (
                        <Marker
                          key={delivery.id}
                          position={{ lat: delivery.lat, lng: delivery.lng }}
                          title={delivery.customer}
                          label={delivery.customer[0]}
                        />
                      ))}
                    </GoogleMap>
                  </LoadScript>
                </div>
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
                        <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {delivery.status === "assigned" ? "Assigned" : "In Transit"}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleNavigate(delivery)}
                      >
                        <Navigation className="mr-2 h-4 w-4" />
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