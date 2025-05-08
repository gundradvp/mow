import apiClient from "./api-client";

const ClientService = {
  /**
   * Get all clients
   * @returns {Promise<Array>} Array of client objects
   */
  getAllClients: async () => {
    const response = await apiClient.get("/clients");
    return response.data;
  },

  /**
   * Get clients with pagination
   * @param {number} page - The page number
   * @param {number} pageSize - The page size
   * @returns {Promise<Object>} Object containing clients and pagination info
   */
  getPagedClients: async (page, pageSize) => {
    const response = await apiClient.get(
      `/clients/paged?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  /**
   * Get a specific client by id
   * @param {number} id - The client id
   * @returns {Promise<Object>} Client object
   */
  getClientById: async (id) => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  },

  /**
   * Create a new client
   * @param {Object} clientData - The client data
   * @returns {Promise<Object>} Created client object
   */
  createClient: async (clientData) => {
    const response = await apiClient.post("/clients", clientData);
    return response.data;
  },

  /**
   * Update an existing client
   * @param {number} id - The client id
   * @param {Object} clientData - The updated client data
   * @returns {Promise<Object>} Updated client object
   */
  updateClient: async (id, clientData) => {
    const response = await apiClient.put(`/clients/${id}`, clientData);
    // Return the actual data from the API response
    return response.data;
  },

  /**
   * Delete a client
   * @param {number} id - The client id
   * @returns {Promise<void>}
   */
  deleteClient: async (id) => {
    await apiClient.delete(`/clients/${id}`);
  },

  /**
   * Get clients by route id
   * @param {number} routeId - The route id
   * @returns {Promise<Array>} Array of client objects
   */
  getClientsByRoute: async (routeId) => {
    const response = await apiClient.get(`/clients/byroute/${routeId}`);
    return response.data;
  },
};

export default ClientService;
