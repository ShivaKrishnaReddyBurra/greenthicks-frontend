"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 17.385,
  lng: 78.4867,
};

export default function TestMapPage() {
  console.log("API Key:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Google Map</h1>
      <div className="map-container" style={{ width: "100%", height: "600px", backgroundColor: "#f0f0f0" }}>
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
          onLoad={() => console.log("Google Maps script loaded")}
          onError={(e) => console.error("Google Maps script failed to load:", e)}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            onLoad={() => console.log("Map rendered successfully")}
          >
            <Marker position={center} title="Test Marker" />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}