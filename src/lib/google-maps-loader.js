import { useEffect, useState } from "react";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function useGoogleMaps(libraries = []) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const loadGoogleMaps = () => {
    if (typeof window === "undefined") return; // SSR safety
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.onload = () => setIsLoaded(true);
      existingScript.onerror = () => setError("Google Maps failed to load");
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=${libraries.join(",")}`;
    script.async = true;
    script.defer = true;

    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError("Google Maps failed to load");

    document.head.appendChild(script);
  };

  useEffect(() => {
    loadGoogleMaps();
  }, []);

  return {
    isLoaded,
    error,
    retry: loadGoogleMaps,
  };
}
