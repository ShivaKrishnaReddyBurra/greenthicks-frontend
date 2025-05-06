"use client"

import { useState, useEffect } from "react"
import { DeliveryLayout } from "@/components/delivery-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Truck } from "lucide-react"

export default function DeliveryMapPage() {
  const [loading, setLoading] = useState(true)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [deliveries, setDeliveries] = useState([])

  useEffect(() => {
    // Simulate loading map data
    const loadMapData = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock current location
        setCurrentLocation({
          lat: 17.385,
          lng: 78.4867,
          address: "Hyderabad, Telangana, India",
        })

        // Mock delivery locations
        setDeliveries([
          {
            id: "ORD-7652",
            customer: "Rahul Sharma",
            address: "123 Main St, Hyderabad, 500001",
            lat: 17.385,
            lng: 78.4867,
            status: "in_transit",
          },
          {
            id: "ORD-7653",
            customer: "Priya Patel",
            address: "456 Oak St, Hyderabad, 500002",
            lat: 17.395,
            lng: 78.4967,
            status: "assigned",
          },
          {
            id: "ORD-7654",
            customer: "Amit Kumar",
            address: "789 Pine St, Hyderabad, 500003",
            lat: 17.375,
            lng: 78.4767,
            status: "assigned",
          },
        ])
      } catch (error) {
        console.error("Error loading map data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMapData()
  }, [])

  const handleShareLocation = () => {
    // In a real app, this would update the location in the backend
    alert("Your location has been shared with the customer")
  }

  const handleNavigate = (delivery) => {
    // In a real app, this would open navigation in a maps app
    window.open(`https://maps.google.com/?q=${delivery.lat},${delivery.lng}`, "_blank")
  }

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
                <div className="relative h-full w-full bg-gray-200 rounded-md">
                  {/* In a real app, this would be a Google Maps or Mapbox component */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                      <p className="font-medium">Map View</p>
                      <p className="text-sm text-muted-foreground">
                        In a real app, this would show a Google Maps or Mapbox map with delivery locations
                      </p>
                      <p className="text-sm font-medium mt-4">Current Location:</p>
                      <p className="text-sm text-muted-foreground">{currentLocation?.address}</p>
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
  )
}
