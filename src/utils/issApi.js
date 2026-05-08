import axios from 'axios';

const ISS_API_BASE = 'http://api.open-notify.org';

export const issApi = {
  // Get current ISS location
  getCurrentLocation: async () => {
    try {
      const response = await axios.get(`${ISS_API_BASE}/iss-now.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ISS location:', error);
      throw error;
    }
  },

  // Get number of people in space
  getPeopleInSpace: async () => {
    try {
      const response = await axios.get(`${ISS_API_BASE}/astros.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching people in space:', error);
      throw error;
    }
  },

  // Get ISS passes over a location
  getPasses: async (lat, lon, n = 1) => {
    try {
      const response = await axios.get(
        `${ISS_API_BASE}/iss-passes.json?lat=${lat}&lon=${lon}&n=${n}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching ISS passes:', error);
      throw error;
    }
  },
};

export default issApi;
