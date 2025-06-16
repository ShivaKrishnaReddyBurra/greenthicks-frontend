"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle, AlertTriangle, MapPin, Save } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function ServiceAreaAdmin() {
  const { toast } = useToast();
  const [serviceAreas, setServiceAreas] = useState([]);
  const [filteredServiceAreas, setFilteredServiceAreas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedServiceArea, setSelectedServiceArea] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.209 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [deliveryRadius, setDeliveryRadius] = useState(5);
  const [radiusUnit, setRadiusUnit] = useState("km");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pincode: "",
    city: "",
    state: "",
    isActive: true,
    centerLocation: null,
    deliveryRadius: 0.1, // Minimum 0.1 km
    deliveryFee: 0,
    minOrderAmount: 0,
    estimatedDeliveryTime: 30,
  });

  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const autocompleteRef = useRef(null);
  const autocompleteRetryCount = useRef(0);

  // Converts radius from specified unit to kilometers for backend storage
  // @param {number} value - Radius value
  // @param {string} unit - Unit of measurement ("meters", "miles", "km")
  // @returns {number} - Radius in kilometers
  const convertToKilometers = (value, unit) => {
    const parsedValue = Number.parseFloat(value) || 0;
    switch (unit) {
      case "meters":
        return parsedValue / 1000;
      case "miles":
        return parsedValue * 1.60934;
      case "km":
      default:
        return parsedValue;
    }
  };

  // Converts radius from kilometers to specified unit for display
  // @param {number} value - Radius value in kilometers
  // @param {string} unit - Unit of measurement ("meters", "miles", "km")
  // @returns {number} - Radius in specified unit
  const convertFromKilometers = (value, unit) => {
    const parsedValue = Number.parseFloat(value) || 0;
    switch (unit) {
      case "meters":
        return parsedValue * 1000;
      case "miles":
        return parsedValue / 1.60934;
      case "km":
      default:
        return parsedValue;
    }
  };

  // Generates a GeoJSON Polygon for the service area geometry
  // @param {object} center - Center coordinates { lat, lng }
  // @param {number} radiusKm - Radius in kilometers
  // @param {number} [numPoints=32] - Number of points to approximate circle
  // @returns {object|null} - GeoJSON Polygon or null if center is invalid
  const generateCircularPolygon = (center, radiusKm, numPoints = 32) => {
    if (!center) return null;
    const { lat, lng } = center;
    const coordinates = [];
    const earthRadius = 6371; // Earth's radius in km

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const dx = (radiusKm / earthRadius) * (180 / Math.PI);
      const dy = dx / Math.cos((lat * Math.PI) / 180);
      const pointLat = lat + dx * Math.cos(angle);
      const pointLng = lng + dy * Math.sin(angle);
      coordinates.push([pointLng, pointLat]);
    }
    coordinates.push(coordinates[0]); // Close the polygon

    return {
      type: "Polygon",
      coordinates: [coordinates],
    };
  };

  // Loads Google Maps API script dynamically
  // Runs once on component mount
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        console.log("Google Maps API already loaded");
        return Promise.resolve();
      }

      console.log("Loading Google Maps API...");
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry,drawing`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("Google Maps API loaded successfully");
          resolve();
        };
        script.onerror = (err) => {
          console.error("Failed to load Google Maps API:", err);
          setError("Failed to load Google Maps. Please check your API key and network.");
          reject(err);
        };
        document.head.appendChild(script);
      });
    };

    loadGoogleMaps().catch((error) => console.error("Google Maps load error:", error));
  }, []);

  // Fetches service areas when currentPage changes
  useEffect(() => {
    fetchServiceAreas();
  }, [currentPage]);

  // Initializes Google Places Autocomplete for location search
  // Retries up to 3 times if input is not found
  const initializeAutocomplete = useCallback(() => {
    if (!window.google || !mapRef.current) {
      console.warn("Google Maps or map container not ready");
      return;
    }

    const input = document.getElementById("map-search");
    if (!input) {
      console.warn("Map search input not found, retrying...");
      if (autocompleteRetryCount.current < 3) {
        autocompleteRetryCount.current += 1;
        setTimeout(initializeAutocomplete, 500);
      } else {
        setError("Search input not found after retries. Please click the map to select a location.");
      }
      return;
    }

    try {
      console.log("Initializing Places Autocomplete");
      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        types: ["geocode"],
        fields: ["geometry", "address_components"],
      });

      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        console.log("Place changed event triggered");
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          console.log("Selected location:", location);
          setSelectedLocation(location);
          setMapCenter(location);
          if (markerRef.current) {
            markerRef.current.setPosition(location);
          }
          if (circleRef.current) {
            circleRef.current.setCenter(location);
          }
          if (googleMapRef.current) {
            googleMapRef.current.panTo(location);
          }
          reverseGeocode(location);
        } else {
          console.error("No geometry data for selected place");
          setError("Invalid location selected. Please try again.");
        }
      });
    } catch (error) {
      console.error("Failed to initialize Autocomplete:", error);
      setError("Failed to initialize location search. Please click the map to select a location.");
    }
  }, []);

  // Sets up Autocomplete when map modal is opened
  useEffect(() => {
    if (showMapModal) {
      autocompleteRetryCount.current = 0;
      setTimeout(initializeAutocomplete, 100);
    } else {
      autocompleteRef.current = null;
    }
  }, [showMapModal, initializeAutocomplete]);

  // Filters service areas based on search query
  useEffect(() => {
    if (Array.isArray(serviceAreas)) {
      const filtered = serviceAreas.filter((area) => {
        const search = searchQuery.toLowerCase();
        return (
          (area.name || "").toLowerCase().includes(search) ||
          (area.city || "").toLowerCase().includes(search) ||
          (area.state || "").toLowerCase().includes(search) ||
          (area.pincode || "").toLowerCase().includes(search)
        );
      });
      setFilteredServiceAreas(filtered);
      console.log("Filtered service areas:", filtered);
    } else {
      setFilteredServiceAreas([]);
      console.warn("serviceAreas is not an array:", serviceAreas);
    }
  }, [searchQuery, serviceAreas]);

  // Logs service areas for debugging
  useEffect(() => {
    console.log("serviceAreas state:", serviceAreas);
    console.log("filteredServiceAreas state:", filteredServiceAreas);
  }, [serviceAreas, filteredServiceAreas]);

  // Fetches service areas from the backend
  // Updates state with paginated data
  const fetchServiceAreas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(`Fetching service areas for page ${currentPage}...`);
      const response = await fetchWithAuth(`/api/service-areas?page=${currentPage}&limit=10`);
      console.log("Raw API response:", response);

      const data = response.data || response; // Handle nested data
      const serviceAreasData = Array.isArray(data.serviceAreas) ? data.serviceAreas : Array.isArray(data) ? data : [];
      console.log("Parsed service areas:", serviceAreasData);

      setServiceAreas(serviceAreasData);
      setTotalPages(data.totalPages || 1);
      if (serviceAreasData.length === 0) {
        setError("No service areas found.");
      }
    } catch (err) {
      console.error("Fetch service areas error:", err);
      setError(err.message || "Failed to fetch service areas.");
      setServiceAreas([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initializes Google Map with marker and editable circle
  // Sets up event listeners for map interactions
  const initializeMap = useCallback(() => {
    if (!window.google || !mapRef.current) {
      console.warn("Cannot initialize map: Google Maps not loaded or container missing");
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
    });

    googleMapRef.current = map;

    const marker = new window.google.maps.Marker({
      position: selectedLocation || mapCenter,
      map: map,
      draggable: true,
      title: "Service Center",
      animation: window.google.maps.Animation.DROP,
    });

    markerRef.current = marker;

    const circle = new window.google.maps.Circle({
      strokeColor: "#22c55e",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#22c55e",
      fillOpacity: 0.1,
      map: map,
      center: selectedLocation || mapCenter,
      radius: convertToKilometers(deliveryRadius, radiusUnit) * 1000, // Convert to meters
      editable: true,
    });

    circleRef.current = circle;

    marker.addListener("dragend", () => {
      const position = marker.getPosition();
      if (position) {
        const location = {
          lat: position.lat(),
          lng: position.lng(),
        };
        setSelectedLocation(location);
        circle.setCenter(location);
        reverseGeocode(location);
      }
    });

    circle.addListener("radius_changed", () => {
      const radiusMeters = circle.getRadius();
      const radiusKm = radiusMeters / 1000;
      const convertedRadius = convertFromKilometers(radiusKm, radiusUnit);
      setDeliveryRadius(Math.max(Math.round(convertedRadius * 10) / 10, unitMinRadius(radiusUnit))); // Enforce min
      setFormData((prev) => ({
        ...prev,
        deliveryRadius: radiusKm,
      }));
    });

    map.addListener("click", (event) => {
      if (event.latLng) {
        const location = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        marker.setPosition(location);
        circle.setCenter(location);
        setSelectedLocation(location);
        reverseGeocode(location);
      }
    });
  }, [mapCenter, selectedLocation, deliveryRadius, radiusUnit]);

  // Performs reverse geocoding to get address details from coordinates
  // Updates formData with city, state, and pincode
  // @param {object} location - Coordinates { lat, lng }
  const reverseGeocode = async (location) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    try {
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ location }, (results, status) => {
          if (status === "OK" && results && results.length > 0) resolve(results);
          else reject(new Error("Geocoding failed"));
        });
      });

      if (response[0]) {
        const addressComponents = response[0].address_components;
        let city = "",
          state = "",
          pincode = "";

        addressComponents.forEach((component) => {
          if (component.types.includes("locality")) city = component.long_name;
          if (component.types.includes("administrative_area_level_1")) state = component.long_name;
          if (component.types.includes("postal_code")) pincode = component.long_name;
        });

        setFormData((prev) => ({
          ...prev,
          city: city || prev.city,
          state: state || prev.state,
          pincode: pincode || prev.pincode,
          centerLocation: location,
        }));
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  // Returns minimum radius based on unit (0.1 km = 100 meters)
  // @param {string} unit - Unit of measurement ("meters", "miles", "km")
  // @returns {number} - Minimum radius in specified unit
  const unitMinRadius = (unit) => {
    switch (unit) {
      case "meters":
        return 100; // 0.1 km
      case "miles":
        return 0.0621371; // 0.1 km in miles
      case "km":
      default:
        return 0.1;
    }
  };

  // Handles submission of new service area form
  // Sends POST request to create service area
  // @param {Event} e - Form submission event
  const handleAddServiceArea = async (e) => {
    e.preventDefault();
    try {
      const radiusKm = convertToKilometers(deliveryRadius, radiusUnit);
      if (radiusKm < 0.1) {
        throw new Error("Delivery radius must be at least 0.1 km.");
      }
      const geometry = generateCircularPolygon(selectedLocation, radiusKm);
      if (!geometry) {
        throw new Error("Please set a valid location and radius.");
      }

      const payload = {
        ...formData,
        centerLocation: selectedLocation,
        deliveryRadius: radiusKm,
        geometry,
        minOrderAmount: formData.minOrderAmount,
        active: formData.isActive,
      };

      console.log("Add service area payload:", payload);

      await fetchWithAuth("/api/service-areas", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setShowAddModal(false);
      setShowMapModal(false);
      resetForm();
      fetchServiceAreas();
      toast({
        title: "Success",
        description: "Service area added successfully",
      });
    } catch (err) {
      console.error("Add service area error:", err);
      setError(err.message || "Failed to add service area.");
      toast({
        title: "Error",
        description: err.message || "Failed to add service area.",
        variant: "destructive",
      });
    }
  };

  // Handles submission of edit service area form
  // Sends PUT request to update service area
  // @param {Event} e - Form submission event
  const handleUpdateServiceArea = async (e) => {
    e.preventDefault();
    if (!selectedServiceArea) return;
    try {
      const radiusKm = convertToKilometers(deliveryRadius, radiusUnit);
      if (radiusKm < 0.1) {
        throw new Error("Delivery radius must be at least 0.1 km.");
      }
      const geometry = generateCircularPolygon(selectedLocation, radiusKm);
      if (!geometry) {
        throw new Error("Please set a valid location and radius.");
      }

      const payload = {
        ...formData,
        centerLocation: selectedLocation,
        deliveryRadius: radiusKm,
        geometry,
        minOrderAmount: formData.minOrderAmount,
        active: formData.isActive,
      };

      console.log("Update service area payload:", payload);

      await fetchWithAuth(`/api/service-areas/${selectedServiceArea._id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setShowEditModal(false);
      setShowMapModal(false);
      setSelectedServiceArea(null);
      resetForm();
      fetchServiceAreas();
      toast({
        title: "Success",
        description: "Service area updated successfully",
      });
    } catch (err) {
      console.error("Update service area error:", err);
      setError(err.message || "Failed to update service area.");
      toast({
        title: "Error",
        description: err.message || "Failed to update service area.",
        variant: "destructive",
      });
    }
  };

  // Deletes a service area after user confirmation
  // Sends DELETE request to remove service area
  // @param {string} id - MongoDB _id of the service area
  const handleDeleteServiceArea = async (id) => {
    if (!confirm("Are you sure you want to delete this service area?")) return;
    try {
      await fetchWithAuth(`/api/service-areas/${id}`, {
        method: "DELETE",
      });
      fetchServiceAreas();
      toast({
        title: "Success",
        description: "Service area deleted successfully",
      });
    } catch (err) {
      console.error("Delete service area error:", err);
      setError(err.message || "Failed to delete service area.");
      toast({
        title: "Error",
        description: err.message || "Failed to delete service area.",
        variant: "destructive",
      });
    }
  };

  // Opens edit modal and populates form with service area data
  // @param {object} serviceArea - Service area object to edit
  const openEditModal = (serviceArea) => {
    setSelectedServiceArea(serviceArea);
    setFormData({
      name: serviceArea.name || serviceArea.city || "",
      description: serviceArea.description || "",
      pincode: serviceArea.pincode || "",
      city: serviceArea.city || "",
      state: serviceArea.state || "",
      isActive: serviceArea.isActive ?? serviceArea.active ?? true,
      centerLocation: serviceArea.centerLocation || null,
      deliveryRadius: serviceArea.deliveryRadius || 0.1,
      deliveryFee: serviceArea.deliveryFee || 0,
      minOrderAmount: serviceArea.minOrderAmount || 0,
      estimatedDeliveryTime: Number(serviceArea.estimatedDeliveryTime) || 30,
    });

    if (serviceArea.centerLocation) {
      setSelectedLocation(serviceArea.centerLocation);
      setMapCenter(serviceArea.centerLocation); // Fixed: Use centerLocation
    }

    setDeliveryRadius(convertFromKilometers(serviceArea.deliveryRadius || 0.1, radiusUnit));
    setShowEditModal(true);
  };

  // Resets form data to initial state
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      pincode: "",
      city: "",
      state: "",
      isActive: true,
      centerLocation: null,
      deliveryRadius: 0.1, // Minimum 0.1
      deliveryFee: 0,
      minOrderAmount: 0,
      estimatedDeliveryTime: 30,
    });
    setSelectedLocation(null);
    setDeliveryRadius(5);
    setRadiusUnit("km");
  };

  // Opens map modal and initializes map after a short delay
  const openMapModal = () => {
    setShowMapModal(true);
    setTimeout(() => {
      initializeMap();
    }, 100);
  };

  // Returns JSX for status badge based on active state
  // @param {boolean} isActive - Whether the service area is active
  // @returns {JSX.Element} - Status badge component
  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-800 dark:text-green-400">
        <CheckCircle size={12} className="mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/50 dark:text-red-400">
        <XCircle size={12} className="mr-1" />
        Inactive
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Service Areas Management
        </h3>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button
            type="button"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service Area
          </Button>
          <div className="w-full sm:w-64">
            <Input
              type="text"
              id="search"
              placeholder="Search by name, city, state, or pincode"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-3" />
            <p className="text-sm sm:text-base">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredServiceAreas.length > 0 ? (
          filteredServiceAreas.map((area) => (
            <Card key={area._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{area.name || area.city || "Unnamed Area"}</CardTitle>
                  {getStatusBadge(area.isActive ?? area.active)}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pincode:</span>
                  <span className="font-medium">{area.pincode || "N/A"}</span>
                </div>
                {area.deliveryRadius && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Radius:</span>
                    <span className="font-medium">{area.deliveryRadius.toFixed(2)} km</span>
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
                  <span className="font-medium">{area.estimatedDeliveryTime || 30} minutes</span>
                </div>
                {area.centerLocation && (
                  <div className="flex items-center text-sm text-green-600">
                    <MapPin className="h-3 w-3 mr-2" />
                    <span>Map Location Set</span>
                  </div>
                )}
                {area.description && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Description:</span>
                    <p>{area.description}</p>
                  </div>
                )}
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(area)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteServiceArea(area._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            No service areas found. Try adding a new one or adjusting the search.
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <Button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <div>
          <Button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Service Area</DialogTitle>
            <DialogDescription>Create a new service area with delivery boundaries</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddServiceArea} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Downtown Service Area"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  type="text"
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
                  type="text"
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
                type="text"
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
                  type="number"
                  id="deliveryFee"
                  min="0"
                  value={formData.deliveryFee}
                  onChange={(e) => setFormData({ ...formData, deliveryFee: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="minOrderAmount">Min Order (₹)</Label>
                <Input
                  type="number"
                  id="minOrderAmount"
                  min="0"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="estimatedDeliveryTime">Estimated Delivery Time (minutes) *</Label>
              <Input
                type="number"
                id="estimatedDeliveryTime"
                min="1"
                value={formData.estimatedDeliveryTime}
                onChange={(e) => setFormData({ ...formData, estimatedDeliveryTime: Number.parseInt(e.target.value) || 30 })}
                required
                placeholder="e.g., 30"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={openMapModal}
              className="w-full flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {selectedLocation ? "Change Location & Radius" : "Set Location & Radius"}
            </Button>
            {selectedLocation && (
              <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-md text-sm">
                <p className="font-medium">Location Set:</p>
                <p>
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                </p>
                <p>
                  Delivery Radius: {deliveryRadius} {radiusUnit}
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
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
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Downtown Service Area"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
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
                <Label htmlFor="minOrderAmount">Min Order (₹)</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  min="0"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="estimatedDeliveryTime">Estimated Delivery Time (minutes) *</Label>
              <Input
                type="number"
                id="estimatedDeliveryTime"
                min="1"
                value={formData.estimatedDeliveryTime}
                onChange={(e) => setFormData({ ...formData, estimatedDeliveryTime: Number.parseInt(e.target.value) || 30 })}
                required
                placeholder="e.g., 30"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
                />
                <Label htmlFor="isActive">Active</Label>
              </label>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={openMapModal}
              className="w-full flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {selectedLocation ? "Change Location & Radius" : "Set Location & Radius"}
            </Button>
            {selectedLocation && (
              <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-md text-sm">
                <p className="font-medium">Location Set:</p>
                <p>
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                </p>
                <p>
                  Delivery Radius: {deliveryRadius} {radiusUnit}
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedServiceArea(null);
                  resetForm();
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Set Service Area Location & Delivery Radius</DialogTitle>
            <DialogDescription>
              Search or click on the map to set the service area center location and adjust the delivery radius
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <Label htmlFor="map-search">Search Location</Label>
              <Input
                type="text"
                id="map-search"
                placeholder="Enter a location (e.g., Mumbai, India)"
                className="flex-1"
              />
            </div>
            {error && error.includes("Google Maps") && (
              <div className="text-red-500 text-sm">
                Map search is unavailable. Please click the map to select a location or check your API key.
              </div>
            )}
            <div className="flex gap-2 items-center">
              <Label>Delivery Radius:</Label>
              <Input
                type="number"
                min={unitMinRadius(radiusUnit)}
                step={radiusUnit === "meters" ? 0.1 : radiusUnit === "miles" ? 0.01 : 0.1}
                max={radiusUnit === "meters" ? 50000 : radiusUnit === "miles" ? 31 : 50}
                value={deliveryRadius}
                onChange={(e) => {
                  const value = Number.parseFloat(e.target.value);
                  if (value >= unitMinRadius(radiusUnit)) {
                    setDeliveryRadius(value);
                    if (circleRef.current) {
                      circleRef.current.setRadius(convertToKilometers(value, radiusUnit) * 1000);
                    }
                  }
                }}
                className="w-24"
              />
              <Select
                value={radiusUnit}
                onValueChange={(value) => {
                  const currentKm = convertToKilometers(deliveryRadius, radiusUnit);
                  setRadiusUnit(value);
                  setDeliveryRadius(Math.max(convertFromKilometers(currentKm, value), unitMinRadius(value)));
                  if (circleRef.current) {
                    circleRef.current.setRadius(currentKm * 1000);
                  }
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">Kilometers (km)</SelectItem>
                  <SelectItem value="meters">Meters (m)</SelectItem>
                  <SelectItem value="miles">Miles (mi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div ref={mapRef} className="w-full h-[50vh] max-h-96 rounded-lg border" />
            {selectedLocation && (
              <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-md text-sm">
                <p className="font-medium">Selected Location:</p>
                <p>
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                </p>
                <p>
                  Delivery Radius: {deliveryRadius} {radiusUnit} (
                  {convertToKilometers(deliveryRadius, radiusUnit).toFixed(2)} km)
                </p>
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
                    deliveryRadius: convertToKilometers(deliveryRadius, radiusUnit),
                  }));
                  setShowMapModal(false);
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
  );
}