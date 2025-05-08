import apiClient from "./api-client";

const DeliveryRoutesService = {
  /**
   * Get all delivery routes, including client counts
   * @returns {Promise<Array>} Array of route objects
   */
  getAllRoutes: async () => {
    const response = await apiClient.get("/deliveryroutes/details");
    return response.data;
  },

  /**
   * Get a specific delivery route by id
   * @param {number} id - The route id
   * @returns {Promise<Object>} Route object
   */
  getRouteById: async (id) => {
    const response = await apiClient.get(`/deliveryroutes/${id}`);
    return response.data;
  },

  /**
   * Create a new delivery route
   * @param {Object} routeData - The route data
   * @returns {Promise<Object>} Created route object
   */
  createRoute: async (routeData) => {
    const response = await apiClient.post("/deliveryroutes", routeData);
    return response.data;
  },

  /**
   * Update an existing delivery route
   * @param {number} id - The route id
   * @param {Object} routeData - The updated route data
   * @returns {Promise<Object>} Updated route object
   */
  updateRoute: async (id, routeData) => {
    await apiClient.put(`/deliveryroutes/${id}`, routeData);
    return routeData;
  },

  /**
   * Toggle a route's active status
   * @param {number} id - The route id
   * @param {Object} route - The route object
   * @returns {Promise<Object>} Updated route object
   */
  toggleRouteStatus: async (id, route) => {
    const updatedRoute = {
      ...route,
      isActive: !route.isActive,
    };
    await apiClient.put(`/deliveryroutes/${id}`, updatedRoute);
    return updatedRoute;
  },

  /**
   * Delete a delivery route (soft delete by marking as inactive)
   * @param {number} id - The route id
   * @returns {Promise<void>}
   */
  deleteRoute: async (id) => {
    await apiClient.delete(`/deliveryroutes/${id}`);
  },

  /**
   * Get count of clients assigned to a route
   * @param {number} id - The route id
   * @returns {Promise<number>} Count of clients
   */
  getRouteClientCount: async (id) => {
    const response = await apiClient.get(`/deliveryroutes/${id}/clientcount`);
    return response.data.count;
  },
};

export default DeliveryRoutesService;
