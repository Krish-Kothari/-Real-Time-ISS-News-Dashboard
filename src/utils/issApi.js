import axios from 'axios';

// Use proxied API endpoints (serverless) to avoid mixed-content and CORS
const API_BASE = '/api';

export const issApi = {
  // Get current ISS location
  getCurrentLocation: async () => {
    try {
      const response = await axios.get(`${API_BASE}/iss-now`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ISS location (proxied):', error?.message || error);
      throw error;
    }
  },

  // Get number of people in space
  getPeopleInSpace: async () => {
    try {
      const response = await axios.get(`${API_BASE}/astros`);
      return response.data;
    } catch (error) {
      console.error('Error fetching people in space (proxied):', error?.message || error);
      throw error;
    }
  },

  // Get ISS passes over a location
  getPasses: async (lat, lon, n = 1) => {
    try {
      const response = await axios.get(`${API_BASE}/iss-passes`, {
        params: { lat, lon, n },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ISS passes (proxied):', error?.message || error);
      throw error;
    }
  },
};

export default issApi;
