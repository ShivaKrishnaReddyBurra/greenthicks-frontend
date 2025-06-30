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
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedServiceArea, setSelectedServiceArea] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mapCenter, setMapCenter] = useState({ lat: 17.9784, lng: 79.5941 });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [deliveryRadius, setDeliveryRadius] = useState(5);
  const [radiusUnit, setRadiusUnit] = useState("km");
  const itemsPerPage = 6;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pincode: "",
    city: "",
    state: "",
    isActive: true,
    centerLocation: null,
    deliveryRadius: 0.1,
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

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="animate-pulse">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
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

  // Converts radius from specified unit to kilometers for backend storage
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

  // Fetches all service areas
  useEffect(() => {
    fetchServiceAreas();
  }, []);

  // Initializes Google Places Autocomplete for location search
  const initializeAutocomplete = useCallback(() => {
    if (!window.google || !mapRef.current) {
      console.warn("Google Maps or map container not ready");
      return;
    }

    const input = document.getElementById("map-search");
    if (!input) {
      console.warn("Map search input not found, retrying...");
      if (autocompleteRetryCount.current < 5) {
        autocompleteRetryCount.current += 1;
        setTimeout(initializeAutocomplete, 300);
      } else {
        setError("Search functionality is unavailable. Please click the map to select a location or enter coordinates manually.");
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

      // Focus input on mobile and ensure touch events work
      if (/Mobi|Android|iPad/i.test(navigator.userAgent)) {
        setTimeout(() => {
          input.focus();
          input.addEventListener("touchstart", (e) => e.stopPropagation());
        }, 100);
      }

      // Ensure suggestion dropdown is interactive
      const style = document.createElement("style");
      style.textContent = `
        .pac-container {
          z-index: 10000 !important;
          pointer-events: auto !important;
        }
        .pac-item {
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }
      `;
      document.head.appendChild(style);

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
          setError("Invalid location selected. Please try again or click the map.");
        }
      });
    } catch (error) {
      console.error("Failed to initialize Autocomplete:", error);
      setError("Failed to initialize location search. Please click the map or enter coordinates manually.");
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

  // Filters and paginates service areas
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
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      console.log("Filtered service areas:", filtered);
    } else {
      setFilteredServiceAreas([]);
      setTotalPages(1);
      console.warn("serviceAreas is not an array:", serviceAreas);
    }
  }, [searchQuery, serviceAreas]);

  // Logs service areas for debugging
  useEffect(() => {
    console.log("serviceAreas state:", serviceAreas);
    console.log("filteredServiceAreas state:", filteredServiceAreas);
  }, [serviceAreas, filteredServiceAreas]);

  // Fetches all service areas from the backend
  const fetchServiceAreas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching all service areas...");
      const response = await fetchWithAuth("/api/service-areas");
      console.log("Raw API response:", response);

      const data = response.data || response;
      const serviceAreasData = Array.isArray(data.serviceAreas) ? data.serviceAreas : Array.isArray(data) ? data : [];
      console.log("Parsed service areas:", serviceAreasData);

      setServiceAreas(serviceAreasData);
      setTotalPages(Math.ceil(serviceAreasData.length / itemsPerPage));
      if (serviceAreasData.length === 0) {
        setError("No service areas found.");
      }
    } catch (err) {
      console.error("Fetch service areas error:", err);
      setError(err.message || "Failed to fetch service areas.");
      setServiceAreas([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Initializes Google Map with marker and editable circle
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
      gestureHandling: "greedy",
    });

    mapRef.current.addEventListener("touchstart", (e) => e.stopPropagation());
    mapRef.current.addEventListener("touchmove", (e) => e.stopPropagation());

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
      radius: convertToKilometers(deliveryRadius, radiusUnit) * 1000,
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
      setDeliveryRadius(Math.max(Math.round(convertedRadius * 10) / 10, unitMinRadius(radiusUnit)));
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
        }));
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  // Returns minimum radius based on unit
  const unitMinRadius = (unit) => {
    switch (unit) {
      case "meters":
        return 100;
      case "miles":
        return 0.0621371;
      case "km":
      default:
        return 0.1;
    }
  };

  // Handles submission of new service area form
  const handleAddServiceArea = async (e) => {
    e.preventDefault();
    setIsButtonLoading(true);
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
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        deliveryFee: Number(formData.deliveryFee) || 0,
        estimatedDeliveryTime: Number(formData.estimatedDeliveryTime) || 30,
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
    } finally {
      setIsButtonLoading(false);
    }
  };

  // Handles submission of edit service area form
  const handleUpdateServiceArea = async (e) => {
    e.preventDefault();
    setIsButtonLoading(true);
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
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        deliveryFee: Number(formData.deliveryFee) || 0,
        estimatedDeliveryTime: Number(formData.estimatedDeliveryTime) || 30,
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
    } finally {
      setIsButtonLoading(false);
    }
  };

  // Deletes a service area after user confirmation
  const handleDeleteServiceArea = async (id) => {
    if (!confirm("Are you sure you want to delete this service area?")) return;
    setIsButtonLoading(true);
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
    } finally {
      setIsButtonLoading(false);
    }
  };

  // Opens edit modal and populates form with service area data
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
      setMapCenter(serviceArea.centerLocation);
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
      deliveryRadius: 0.1,
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

  // Calculate paginated service areas
  const paginatedServiceAreas = filteredServiceAreas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
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
            disabled={isButtonLoading}
          >
            {isButtonLoading ? (
              <LeafLoader />
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Service Area
              </>
            )}
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
        {paginatedServiceAreas.length > 0 ? (
          paginatedServiceAreas.map((area) => (
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
                  <span className="text-muted-foreground">Est. Delivery:</span>
                  <span className="font-medium">{area.estimatedDeliveryTime || 30} min</span>
                </div>
                {area.centerLocation && (
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <MapPin size={12} className="mr-2" />
                    <span>Map Location set</span>
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
                    disabled={isButtonLoading}
                  >
                    {isButtonLoading ? <LeafLoader /> : <Edit size={16} />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteServiceArea(area._id)}
                    className="text-red-600 hover:text-red-700 dark:hover:bg-red-900/30"
                    disabled={isButtonLoading}
                  >
                    {isButtonLoading ? <LeafLoader /> : <Trash2 size={16} />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground col-span-full">
            No service areas found. Try adding a new one or adjusting your search.
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || isButtonLoading}
          variant="outline"
        >
          {isButtonLoading ? <LeafLoader /> : "Previous"}
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || isButtonLoading}
          variant="outline"
        >
          {isButtonLoading ? <LeafLoader /> : "Next"}
        </Button>
      </div>

      <Dialog
        open={showAddModal}
        onOpenChange={(open) => {
          if (!open && showMapModal) return;
          setShowAddModal(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Add Service Area</DialogTitle>
            <DialogDescription>Create a new service area with delivery boundaries.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddServiceArea} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Downtown Delivery"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional notes about the area"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  required
                  pattern="\d{5,6}"
                  placeholder="e.g., 400001"
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  placeholder="e.g., Mumbai"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                placeholder="e.g., Maharashtra"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryFee">Delivery Fee (₹)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  min="0"
                  value={formData.deliveryFee === 0 ? "" : formData.deliveryFee}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      deliveryFee: value === "" ? "" : Number.parseFloat(value) || 0,
                    });
                  }}
                  onBlur={() => {
                    if (formData.deliveryFee === "") {
                      setFormData({ ...formData, deliveryFee: 0 });
                    }
                  }}
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <Label htmlFor="minOrderAmount">Min Order (₹)</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  min="0"
                  value={formData.minOrderAmount === 0 ? "" : formData.minOrderAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      minOrderAmount: value === "" ? "" : Number.parseFloat(value) || 0,
                    });
                  }}
                  onBlur={() => {
                    if (formData.minOrderAmount === "") {
                      setFormData({ ...formData, minOrderAmount: 0 });
                    }
                  }}
                  placeholder="e.g., 200"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="estimatedDeliveryTime">Est. Delivery Time (min) *</Label>
              <Input
                id="estimatedDeliveryTime"
                type="number"
                min="1"
                value={formData.estimatedDeliveryTime === 30 ? "" : formData.estimatedDeliveryTime}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    estimatedDeliveryTime: value === "" ? "" : Number.parseInt(value) || 30,
                  });
                }}
                onBlur={() => {
                  if (formData.estimatedDeliveryTime === "") {
                    setFormData({ ...formData, estimatedDeliveryTime: 30 });
                  }
                }}
                required
                placeholder="e.g., 30"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={openMapModal}
              className="w-full flex items-center gap-2"
              disabled={isButtonLoading}
            >
              {isButtonLoading ? (
                <LeafLoader />
              ) : (
                <>
                  <MapPin size={16} />
                  {selectedLocation ? "Change Location & Radius" : "Set Location & Radius"}
                </>
              )}
            </Button>
            {selectedLocation && (
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-sm">
                <p className="font-medium">Location Set:</p>
                <p>Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}</p>
                <p>Radius: {deliveryRadius} {radiusUnit}</p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                disabled={isButtonLoading}
              >
                {isButtonLoading ? <LeafLoader /> : "Cancel"}
              </Button>
              <Button type="submit" disabled={isButtonLoading}>
                {isButtonLoading ? <LeafLoader /> : "Add Area"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showEditModal}
        onOpenChange={(open) => {
          if (!open && showMapModal) return;
          setShowEditModal(open);
          if (!open) {
            setSelectedServiceArea(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Edit Service Area</DialogTitle>
            <DialogDescription>Update service area details and boundaries.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateServiceArea} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
浪
                required
                placeholder="e.g., Downtown Delivery"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional notes about the area"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  required
                  pattern="\d{5,6}"
                  placeholder="e.g., 400001"
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  placeholder="e.g., Mumbai"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                placeholder="e.g., Maharashtra"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryFee">Delivery Fee (₹)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  min="0"
                  value={formData.deliveryFee === 0 ? "" : formData.deliveryFee}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      deliveryFee: value === "" ? "" : Number.parseFloat(value) || 0,
                    });
                  }}
                  onBlur={() => {
                    if (formData.deliveryFee === "") {
                      setFormData({ ...formData, deliveryFee: 0 });
                    }
                  }}
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <Label htmlFor="minOrderAmount">Min Order (₹)</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  min="0"
                  value={formData.minOrderAmount === 0 ? "" : formData.minOrderAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      minOrderAmount: value === "" ? "" : Number.parseFloat(value) || 0,
                    });
                  }}
                  onBlur={() => {
                    if (formData.minOrderAmount === "") {
                      setFormData({ ...formData, minOrderAmount: 0 });
                    }
                  }}
                  placeholder="e.g., 200"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="estimatedDeliveryTime">Est. Delivery Time (min) *</Label>
              <Input
                id="estimatedDeliveryTime"
                type="number"
                min="1"
                value={formData.estimatedDeliveryTime === 30 ? "" : formData.estimatedDeliveryTime}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    estimatedDeliveryTime: value === "" ? "" : Number.parseInt(value) || 30,
                  });
                }}
                onBlur={() => {
                  if (formData.estimatedDeliveryTime === "") {
                    setFormData({ ...formData, estimatedDeliveryTime: 30 });
                  }
                }}
                required
                placeholder="e.g., 30"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="isActive" className="flex items-center gap-2">
                <Input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
                />
                Active
              </Label>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={openMapModal}
              className="w-full flex items-center gap-2"
              disabled={isButtonLoading}
            >
              {isButtonLoading ? (
                <LeafLoader />
              ) : (
                <>
                  <MapPin size={16} />
                  {selectedLocation ? "Change Location & Radius" : "Set Location & Radius"}
                </>
              )}
            </Button>
            {selectedLocation && (
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-sm">
                <p className="font-medium">Location Set:</p>
                <p>Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}</p>
                <p>Radius: {deliveryRadius} {radiusUnit}</p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedServiceArea(null);
                  resetForm();
                }}
                disabled={isButtonLoading}
              >
                {isButtonLoading ? <LeafLoader /> : "Cancel"}
              </Button>
              <Button type="submit" disabled={isButtonLoading}>
                {isButtonLoading ? <LeafLoader /> : "Update Area"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Set Location & Radius</DialogTitle>
            <DialogDescription>
              Search or click the map to set the service area center and adjust the radius.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="map-search">Search Location</Label>
              <Input
                id="map-search"
                type="text"
                placeholder="e.g., Mumbai, India"
                className="w-full"
                onTouchStart={(e) => e.stopPropagation()}
              />
            </div>
            {error && error.includes("Search functionality") && (
              <div className="space-y-2">
                <p className="text-sm text-red-500">Enter coordinates manually:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Latitude"
                    onChange={(e) => {
                      const lat = Number.parseFloat(e.target.value);
                      if (!Number.isNaN(lat)) {
                        setSelectedLocation((prev) => ({
                          ...prev,
                          lat,
                        }));
                        setMapCenter((prev) => ({ ...prev, lat }));
                      }
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Longitude"
                    onChange={(e) => {
                      const lng = Number.parseFloat(e.target.value);
                      if (!Number.isNaN(lng)) {
                        setSelectedLocation((prev) => ({
                          ...prev,
                          lng,
                        }));
                        setMapCenter((prev) => ({ ...prev, lng }));
                      }
                    }}
                  />
                </div>
              </div>
            )}
            {error && error.includes("Google Maps") && (
              <div className="text-red-500 text-sm">
                Map search unavailable. Click the map to select a location or check your API key.
              </div>
            )}
            <div className="flex flex-wrap gap-2 items-center">
              <Label>Delivery Radius:</Label>
              <Input
                type="number"
                min={unitMinRadius(radiusUnit)}
                step={radiusUnit === "meters" ? 0.1 : radiusUnit === "miles" ? 0.01 : 0.1}
                max={radiusUnit === "meters" ? 50000 : radiusUnit === "miles" ? 31 : 50}
                value={deliveryRadius === unitMinRadius(radiusUnit) ? "" : deliveryRadius}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedValue = value === "" ? "" : Number.parseFloat(value);
                  if (parsedValue >= unitMinRadius(radiusUnit) || value === "") {
                    setDeliveryRadius(parsedValue || "");
                    if (circleRef.current && parsedValue) {
                      circleRef.current.setRadius(convertToKilometers(parsedValue, radiusUnit) * 1000);
                    }
                  }
                }}
                onBlur={() => {
                  if (deliveryRadius === "" || deliveryRadius < unitMinRadius(radiusUnit)) {
                    setDeliveryRadius(unitMinRadius(radiusUnit));
                    if (circleRef.current) {
                      circleRef.current.setRadius(convertToKilometers(unitMinRadius(radiusUnit), radiusUnit) * 1000);
                    }
                  }
                }}
                className="w-24"
                placeholder={unitMinRadius(radiusUnit).toString()}
              />
              <Select
                value={radiusUnit}
                onValueChange={(value) => {
                  const currentKm = convertToKilometers(deliveryRadius, radiusUnit);
                  setRadiusUnit(value);
                  setDeliveryRadius(Math.max(convertFromKilometers(current, enumKm, value), unitMinRadius(value)));
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
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-sm">
                <p className="font-medium">Selected Location:</p>
                <p>Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}</p>
                <p>
                  Radius: {deliveryRadius} {radiusUnit} ({convertToKilometers(deliveryRadius, radiusUnit).toFixed(2)} km)
                </p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowMapModal(false)}
                disabled={isButtonLoading}
              >
                {isButtonLoading ? <LeafLoader /> : "Cancel"}
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setFormData((prev) => ({
                    ...prev,
                    centerLocation: selectedLocation,
                    deliveryRadius: convertToKilometers(
                      deliveryRadius === "" ? unitMinRadius(radiusUnit) : deliveryRadius,
                      radiusUnit
                    ),
                  }));
                  setShowMapModal(false);
                }}
                disabled={!selectedLocation || isButtonLoading}
              >
                {isButtonLoading ? (
                  <LeafLoader />
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Location
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}