import axios from 'axios';

const GEONAMES_USERNAME = import.meta.env.VITE_GEONAMES_USERNAME || '';

// Attempt reverse geocoding with several fallbacks and detect water bodies.
export const reverseGeocode = async (lat, lon) => {
  try {
    // Primary: Nominatim
    const nom = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        format: 'json',
        lat,
        lon,
        addressdetails: 1,
      },
      timeout: 10000,
    });

    const nomData = nom.data || {};
    const displayName = (nomData.display_name || '').trim();
    const address = nomData.address || {};
    const type = nomData.type || '';

    // Detect water keywords in displayName or type
    const waterKeywords = ['ocean', 'sea', 'gulf', 'bay', 'strait', 'channel', 'sound', 'lagoon', 'marine'];
    const lowerDisplay = displayName.toLowerCase();
    let isWater = false;
    let waterName = '';

    for (const kw of waterKeywords) {
      if (lowerDisplay.includes(kw)) {
        isWater = true;
        const parts = displayName.split(',').map((p) => p.trim());
        const found = parts.find((p) => p.toLowerCase().includes(kw));
        waterName = found || displayName;
        break;
      }
    }

    if (!isWater && ['sea', 'ocean', 'bay', 'gulf', 'strait'].includes(type)) {
      isWater = true;
      waterName = displayName;
    }

    // If Nominatim gives meaningful info, return it (prefer waterName)
    if (displayName) {
      return {
        place: address.county || address.city || address.town || address.village || address.state || displayName || 'Unknown',
        city: address.city || address.town || address.village || '',
        country: address.country || '',
        state: address.state || '',
        full: displayName || '',
        isWater,
        waterName,
      };
    }

    // Secondary: GeoNames ocean lookup (optional, requires VITE_GEONAMES_USERNAME)
    if (GEONAMES_USERNAME) {
      try {
        const geo = await axios.get('http://api.geonames.org/oceanJSON', {
          params: { lat, lng: lon, username: GEONAMES_USERNAME },
          timeout: 8000,
        });
        if (geo.data && geo.data.ocean && geo.data.ocean.name) {
          return {
            place: geo.data.ocean.name,
            city: '',
            country: '',
            state: '',
            full: geo.data.ocean.name,
            isWater: true,
            waterName: geo.data.ocean.name,
          };
        }
      } catch (err) {
        // ignore and continue to next fallback
        console.debug('GeoNames ocean lookup failed:', err?.message || err);
      }
    }

    // Tertiary: BigDataCloud reverse geocode (no API key) — may include 'ocean'
    try {
      const big = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
        params: { latitude: lat, longitude: lon, localityLanguage: 'en' },
        timeout: 8000,
      });
      const bigData = big.data || {};
      if (bigData && bigData.ocean) {
        return {
          place: bigData.ocean,
          city: bigData.locality || '',
          country: bigData.countryName || '',
          state: bigData.principalSubdivision || '',
          full: bigData.ocean,
          isWater: true,
          waterName: bigData.ocean,
        };
      }
      // if bigData has locality info, use it
      if (bigData && (bigData.locality || bigData.city || bigData.principalSubdivision)) {
        const place = bigData.locality || bigData.city || bigData.principalSubdivision;
        return {
          place,
          city: bigData.locality || '',
          country: bigData.countryName || '',
          state: bigData.principalSubdivision || '',
          full: bigData.locality || '',
          isWater: false,
          waterName: '',
        };
      }
    } catch (err) {
      console.debug('BigDataCloud lookup failed:', err?.message || err);
    }

    // Final fallback: return coordinates as place
    return {
      place: `Lat ${Number(lat).toFixed(2)}, Lon ${Number(lon).toFixed(2)}`,
      city: '',
      country: '',
      state: '',
      full: '',
      isWater: false,
      waterName: '',
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return { place: `Lat ${Number(lat).toFixed(2)}, Lon ${Number(lon).toFixed(2)}`, city: '', country: '', state: '', full: '', isWater: false, waterName: '' };
  }
};

// Mock some common locations for faster responses (fallback)
const commonLocations = {
  'ocean': { place: 'Ocean', city: 'Ocean', country: 'International Waters' },
  'atlantic': { place: 'Atlantic Ocean', city: 'Atlantic', country: 'International Waters' },
  'pacific': { place: 'Pacific Ocean', city: 'Pacific', country: 'International Waters' },
};

export default reverseGeocode;
