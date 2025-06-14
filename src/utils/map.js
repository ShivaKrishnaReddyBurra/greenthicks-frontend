export function initializeMap() {
  const mapContainer = document.getElementById("map-container");
  if (!mapContainer) throw new Error("Map container not found");

  const map = new window.google.maps.Map(mapContainer, {
    center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
    zoom: 12,
  });

  return map;
}
