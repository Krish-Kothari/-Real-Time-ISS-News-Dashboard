import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useISSStore } from '../../utils/store.js';
import { issApi } from '../../utils/issApi.js';
import { calculateDistance, calculateSpeed, formatCoordinates } from '../../utils/calculations.js';
import { reverseGeocode } from '../../utils/geocoding.js';
import { RotateCcw } from 'lucide-react';

// Custom ISS marker icon
const issIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSI4IiBmaWxsPSIjMDA2MmZmIi8+PHBhdGggZD0iTTI0IDZMMzAgMjRIMThaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -10],
});

export const ISSTracker = () => {
  const {
    location,
    speed,
    lastPositions,
    peopleInSpace,
    totalPeople,
    currentLocationName,
    setLocation,
    setSpeed,
    setLastPositions,
    setPeopleInSpace,
    setTotalPeople,
    setLocationName,
    addPosition,
  } = useISSStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const prevRef = React.useRef(null);

  // Fetch ISS location and people in space
  const fetchISSData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current ISS location
      const issData = await issApi.getCurrentLocation();
      const newLat = issData.iss_position.latitude;
      const newLon = issData.iss_position.longitude;

      // Coerce to numbers
      const latNum = Number(newLat);
      const lonNum = Number(newLon);

      // Debug logging for speed calculation
      console.debug('Previous location (store):', location);
      console.debug('New coords from API:', { latNum, lonNum });

      // Calculate speed using an internal previous position ref (avoids race with store updates)
      const prev = prevRef.current;
      if (prev && typeof prev.lat === 'number' && typeof prev.lon === 'number') {
        const distance = calculateDistance(prev.lat, prev.lon, latNum, lonNum);
        const timeSeconds = (Date.now() - (prev.timestamp || Date.now())) / 1000;
        const speedKmh = timeSeconds > 0 ? Number(calculateSpeed(distance, timeSeconds)) : 0;
        console.debug('PrevRef:', prev, 'Distance (km):', distance, 'Time (s):', timeSeconds, 'Speed (km/h):', speedKmh);
        setSpeed(Number.isFinite(speedKmh) ? speedKmh : 0);
      }

      // Update location (store will coerce again, but ensure numbers here)
      setLocation(latNum, lonNum);
      addPosition(latNum, lonNum);

      // Get location name (prefer water name when over ocean/sea, else use place)
      const locationData = await reverseGeocode(latNum, lonNum);
      if (locationData) {
        if (locationData.isWater && locationData.waterName) {
          setLocationName(`Over ${locationData.waterName}`);
        } else if (locationData.place && locationData.place !== 'Unknown') {
          setLocationName(locationData.place);
        } else if (locationData.full && locationData.full !== 'Unknown Location') {
          setLocationName(locationData.full);
        } else {
          // Fallback to coordinates when nothing descriptive is available
          setLocationName(`${latNum.toFixed(2)}, ${lonNum.toFixed(2)}`);
        }
      } else {
        setLocationName(`${latNum.toFixed(2)}, ${lonNum.toFixed(2)}`);
      }

      setLastUpdateTime(new Date());

      // Fetch people in space (less frequent)
      if (!lastUpdateTime || Date.now() - lastUpdateTime > 60000) {
        const peopleData = await issApi.getPeopleInSpace();
        setTotalPeople(peopleData.number);
        setPeopleInSpace(peopleData.people || []);
      }
      // update prevRef after successful fetch
      prevRef.current = { lat: latNum, lon: lonNum, timestamp: Date.now() };
    } catch (err) {
      setError('Failed to fetch ISS data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-update every 15 seconds
  useEffect(() => {
    fetchISSData();
    const interval = setInterval(fetchISSData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Map coordinates for polyline
  const polylineCoordinates = lastPositions.map((pos) => [pos.lat, pos.lon]);

  // Normalize location values for display and map
  const latVal = Number(location && location.latitude);
  const lonVal = Number(location && location.longitude);
  const hasValidCoords = Number.isFinite(latVal) && Number.isFinite(lonVal) && (latVal !== 0 || lonVal !== 0);

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">Latitude</div>
          <div className="text-2xl font-bold">{hasValidCoords ? latVal.toFixed(4) : '0.0000'}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">Longitude</div>
          <div className="text-2xl font-bold">{hasValidCoords ? lonVal.toFixed(4) : '0.0000'}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">Speed (km/h)</div>
          <div className="text-2xl font-bold">{speed}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">Location</div>
          <div className="text-lg font-semibold truncate">{currentLocationName}</div>
        </div>
      </div>

      {/* People in Space */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold mb-3">People in Space: {totalPeople}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {peopleInSpace.length > 0 ? (
            peopleInSpace.map((person, idx) => (
              <div key={idx} className="bg-slate-100 dark:bg-slate-700 p-2 rounded">
                <div className="font-medium">{person.name}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{person.craft}</div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-slate-600 dark:text-slate-400">
              Loading astronaut information...
            </div>
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex gap-2">
        <button
          onClick={fetchISSData}
          disabled={loading}
          className="btn btn-primary"
        >
          <RotateCcw size={20} />
          {loading ? 'Updating...' : 'Refresh'}
        </button>
        <div className="flex-1 flex items-center justify-end text-sm text-slate-600 dark:text-slate-400">
          Last updated: {lastUpdateTime ? lastUpdateTime.toLocaleTimeString() : 'Never'}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Map */}
      <div className="card overflow-hidden" style={{ height: '400px' }}>
        <MapContainer
          center={[hasValidCoords ? latVal : 0, hasValidCoords ? lonVal : 0]}
          zoom={3}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* ISS Marker */}
          {hasValidCoords && (
            <Marker position={[latVal, lonVal]} icon={issIcon}>
              <Popup>
                <div className="text-sm">
                  <div className="font-bold mb-2">ISS Location</div>
                  <div>Lat: {hasValidCoords ? latVal.toFixed(4) : '0.0000'}</div>
                  <div>Lon: {hasValidCoords ? lonVal.toFixed(4) : '0.0000'}</div>
                  <div>Speed: {speed} km/h</div>
                  <div>Location: {currentLocationName}</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Trajectory */}
          {polylineCoordinates.length > 1 && (
            <Polyline positions={polylineCoordinates} color="blue" weight={2} />
          )}
        </MapContainer>
      </div>

      {/* Positions Tracked */}
      <div className="card p-4">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Positions Tracked: {lastPositions.length} / 15
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(lastPositions.length / 15) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ISSTracker;
