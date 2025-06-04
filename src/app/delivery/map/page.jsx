"use client";

import { useState, useEffect } from "react";
import { DeliveryLayout } from "@/components/delivery-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Truck, Phone, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/lib/fetch-without-auth";
import { Skeleton } from "@/components/ui/skeleton";

// LeafLoader component for button actions
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

export default function DeliveryMapPage() {
  const [loading, setLoading] = useState(true); // For initial page loading
  const [actionLoading, setActionLoading] = useState(false); // For button actions
  const [currentLocation, setCurrentLocation] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    if (loading) return; // Prevent concurrent calls
    try {
      setLoading(true);

      // Fetch current location
      const locationResponse = await fetchWithAuth("/api/delivery-map/current-location");
      if (!locationResponse.success) {
        throw new Error(locationResponse.message || "Failed to fetch current location");
      }
      setCurrentLocation(locationResponse.location);

      // Fetch delivery locations
      const deliveriesResponse = await fetchWithAuth("/api/delivery-map/locations");
      if (!deliveriesResponse.success) {
        throw new Error(deliveriesResponse.message || "Failed to fetch delivery locations");
      }
      setDeliveries(deliveriesResponse.locations);
    } catch (error) {
      console.error("Error loading map data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load map data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShareLocation = async () => {
    try {
      setActionLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            const response = await fetchWithAuth("/api/delivery-map/update-location", {
              method: "POST",
              body: JSON.stringify({
                latitude,
                longitude,
                address: `${latitude}, ${longitude}`,
              }),
            });

            if (!response.success) {
              throw new Error(response.message || "Failed to update location");
            }

            toast({
              title: "Location Shared",
              description: "Your location has been shared with customers",
            });

            setCurrentLocation({
              latitude,
              longitude,
              address: `${latitude}, ${longitude}`,
            });
          },
          (error) => {
            throw new Error(error.message || "Failed to access geolocation");
          }
        );
      } else {
        throw new Error("Geolocation is not supported by this browser");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to share location",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleNavigate = (delivery) => {
    setActionLoading(true);
    const { lat, lng } = delivery;
    window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank");
    setTimeout(() => setActionLoading(false), 1000); // Simulate action completion
  };

  const handleCallCustomer = (delivery) => {
    setActionLoading(true);
    if (delivery.customerPhone) {
      window.open(`tel:${delivery.customerPhone}`, "_self");
    }
    setTimeout(() => setActionLoading(false), 1000); // Simulate action completion
  };

  return (
    <DeliveryLayout>
      {actionLoading && <LeafLoader />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Delivery Map</h1>
        <Button onClick={handleShareLocation} disabled={actionLoading}>
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
                <Skeleton className="h-full w-full rounded-md" />
              ) : (
                <div className="relative h-full w-full bg-gray-200 rounded-md">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                      <p className="font-medium">Map View</p>
                      <p className="text-sm text-muted-foreground">
                        Google Maps integration would show delivery locations here
                      </p>
                      {currentLocation && (
                        <>
                          <p className="text-sm font-medium mt-4">Current Location:</p>
                          <p className="text-sm text-muted-foreground">{currentLocation.address}</p>
                        </>
                      )}
                      <div className="mt-4 text-sm">
                        <p className="font-medium">Active Deliveries: {deliveries.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Today's Deliveries ({deliveries.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array(3).fill().map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-md" />
                  ))}
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
                          <p className="text-sm text-muted-foreground line-clamp-2">{delivery.address}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {delivery.items} items • ₹{delivery.total}
                            </span>
                          </div>
                        </div>
                        <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {delivery.status === "assigned" ? "Assigned" : "In Transit"}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleNavigate(delivery)}
                          disabled={actionLoading}
                        >
                          <Navigation className="mr-1 h-3 w-3" />
                          Navigate
                        </Button>

                        {delivery.customerPhone && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCallCustomer(delivery)}
                            disabled={actionLoading}
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Assigned: {new Date(delivery.orderDate).toLocaleTimeString()}
                      </div>
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