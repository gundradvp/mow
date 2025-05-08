import apiClient from "./api-client";

const VolunteerService = {
  /**
   * Get all volunteers
   * @returns {Promise<Array>} Array of volunteer objects
   */
  getAllVolunteers: async () => {
    const response = await apiClient.get("/volunteers");
    return response.data;
  },

  /**
   * Get volunteers with pagination
   * @param {number} page - The page number
   * @param {number} pageSize - The page size
   * @returns {Promise<Object>} Object containing volunteers and pagination info
   */
  getPagedVolunteers: async (page, pageSize) => {
    const response = await apiClient.get(
      `/volunteers?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  /**
   * Get a specific volunteer by id
   * @param {number} id - The volunteer id
   * @returns {Promise<Object>} Volunteer object
   */
  getVolunteerById: async (id) => {
    const response = await apiClient.get(`/volunteers/${id}`);
    return response.data;
  },

  /**
   * Create a new volunteer
   * @param {Object} volunteerData - The volunteer data
   * @returns {Promise<Object>} Created volunteer object
   */
  createVolunteer: async (volunteerData) => {
    const response = await apiClient.post("/volunteers", volunteerData);
    return response.data;
  },

  /**
   * Update an existing volunteer
   * @param {number} id - The volunteer id
   * @param {Object} volunteerData - The updated volunteer data
   * @returns {Promise<Object>} Updated volunteer object
   */
  updateVolunteer: async (id, volunteerData) => {
    await apiClient.put(`/volunteers/${id}`, volunteerData);
    return volunteerData;
  },

  /**
   * Delete a volunteer
   * @param {number} id - The volunteer id
   * @returns {Promise<void>}
   */
  deleteVolunteer: async (id) => {
    await apiClient.delete(`/volunteers/${id}`);
  },

  /**
   * Get available volunteers for a specific date and time range
   * @param {string} date - The date in ISO string format
   * @param {string} startTime - Start time
   * @param {string} endTime - End time
   * @returns {Promise<Array>} Array of available volunteer objects
   */
  getAvailableVolunteers: async (date, startTime, endTime) => {
    const response = await apiClient.get(
      `/volunteers/available?date=${date}&startTime=${startTime}&endTime=${endTime}`
    );
    return response.data;
  },
};

export default VolunteerService;
