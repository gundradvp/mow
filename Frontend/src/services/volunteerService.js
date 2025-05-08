import axios from "axios";

const BASE_URL = "/api";

/**
 * Service for handling volunteer-related API calls
 */
const volunteerService = {
  /**
   * Register a new volunteer
   * @param {Object} volunteerData - The volunteer registration data
   * @returns {Promise} - The API response
   */
  registerVolunteer: async (volunteerData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/Auth/register-volunteer`,
        volunteerData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || "Registration failed";
    }
  },

  /**
   * Login as a volunteer
   * @param {Object} credentials - The login credentials
   * @returns {Promise} - The API response with auth token and user data
   */
  login: async (credentials) => {
    try {
      const response = await axios.post(`${BASE_URL}/Auth/login`, credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || "Login failed";
    }
  },

  /**
   * Get volunteer profile by ID
   * @param {number} id - The volunteer ID
   * @returns {Promise} - The API response with volunteer data
   */
  getVolunteerById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/Volunteers/${id}`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || error.message || "Failed to retrieve volunteer"
      );
    }
  },

  /**
   * Update volunteer availability
   * @param {number} id - The volunteer ID
   * @param {Object} availabilityData - The availability data to update
   * @returns {Promise} - The API response
   */
  updateAvailability: async (id, availabilityData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/Volunteers/${id}/availability`,
        availabilityData
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || error.message || "Failed to update availability"
      );
    }
  },
};

export default volunteerService;
