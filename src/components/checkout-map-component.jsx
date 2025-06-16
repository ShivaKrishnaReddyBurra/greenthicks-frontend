"use strict";

import { useState, useEffect, useRef } from "react";
import { MapPin, AlertCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGoogleMaps } from "@/lib/google-maps-loader";
import { debounce } from "lodash";

// Simple Error Boundary
const SimpleErrorBoundary = ({ children }) => {
  return <div className="relative">{children}</div>;
};

// Simple API Error Component
const SimpleApiError = ({ message, onRetry }) => {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Google Maps API Error</AlertTitle>
      <AlertDescription>
        <p className="mb-2">{message || "There was a problem with the Google Maps API"}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (onRetry) onRetry();
            else window.location.reload();
          }}
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
};

// Simple Billing Error Component
const SimpleBillingError = ({ onRetry }) => {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Google Maps Billing Required</AlertTitle>
      <AlertDescription>
        <p className="mb-2">Google Maps requires billing to be enabled on your Google Cloud account.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (onRetry) onRetry();
            else window.location.reload();
          }}
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
};

const CheckoutMapComponent = ({
  onLocationSelect,
  initialLocation = null,
  initialAddress = "",
  required = true,
}) => {
  // State
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [address, setAddress] = useState(initialAddress || "");
  const [addressComponents, setAddressComponents] = useState({ city: "", state: "", zipCode: "", lag: "", lng: "" });
  const [mapError, setMapError] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [initError, setInitError] = useState(null);

  // Refs
  const mapContainerRef = useRef(null);
  const geocoder = useRef(null);
  const searchBox = useRef(null);
  const searchInputRef = useRef(null);
  const componentMounted = useRef(true);

  // Google Maps Hook
  const {
    isLoaded: isMapLoaded,
    error: googleMapsError,
    errorType: mapErrorType,
    isLoading: isMapLoading,
    retry: retryMap,
  } = useGoogleMaps(["places", "geometry"]);

  // Default center
  const defaultCenter = { lat: 28.6139, lng: 77.209 };

  // Leaf icon state
  const [leafIcon, setLeafIcon] = useState(null);

  // Debug logging
  const logDebug = (message, data = {}) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`🗺️ CheckoutMap: ${message}`, data);
    }
  };

  // Initialize custom marker icon
  useEffect(() => {
    if (isMapLoaded && window.google?.maps && !leafIcon) {
      logDebug("📍 Initializing custom marker icon");
      try {
        setLeafIcon({
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32),
        });
      } catch (err) {
        logDebug("❌ Failed to initialize marker icon", { error: err.message });
        setMapError("Failed to initialize map icon");
      }
    }
  }, [isMapLoaded, leafIcon]);

  // Cleanup on unmount
  useEffect(() => {
    logDebug("🟢 Component mounted");
    componentMounted.current = true;
    return () => {
      logDebug("🧹 Component unmounting, cleaning up");
      componentMounted.current = false;
      if (map) {
        window.google?.maps?.event.clearInstanceListeners(map);
      }
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [map, marker]);

  // Initialize map
  useEffect(() => {
    if (!isMapLoaded || mapInitialized || googleMapsError || !leafIcon || !componentMounted.current) {
      logDebug("⏳ Skipping map initialization", {
        isMapLoaded,
        mapInitialized,
        googleMapsError: !!googleMapsError,
        leafIcon: !!leafIcon,
        mounted: componentMounted.current,
      });
      return;
    }

    const initializeMap = () => {
      logDebug("🎯 Attempting to initialize map");
      if (!componentMounted.current || !window.google?.maps || !mapContainerRef.current) {
        logDebug("❌ Cannot initialize map: dependencies missing", {
          mounted: componentMounted.current,
          googleMaps: !!window.google?.maps,
          container: !!mapContainerRef.current,
        });
        setInitError("Map initialization failed: dependencies missing");
        return;
      }

      try {
        const container = mapContainerRef.current;
        container.style.height = "300px";
        container.style.minHeight = "300px";
        container.style.width = "100%";

        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          logDebug("❌ Map container has invalid dimensions", { width: rect.width, height: rect.height });
          setInitError("Map container is not visible or has invalid dimensions");
          return;
        }

        geocoder.current = new window.google.maps.Geocoder();

        const center =
          selectedLocation && isValidCoordinate(selectedLocation.lat) && isValidCoordinate(selectedLocation.lng)
            ? selectedLocation
            : initialLocation && isValidCoordinate(initialLocation.lat) && isValidCoordinate(initialLocation.lng)
            ? initialLocation
            : defaultCenter;

        const mapOptions = {
          center,
          zoom: 15,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          backgroundColor: "#f8fafc",
        };

        logDebug("🗺️ Creating map with options", mapOptions);

        const newMap = new window.google.maps.Map(container, mapOptions);
        setMap(newMap);

        newMap.addListener("idle", () => {
          if (componentMounted.current) {
            logDebug("✅ Map idle event fired");
            setMapInitialized(true);
            setInitError(null);
          }
        });

        newMap.addListener("error", (e) => {
          if (componentMounted.current) {
            logDebug("❌ Map error event", e);
            setMapError("Map encountered an error");
          }
        });

        if (center !== defaultCenter && leafIcon) {
          createMarker(newMap, center);
        }

        logDebug("✅ Map initialization complete");
      } catch (err) {
        logDebug("❌ Error initializing map", { error: err.message });
        setInitError(`Failed to initialize map: ${err.message}`);
      }
    };

    const timeoutId = setTimeout(initializeMap, 100);
    return () => clearTimeout(timeoutId);
  }, [isMapLoaded, mapInitialized, googleMapsError, leafIcon, selectedLocation, initialLocation]);

  // Initialize SearchBox
  useEffect(() => {
    if (!map || !searchInputRef.current || !isMapLoaded || !componentMounted.current) {
      logDebug("⏳ Skipping SearchBox initialization", {
        map: !!map,
        searchInputRef: !!searchInputRef.current,
        isMapLoaded,
        mounted: componentMounted.current,
      });
      return;
    }

    logDebug("🔍 Initializing SearchBox");
    try {
      searchBox.current = new window.google.maps.places.SearchBox(searchInputRef.current);
      searchBox.current.addListener("places_changed", () => {
        handleSearchPlaces();
      });
      searchBox.current.bindTo("bounds", map);

      return () => {
        if (searchBox.current) {
          window.google.maps.event.clearInstanceListeners(searchBox.current);
        }
      };
    } catch (err) {
      logDebug("❌ Error initializing SearchBox", { error: err.message });
      setMapError("Failed to initialize search functionality");
    }
  }, [map, isMapLoaded]);

  // Handle map panning to update marker and location
  useEffect(() => {
    if (!map || !marker || !leafIcon || !componentMounted.current) {
      logDebug("⏳ Skipping map center change listener setup", {
        map: !!map,
        marker: !!marker,
        leafIcon: !!leafIcon,
        mounted: componentMounted.current,
      });
      return;
    }

    logDebug("🗺️ Setting up map center change listener");
    const debouncedReverseGeocode = debounce((location) => reverseGeocode(location), 500);
    const centerChangedListener = map.addListener("center_changed", () => {
      if (!componentMounted.current) return;

      const newCenter = map.getCenter();
      const newLocation = {
        lat: newCenter.lat(),
        lng: newCenter.lng(),
      };

      logDebug("🗺️ Map panned, updating marker to new center", newLocation);

      marker.setPosition(newCenter);
      setSelectedLocation(newLocation);
      debouncedReverseGeocode(newLocation);
    });

    return () => {
      logDebug("🧹 Cleaning up map center change listener and debounce");
      window.google.maps.event.removeListener(centerChangedListener);
      debouncedReverseGeocode.cancel();
    };
  }, [map, marker, leafIcon]);

  // Get current location on mount
  useEffect(() => {
    if (!initialLocation && !selectedLocation && !mapError && isMapLoaded && leafIcon) {
      logDebug("🔍 Attempting to get current location on mount");
      handleUseCurrentLocation();
    }
  }, [initialLocation, selectedLocation, mapError, isMapLoaded, leafIcon]);

  // Create marker (fixed to center, non-draggable)
  const createMarker = (mapInstance, position) => {
    if (!componentMounted.current || !leafIcon || !mapInstance) {
      logDebug("❌ Cannot create marker: dependencies not ready", {
        mounted: componentMounted.current,
        leafIcon: !!leafIcon,
        mapInstance: !!mapInstance,
      });
      return;
    }

    logDebug("📍 Creating marker at", position);

    const newMarker = new window.google.maps.Marker({
      position,
      map: mapInstance,
      draggable: false,
      animation: window.google.maps.Animation.DROP,
      icon: leafIcon,
    });

    setMarker(newMarker);
    setSelectedLocation(position);
    reverseGeocode(position);
  };

  // Handle map click
  const handleMapClick = (event) => {
    if (!componentMounted.current || !map || !leafIcon) {
      logDebug("❌ Map click ignored:", {
        mounted: componentMounted.current,
        map: !!map,
        leafIcon: !!leafIcon,
      });
      return;
    }

    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    logDebug("🖱️ Map clicked, moving to", clickedLocation);

    map.setCenter(clickedLocation);
    if (marker) {
      marker.setPosition(clickedLocation);
    } else {
      createMarker(map, clickedLocation);
    }

    setSelectedLocation(clickedLocation);
    reverseGeocode(clickedLocation);
  };

  // Handle search places
  const handleSearchPlaces = () => {
    if (!componentMounted.current || !searchBox.current || !leafIcon || !map) {
      logDebug("❌ Search ignored:", {
        mounted: componentMounted.current,
        searchBox: !!searchBox.current,
        leafIcon: !!leafIcon,
        map: !!map,
      });
      return;
    }

    const places = searchBox.current.getPlaces();
    if (places?.length) {
      const place = places[0];
      if (place.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        logDebug("🔍 Search result selected", location);

        map.setCenter(location);
        if (marker) {
          marker.setPosition(location);
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => {
            if (marker && componentMounted.current) {
              marker.setAnimation(null);
            }
          }, 750);
        } else {
          createMarker(map, location);
        }

        let city = "";
        let state = "";
        let zipCode = "";
        let lag = location.lat;
        let lng = location.lng;

        if (place.address_components) {
          place.address_components.forEach((component) => {
            const types = component.types;
            if (types.includes("locality") || types.includes("sublocality")) {
              city = component.long_name;
            } else if (types.includes("administrative_area_level_1")) {
              state = component.long_name;
            } else if (types.includes("postal_code")) {
              zipCode = component.long_name;
            } else if (types.includes("street_number")) {
              lag = parseFloat(component.long_name);
            } else if (types.includes("route")) {
              lng = parseFloat(component.long_name);
            }
          });
        }

        setSelectedLocation(location);
        setAddress(place.formatted_address || "");
        setAddressComponents({ city, state, zipCode, lag, lng });
        if (onLocationSelect) {
          onLocationSelect(location, place.formatted_address || "", { city, state, zipCode, lag, lng });
        }
      }
    }
  };

  // Reverse geocode
  const reverseGeocode = (location) => {
    if (!geocoder.current || !componentMounted.current) {
      logDebug("❌ Geocoder not ready or component unmounted");
      return;
    }

    logDebug("🌍 Starting reverse geocoding for", location);

    geocoder.current.geocode({ location }, (results, status) => {
      if (!componentMounted.current) return;

      if (status === "OK" && results[0]) {
        const newAddress = results[0].formatted_address;
        let city = "";
        let state = "";
        let zipCode = "";
        let lag = location.lat;
        let lng = location.lng;

        results[0].address_components.forEach((component) => {
          const types = component.types;
          if (types.includes("locality") || types.includes("sublocality")) {
            city = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
          } else if (types.includes("postal_code")) {
            zipCode = component.long_name;
          } else if (types.includes("street_number")) {
            lag = parseFloat(component.long_name);
          } else if (types.includes("route")) {
            lng = parseFloat(component.long_name);
          }
        });

        logDebug("✅ Geocoded address", { address: newAddress, city, state, zipCode, lag, lng });

        setAddress(newAddress);
        setAddressComponents({ city, state, zipCode, lag, lng });
        if (onLocationSelect) {
          onLocationSelect(location, newAddress, { city, state, zipCode, lag, lng });
        }
      } else {
        const errorMsg = `Geocoder failed: ${status}`;
        logDebug("❌ Geocoder error", { status, results });
        setAddress("");
        setAddressComponents({ city: "", state: "", zipCode: "", lag: "", lng: "" });
        setMapError(errorMsg);
        if (onLocationSelect) {
          onLocationSelect(location, "", { city: "", state: "", zipCode: "", lag: "", lng: "" });
        }
      }
    });
  };

  // Use current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMapError("Geolocation is not supported by your browser");
      logDebug("❌ Geolocation not supported");
      return;
    }

    logDebug("🔍 Getting current location");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!componentMounted.current) return;

        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        logDebug("✅ Got current location", currentLocation);
        setSelectedLocation(currentLocation);

        if (map && leafIcon) {
          map.setCenter(currentLocation);
          if (marker) {
            marker.setPosition(currentLocation);
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => {
              if (marker && componentMounted.current) {
                marker.setAnimation(null);
              }
            }, 750);
          } else {
            createMarker(map, currentLocation);
          }
          reverseGeocode(currentLocation);
        }
      },
      (error) => {
        if (!componentMounted.current) return;

        logDebug("❌ Geolocation error", { code: error.code, message: error.message });
        let errorMessage = "Failed to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        setMapError(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  // Validate coordinate
  const isValidCoordinate = (coord) => {
    return typeof coord === "number" && !isNaN(coord) && isFinite(coord);
  };

  // Render error states
  if (mapErrorType === "BILLING_NOT_ENABLED") {
    return <SimpleBillingError onRetry={retryMap} />;
  }

  if (mapErrorType === "API_NOT_ACTIVATED") {
    return (
      <SimpleApiError
        message="Google Maps APIs are not enabled. Please enable Maps JavaScript API, Places API, and Geocoding API in Google Cloud Console."
        onRetry={retryMap}
      />
    );
  }

  if (mapErrorType === "MISSING_API_KEY") {
    return <SimpleApiError message="Google Maps API key is missing." onRetry={retryMap} />;
  }

  if (mapErrorType === "SCRIPT_LOAD_FAILED") {
    return <SimpleApiError message="Failed to load Google Maps script." onRetry={retryMap} />;
  }

  // Render component
  return (
    <SimpleErrorBoundary>
      <div className="space-y-2 w-full">
        {/* Search input */}
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for a location"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isMapLoading || !!googleMapsError || !!mapError || !!initError}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchPlaces();
              }
            }}
          />
          {isMapLoading && (
            <div className="absolute right-2 top-2">
              <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Map container */}
        <div
          ref={mapContainerRef}
          className="w-full h-[300px] rounded-md border border-gray-300 bg-slate-100 relative"
          style={{ zIndex: 1 }}
        >
          {(isMapLoading || initError) && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 pointer-events-none">
              <div className="text-center">
                <Loader className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {initError ? "Failed to initialize map" : "Loading map..."}
                </p>
              </div>
            </div>
          )}
          {(googleMapsError || mapError) && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10 p-4 pointer-events-auto">
              <div className="text-center max-w-md">
                <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
                <h3 className="mt-2 font-medium">Map Error</h3>
                <p className="mt-1 text-sm text-muted-foreground">{googleMapsError || mapError}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setMapError(null);
                    setInitError(null);
                    setMapInitialized(false);
                    retryMap();
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Current location button */}
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={handleUseCurrentLocation}
          disabled={isMapLoading || !!googleMapsError || !!mapError || !!initError}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Use My Current Location
        </Button>

        {/* Selected location info */}
        {selectedLocation && (
          <div className="bg-primary/10 p-2 rounded-md text-sm">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-primary inline mr-2 flex-shrink-0" />
              <span className="truncate">
                {address || `Coordinates: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
              </span>
            </div>
            {addressComponents.city || addressComponents.state || addressComponents.zipCode ? (
              <div className="mt-1 text-xs text-muted-foreground">
                {addressComponents.city && <span>City: {addressComponents.city} | </span>}
                {addressComponents.state && <span>State: {addressComponents.state} | </span>}
                {addressComponents.zipCode && <span>ZIP: {addressComponents.zipCode}</span>}
                {addressComponents.lag && addressComponents.lng ? (
                  <span className="ml-2">
                    Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        )}

        {/* Required warning */}
        {required && !selectedLocation && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Location Required</AlertTitle>
            <AlertDescription>Please select a location on the map for delivery.</AlertDescription>
          </Alert>
        )}
      </div>
    </SimpleErrorBoundary>
  );
};

export default CheckoutMapComponent;