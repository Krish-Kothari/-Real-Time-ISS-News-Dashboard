// Haversine formula to calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Calculate speed in km/h based on distance and time
export const calculateSpeed = (distance, timeSeconds) => {
  if (timeSeconds === 0) return 0;
  const hours = timeSeconds / 3600;
  return Number((distance / hours).toFixed(2));
};

// Format coordinates
export const formatCoordinates = (lat, lon) => {
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
};

// Format distance
export const formatDistance = (distance) => {
  return `${distance.toFixed(2)} km`;
};

// Get cardinal direction from degrees
export const getDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                     'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};
