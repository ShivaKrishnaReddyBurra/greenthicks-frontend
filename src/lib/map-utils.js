/**
 * Utility functions for working with maps and locations
 */

// Calculate distance between two points using the Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

// Convert degrees to radians
const deg2rad = (deg) => {
  return deg * (Math.PI / 180)
}

// Check if a point is inside a polygon
const isPointInPolygon = (point, polygon) => {
  // Ray casting algorithm
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0],
      yi = polygon[i][1]
    const xj = polygon[j][0],
      yj = polygon[j][1]

    const intersect = yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi

    if (intersect) inside = !inside
  }

  return inside
}

// Format coordinates for display
const formatCoordinates = (lat, lng) => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}

// Get center point of multiple coordinates
const getCenterPoint = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return null
  }

  let totalLat = 0
  let totalLng = 0

  coordinates.forEach((coord) => {
    totalLat += coord.lat || coord[0]
    totalLng += coord.lng || coord[1]
  })

  return {
    lat: totalLat / coordinates.length,
    lng: totalLng / coordinates.length,
  }
}

// Convert polygon array to GeoJSON format
const polygonToGeoJSON = (polygon) => {
  // Ensure the polygon is closed (first point equals last point)
  const coordinates = [...polygon]
  if (
    coordinates.length > 0 &&
    (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
      coordinates[0][1] !== coordinates[coordinates.length - 1][1])
  ) {
    coordinates.push([coordinates[0][0], coordinates[0][1]])
  }

  return {
    type: "Polygon",
    coordinates: [coordinates],
  }
}

// Debug function to log map-related issues
const debugMapIssue = (message, data = {}) => {
  console.log(`🗺️ MAP DEBUG: ${message}`, data)

  // Only log detailed info in development
  if (process.env.NODE_ENV === "development") {
    console.log("Map Debug Details:", {
      timestamp: new Date().toISOString(),
      ...data,
    })
  }

  return {
    message,
    timestamp: new Date().toISOString(),
    ...data,
  }
}

module.exports = {
  calculateDistance,
  isPointInPolygon,
  formatCoordinates,
  getCenterPoint,
  polygonToGeoJSON,
  debugMapIssue,
}
