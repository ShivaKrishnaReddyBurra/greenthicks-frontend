"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Route, Clock, Truck, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useGoogleMaps } from "@/lib/google-maps-loader"

const DeliveryRouteMap = ({ deliveries = [], currentLocation = null, onRouteOptimized = null }) => {
  const [map, setMap] = useState(null)
  const [directionsService, setDirectionsService] = useState(null)
  const [directionsRenderer, setDirectionsRenderer] = useState(null)
  const [optimizedRoute, setOptimizedRoute] = useState([])
  const [routeInfo, setRouteInfo] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const { toast } = useToast()

  const {
    isLoaded: isMapLoaded,
    error: googleMapsError,
    isLoading: isMapLoading,
  } = useGoogleMaps(["places", "geometry"])

  // Initialize map
  useEffect(() => {
    if (isMapLoaded && mapRef.current && !map) {
      initializeMap()
    }
  }, [isMapLoaded, map])

  // Update markers when deliveries change
  useEffect(() => {
    if (map && deliveries.length > 0) {
      updateMapMarkers()
    }
  }, [map, deliveries, currentLocation])

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return

    const center = currentLocation || { lat: 28.6139, lng: 77.209 }

    const newMap = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 12,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    })

    const newDirectionsService = new window.google.maps.DirectionsService()
    const newDirectionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#2563eb",
        strokeWeight: 4,
      },
    })

    newDirectionsRenderer.setMap(newMap)

    setMap(newMap)
    setDirectionsService(newDirectionsService)
    setDirectionsRenderer(newDirectionsRenderer)
  }

  const updateMapMarkers = () => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    if (!map) return

    // Add current location marker
    if (currentLocation) {
      const currentMarker = new window.google.maps.Marker({
        position: currentLocation,
        map: map,
        title: "Your Location",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#22c55e" stroke="white" strokeWidth="3"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
        },
      })
      markersRef.current.push(currentMarker)
    }

    // Add delivery markers
    deliveries.forEach((delivery, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: delivery.lat, lng: delivery.lng },
        map: map,
        title: `${delivery.customer} - Order #${delivery.orderId}`,
        label: {
          text: (index + 1).toString(),
          color: "white",
          fontWeight: "bold",
        },
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C10.48 2 6 6.48 6 12c0 7.5 10 18 10 18s10-10.5 10-18c0-5.52-4.48-10-10-10z" fill="#dc2626" stroke="white" strokeWidth="2"/>
              <circle cx="16" cy="12" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
        },
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold">${delivery.customer}</h3>
            <p class="text-sm text-gray-600">${delivery.address}</p>
            <p class="text-sm"><strong>Items:</strong> ${delivery.items}</p>
            <p class="text-sm"><strong>Total:</strong> ₹${delivery.total}</p>
            <p class="text-sm"><strong>Status:</strong> ${delivery.status}</p>
          </div>
        `,
      })

      marker.addListener("click", () => {
        infoWindow.open(map, marker)
      })

      markersRef.current.push(marker)
    })

    // Fit map to show all markers
    if (markersRef.current.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      markersRef.current.forEach((marker) => {
        bounds.extend(marker.getPosition())
      })
      map.fitBounds(bounds)
    }
  }

  const calculateOptimalRoute = async () => {
    if (!directionsService || !currentLocation || deliveries.length === 0) {
      toast({
        title: "Cannot Calculate Route",
        description: "Current location or deliveries not available",
        variant: "destructive",
      })
      return
    }

    setIsCalculating(true)

    try {
      // Calculate distances from current location to all deliveries
      const distanceMatrix = await calculateDistanceMatrix()

      // Optimize route using nearest neighbor algorithm
      const optimized = optimizeRoute(distanceMatrix)

      // Display the optimized route
      await displayOptimizedRoute(optimized)

      setOptimizedRoute(optimized)

      if (onRouteOptimized) {
        onRouteOptimized(optimized)
      }

      toast({
        title: "Route Optimized",
        description: `Best route calculated for ${deliveries.length} deliveries`,
      })
    } catch (error) {
      console.error("Route optimization error:", error)
      toast({
        title: "Route Calculation Failed",
        description: error.message || "Failed to calculate optimal route",
        variant: "destructive",
      })
    } finally {
      setIsCalculating(false)
    }
  }

  const calculateDistanceMatrix = async () => {
    return new Promise((resolve, reject) => {
      const service = new window.google.maps.DistanceMatrixService()

      const origins = [currentLocation, ...deliveries.map((d) => ({ lat: d.lat, lng: d.lng }))]
      const destinations = deliveries.map((d) => ({ lat: d.lat, lng: d.lng }))

      service.getDistanceMatrix(
        {
          origins: origins,
          destinations: destinations,
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        },
        (response, status) => {
          if (status === "OK") {
            resolve(response)
          } else {
            reject(new Error(`Distance Matrix API error: ${status}`))
          }
        },
      )
    })
  }

  const optimizeRoute = (distanceMatrix) => {
    const deliveriesWithDistance = deliveries.map((delivery, index) => {
      const element = distanceMatrix.rows[0].elements[index] // From current location
      return {
        ...delivery,
        index,
        distance: element.distance ? element.distance.value : Number.POSITIVE_INFINITY,
        duration: element.duration ? element.duration.value : Number.POSITIVE_INFINITY,
        distanceText: element.distance ? element.distance.text : "Unknown",
        durationText: element.duration ? element.duration.text : "Unknown",
      }
    })

    // Sort by distance (nearest first)
    const sorted = deliveriesWithDistance.sort((a, b) => a.distance - b.distance)

    // Calculate cumulative time and distance
    let cumulativeDistance = 0
    let cumulativeTime = 0

    const optimized = sorted.map((delivery, index) => {
      cumulativeDistance += delivery.distance
      cumulativeTime += delivery.duration

      return {
        ...delivery,
        order: index + 1,
        cumulativeDistance: cumulativeDistance,
        cumulativeTime: cumulativeTime,
        estimatedArrival: new Date(Date.now() + cumulativeTime * 1000),
      }
    })

    return optimized
  }

  const displayOptimizedRoute = async (optimizedDeliveries) => {
    if (!directionsService || !directionsRenderer) return

    const waypoints = optimizedDeliveries.slice(1, -1).map((delivery) => ({
      location: { lat: delivery.lat, lng: delivery.lng },
      stopover: true,
    }))

    const request = {
      origin: currentLocation,
      destination: {
        lat: optimizedDeliveries[optimizedDeliveries.length - 1].lat,
        lng: optimizedDeliveries[optimizedDeliveries.length - 1].lng,
      },
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: window.google.maps.TravelMode.DRIVING,
    }

    return new Promise((resolve, reject) => {
      directionsService.route(request, (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result)

          // Calculate total route info
          const route = result.routes[0]
          let totalDistance = 0
          let totalDuration = 0

          route.legs.forEach((leg) => {
            totalDistance += leg.distance.value
            totalDuration += leg.duration.value
          })

          setRouteInfo({
            totalDistance: (totalDistance / 1000).toFixed(1) + " km",
            totalDuration: Math.round(totalDuration / 60) + " min",
            deliveries: optimizedDeliveries.length,
          })

          resolve(result)
        } else {
          reject(new Error(`Directions API error: ${status}`))
        }
      })
    })
  }

  const clearRoute = () => {
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] })
    }
    setOptimizedRoute([])
    setRouteInfo(null)
  }

  if (googleMapsError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive">Failed to load Google Maps</p>
            <p className="text-sm text-muted-foreground">{googleMapsError}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Delivery Route Optimization
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={calculateOptimalRoute}
                disabled={isCalculating || isMapLoading || !currentLocation || deliveries.length === 0}
                className="flex items-center gap-2"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4" />
                    Optimize Route
                  </>
                )}
              </Button>
              {optimizedRoute.length > 0 && (
                <Button variant="outline" onClick={clearRoute}>
                  Clear Route
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={mapRef} className="w-full h-[500px] rounded-lg border bg-muted" />

          {routeInfo && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{routeInfo.deliveries} stops</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{routeInfo.totalDistance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{routeInfo.totalDuration}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {optimizedRoute.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Optimized Delivery Sequence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {optimizedRoute.map((delivery, index) => (
                <div key={delivery.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Badge variant="outline" className="min-w-[2rem] justify-center">
                    {delivery.order}
                  </Badge>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{delivery.customer}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{delivery.distanceText}</span>
                        <span>•</span>
                        <span>{delivery.durationText}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{delivery.address}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{delivery.items} items</span>
                      <span>₹{delivery.total}</span>
                      <span>ETA: {delivery.estimatedArrival.toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://maps.google.com/?q=${delivery.lat},${delivery.lng}`, "_blank")}
                  >
                    <Navigation className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DeliveryRouteMap
