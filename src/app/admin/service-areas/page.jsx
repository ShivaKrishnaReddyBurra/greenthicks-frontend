"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Plus, Edit, Trash2, CheckCircle, XCircle, AlertTriangle, MapPin, Save } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function ServiceAreaAdmin() {
  const { toast } = useToast()
  const [serviceAreas, setServiceAreas] = useState([])
  const [filteredServiceAreas, setFilteredServiceAreas] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [selectedServiceArea, setSelectedServiceArea] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.209 })
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [deliveryRadius, setDeliveryRadius] = useState(5)

  const [formData, setFormData] = useState({
    pincode: "",
    city: "",
    state: "",
    isActive: true,
    centerLocation: null,
    deliveryRadius: 5,
    deliveryFee: 0,
    minimumOrderAmount: 0,
    estimatedDeliveryTime: "30-45 minutes",
  })

  const mapRef = useRef(null)
  const googleMapRef = useRef(null)
  const markerRef = useRef(null)
  const circleRef = useRef(null)
  const autocompleteRef = useRef(null)

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) return Promise.resolve()

      return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry,drawing`
        script.async = true
        script.defer = true
        script.onload = resolve
        document.head.appendChild(script)
      })
    }

    loadGoogleMaps()
  }, [])

  useEffect(() => {
    fetchServiceAreas()
  }, [currentPage])

  useEffect(() => {
    // Initialize Places Autocomplete when map modal is opened
    if (showMapModal && window.google && mapRef.current && !autocompleteRef.current) {
      const input = document.getElementById("map-search")
      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        types: ["geocode"],
        fields: ["geometry", "address_components"],
      })

      autocompleteRef.current = autocomplete

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace()
        if (place.geometry) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }
          setSelectedLocation(location)
          setMapCenter(location)
          if (markerRef.current) {
            markerRef.current.setPosition(location)
          }
          if (circleRef.current) {
            circleRef.current.setCenter(location)
          }
          if (googleMapRef.current) {
            googleMapRef.current.panTo(location)
          }
          reverseGeocode(location)
        }
      })
    }
  }, [showMapModal])

  useEffect(() => {
    // Filter service areas based on search query
    const filtered = serviceAreas.filter(
      (area) =>
        area.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.pincode.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredServiceAreas(filtered)
  }, [searchQuery, serviceAreas])

  const fetchServiceAreas = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchWithAuth(`/api/service-areas?page=${currentPage}&limit=10`)
      setServiceAreas(data.serviceAreas)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const initializeMap = useCallback(() => {
    if (!window.google || !mapRef.current) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
    })

    googleMapRef.current = map

    const marker = new window.google.maps.Marker({
      position: selectedLocation || mapCenter,
      map: map,
      draggable: true,
      title: "Service Center",
      animation: window.google.maps.Animation.DROP,
    })

    markerRef.current = marker

    const circle = new window.google.maps.Circle({
      strokeColor: "#22c55e",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#22c55e",
      fillOpacity: 0.1,
      map: map,
      center: selectedLocation || mapCenter,
      radius: deliveryRadius * 1000,
      editable: true,
    })

    circleRef.current = circle

    marker.addListener("dragend", () => {
      const position = marker.getPosition()
      if (position) {
        const location = {
          lat: position.lat(),
          lng: position.lng(),
        }
        setSelectedLocation(location)
        circle.setCenter(location)
        reverseGeocode(location)
      }
    })

    circle.addListener("radius_changed", () => {
      const radius = Math.round(circle.getRadius() / 1000)
      setDeliveryRadius(radius)
      setFormData((prev) => ({ ...prev, deliveryRadius: radius }))
    })

    map.addListener("click", (event) => {
      if (event.latLng) {
        const location = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        }
        marker.setPosition(location)
        circle.setCenter(location)
        setSelectedLocation(location)
        reverseGeocode(location)
      }
    })
  }, [mapCenter, selectedLocation, deliveryRadius])

  const reverseGeocode = async (location) => {
    if (!window.google) return

    const geocoder = new window.google.maps.Geocoder()
    try {
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ location }, (results, status) => {
          if (status === "OK" && results && results.length > 0) resolve(results)
          else reject(new Error("Geocoding failed"))
        })
      })

      if (response[0]) {
        const addressComponents = response[0].address_components
        let city = "",
          state = "",
          pincode = ""

        addressComponents.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name
          }
          if (component.types.includes("postal_code")) {
            pincode = component.long_name
          }
        })

        setFormData((prev) => ({
          ...prev,
          city: city || prev.city,
          state: state || prev.state,
          pincode: pincode || prev.pincode,
          centerLocation: location,
        }))
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error)
    }
  }

  const handleAddServiceArea = async (e) => {
    e.preventDefault()
    try {
      await fetchWithAuth("/api/service-areas", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          centerLocation: selectedLocation,
          deliveryRadius: deliveryRadius,
        }),
      })
      setShowAddModal(false)
      setShowMapModal(false)
      resetForm()
      fetchServiceAreas()
      toast({
        title: "Success",
        description: "Service area added successfully",
      })
    } catch (err) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleUpdateServiceArea = async (e) => {
    e.preventDefault()
    if (!selectedServiceArea) return
    try {
      await fetchWithAuth(`/api/service-areas/${selectedServiceArea.pincode}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          centerLocation: selectedLocation,
          deliveryRadius: deliveryRadius,
        }),
      })
      setShowEditModal(false)
      setShowMapModal(false)
      setSelectedServiceArea(null)
      resetForm()
      fetchServiceAreas()
      toast({
        title: "Success",
        description: "Service area updated successfully",
      })
    } catch (err) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteServiceArea = async (pincode) => {
    if (!confirm("Are you sure you want to delete this service area?")) return
    try {
      await fetchWithAuth(`/api/service-areas/${pincode}`, {
        method: "DELETE",
      })
      fetchServiceAreas()
      toast({
        title: "Success",
        description: "Service area deleted successfully",
      })
    } catch (err) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const openEditModal = (serviceArea) => {
    setSelectedServiceArea(serviceArea)
    setFormData({
      pincode: serviceArea.pincode,
      city: serviceArea.city,
      state: serviceArea.state,
      isActive: serviceArea.isActive,
      centerLocation: serviceArea.centerLocation,
      deliveryRadius: serviceArea.deliveryRadius || 5,
      deliveryFee: serviceArea.deliveryFee || 0,
      minimumOrderAmount: serviceArea.minimumOrderAmount || 0,
      estimatedDeliveryTime: serviceArea.estimatedDeliveryTime || "30-45 minutes",
    })

    if (serviceArea.centerLocation) {
      setSelectedLocation(serviceArea.centerLocation)
      setMapCenter(serviceArea.centerLocation)
    }

    setDeliveryRadius(serviceArea.deliveryRadius || 5)
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      pincode: "",
      city: "",
      state: "",
      isActive: true,
      centerLocation: null,
      deliveryRadius: 5,
      deliveryFee: 0,
      minimumOrderAmount: 0,
      estimatedDeliveryTime: "30-45 minutes",
    })
    setSelectedLocation(null)
    setDeliveryRadius(5)
  }

  const openMapModal = () => {
    setShowMapModal(true)
    setTimeout(() => {
      initializeMap()
    }, 100)
  }

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle size={12} className="mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        <XCircle size={12} className="mr-1" />
        Inactive
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Service Areas Management
        </h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              resetForm()
              setShowAddModal(true)
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service Area
          </Button>
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search by city, state, or pincode"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 mr-3" />
            <p className="text-sm sm:text-base">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredServiceAreas.map((area) => (
          <Card key={area.pincode} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{area.city}</CardTitle>
                {getStatusBadge(area.isActive)}
              </div>
              <p className="text-sm text-muted-foreground">{area.state}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pincode:</span>
                <span className="font-medium">{area.pincode}</span>
              </div>
              {area.deliveryRadius && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Radius:</span>
                  <span className="font-medium">{area.deliveryRadius} km</span>
                </div>
              )}
              {area.deliveryFee > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee:</span>
                  <span className="font-medium">₹{area.deliveryFee}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Est. Time:</span>
                <span className="font-medium">{area.estimatedDeliveryTime}</span>
              </div>
              {area.centerLocation && (
                <div className="flex items-center text-sm text-green-600">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>Map Location Set</span>
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => openEditModal(area)}>
                  <Edit size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteServiceArea(area.pincode)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
        >
          Previous
        </Button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Service Area</DialogTitle>
            <DialogDescription>Create a new service area with delivery boundaries</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddServiceArea} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  required
                  pattern="\d{5,6}"
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryFee">Delivery Fee (₹)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  min="0"
                  value={formData.deliveryFee}
                  onChange={(e) => setFormData({ ...formData, deliveryFee: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="minimumOrderAmount">Min Order (₹)</Label>
                <Input
                  id="minimumOrderAmount"
                  type="number"
                  min="0"
                  value={formData.minimumOrderAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, minimumOrderAmount: Number.parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="estimatedDeliveryTime">Estimated Delivery Time</Label>
              <Input
                id="estimatedDeliveryTime"
                value={formData.estimatedDeliveryTime}
                onChange={(e) => setFormData({ ...formData, estimatedDeliveryTime: e.target.value })}
                placeholder="e.g., 30-45 minutes"
              />
            </div>
            <Button type="button" variant="outline" onClick={openMapModal} className="w-full flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {selectedLocation ? "Change Location & Radius" : "Set Location & Radius"}
            </Button>
            {selectedLocation && (
              <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-md text-sm">
                <p className="font-medium">Location Set:</p>
                <p>
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                </p>
                <p>Delivery Radius: {deliveryRadius} km</p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Add Service Area</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Service Area</DialogTitle>
            <DialogDescription>Update service area details and boundaries</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateServiceArea} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input id="pincode" value={formData.pincode} disabled className="opacity-50" />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryFee">Delivery Fee (₹)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  min="0"
                  value={formData.deliveryFee}
                  onChange={(e) => setFormData({ ...formData, deliveryFee: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="minimumOrderAmount">Min Order (₹)</Label>
                <Input
                  id="minimumOrderAmount"
                  type="number"
                  min="0"
                  value={formData.minimumOrderAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, minimumOrderAmount: Number.parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="estimatedDeliveryTime">Estimated Delivery Time</Label>
              <Input
                id="estimatedDeliveryTime"
                value={formData.estimatedDeliveryTime}
                onChange={(e) => setFormData({ ...formData, estimatedDeliveryTime: e.target.value })}
                placeholder="e.g., 30-45 minutes"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <Button type="button" variant="outline" onClick={openMapModal} className="w-full flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {selectedLocation ? "Change Location & Radius" : "Set Location & Radius"}
            </Button>
            {selectedLocation && (
              <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-md text-sm">
                <p className="font-medium">Location Set:</p>
                <p>
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                </p>
                <p>Delivery Radius: {deliveryRadius} km</p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedServiceArea(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Update Service Area</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Set Service Area Location & Delivery Radius</DialogTitle>
            <DialogDescription>
              Click on the map to set the service center location and adjust the delivery radius
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <Label htmlFor="map-search">Search Location</Label>
              <Input
                id="map-search"
                type="text"
                placeholder="Enter a location"
                className="flex-1"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Label>Delivery Radius:</Label>
              <Input
                type="number"
                min="1"
                max="50"
                value={deliveryRadius}
                onChange={(e) => {
                  const radius = Number.parseInt(e.target.value) || 5
                  setDeliveryRadius(radius)
                  if (circleRef.current) {
                    circleRef.current.setRadius(radius * 1000)
                  }
                }}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">km</span>
            </div>

            <div ref={mapRef} className="w-full h-96 rounded-lg border" />

            {selectedLocation && (
              <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-md text-sm">
                <p className="font-medium">Selected Location:</p>
                <p>
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                </p>
                <p>Delivery Radius: {deliveryRadius} km</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowMapModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    centerLocation: selectedLocation,
                    deliveryRadius: deliveryRadius,
                  }))
                  setShowMapModal(false)
                }}
                disabled={!selectedLocation}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}