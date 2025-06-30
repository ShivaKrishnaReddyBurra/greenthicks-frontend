"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryLayout } from "@/components/delivery-layout";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getDeliveryOrders } from "@/lib/api";
import { MapPin } from "lucide-react";

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

const SkeletonLoader = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] sm:h-[600px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const mapContainerStyle = {
  height: "400px",
  width: "100%",
  minHeight: "400px",
  "@media (min-width: 640px)": {
    height: "600px",
  },
};

export default function DeliveryRoutePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const fetchDeliveries = async () => {
    setActionLoading(true);
    try {
      const data = await getDeliveryOrders(1, 10);
      const pending = data.orders.filter((order) => order.deliveryStatus !== "delivered");
      setPendingDeliveries(pending);

      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
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
          }
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch deliveries",
        variant: "destructive",
      });
      if (error.message.includes("Token expired")) {
        setActionLoading(true);
        router.push("/delivery/login");
      }
    } finally {
      setIsLoading(false);
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  useEffect(() => {
    if (userLocation && pendingDeliveries.length > 0) {
      // Optimize route using Google Maps Directions Service
      const directionsService = new google.maps.DirectionsService();
      const waypoints = pendingDeliveries
        .filter((delivery) => delivery.shippingAddress.location?.latitude && delivery.shippingAddress.location?.longitude)
        .sort((a, b) => {
          // Simple distance-based sorting from user location
          const distA = Math.sqrt(
            Math.pow(userLocation.lat - parseFloat(a.shippingAddress.location.latitude), 2) +
            Math.pow(userLocation.lng - parseFloat(a.shippingAddress.location.longitude), 2)
          );
          const distB = Math.sqrt(
            Math.pow(userLocation.lat - parseFloat(b.shippingAddress.location.latitude), 2) +
            Math.pow(userLocation.lng - parseFloat(b.shippingAddress.location.longitude), 2)
          );
          return distA - distB;
        })
        .map((delivery) => ({
          location: new google.maps.LatLng(
            parseFloat(delivery.shippingAddress.location.latitude),
            parseFloat(delivery.shippingAddress.location.longitude)
          ),
          stopover: true,
        }));

      if (waypoints.length > 0) {
        directionsService.route(
          {
            origin: userLocation,
            destination: waypoints[waypoints.length - 1].location,
            waypoints: waypoints.slice(0, -1),
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              setDirections(result);
            } else {
              toast({
                title: "Error",
                description: "Failed to calculate route",
                variant: "destructive",
              });
            }
          }
        );
      }
    }
  }, [userLocation, pendingDeliveries]);

  const defaultCenter = userLocation || { lat: 17.9784, lng: 79.5941 };

  return (
    <>
      {actionLoading && <LeafLoader />}
      <DeliveryLayout>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Optimized Delivery Route</CardTitle>
              </CardHeader>
              <CardContent>
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={defaultCenter}
                    zoom={12}
                  >
                    {userLocation && (
                      <Marker
                        position={userLocation}
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        }}
                        title="Your Location"
                      />
                    )}
                    {pendingDeliveries.map((delivery, index) => (
                      delivery.shippingAddress.location?.latitude && delivery.shippingAddress.location?.longitude && (
                        <Marker
                          key={delivery.globalId}
                          position={{
                            lat: parseFloat(delivery.shippingAddress.location.latitude),
                            lng: parseFloat(delivery.shippingAddress.location.longitude),
                          }}
                          title={`${delivery.shippingAddress.firstName} ${delivery.shippingAddress.lastName}`}
                          label={(index + 1).toString()}
                        />
                      )
                    ))}
                    {directions && <DirectionsRenderer directions={directions} />}
                  </GoogleMap>
                </LoadScript>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Stops</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingDeliveries
                    .filter((delivery) => delivery.shippingAddress.location?.latitude && delivery.shippingAddress.location?.longitude)
                    .sort((a, b) => {
                      if (!userLocation) return 0;
                      const distA = Math.sqrt(
                        Math.pow(userLocation.lat - parseFloat(a.shippingAddress.location.latitude), 2) +
                        Math.pow(userLocation.lng - parseFloat(a.shippingAddress.location.longitude), 2)
                      );
                      const distB = Math.sqrt(
                        Math.pow(userLocation.lat - parseFloat(b.shippingAddress.location.latitude), 2) +
                        Math.pow(userLocation.lng - parseFloat(b.shippingAddress.location.longitude), 2)
                      );
                      return distA - distB;
                    })
                    .map((delivery, index) => (
                      <div key={delivery.globalId} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm sm:text-base">
                              Stop {index + 1}: {delivery.shippingAddress.firstName} {delivery.shippingAddress.lastName}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {delivery.shippingAddress.address}, {delivery.shippingAddress.city}, {delivery.shippingAddress.state}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{delivery.items.length} items</span>
                            <span>₹{delivery.total}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                  {pendingDeliveries.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No pending deliveries</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DeliveryLayout>
    </>
  );
}