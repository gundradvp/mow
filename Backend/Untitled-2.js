// Suggested change (if API returns the updated client object)
updateClient: async (id, clientData) => {
  const response = await apiClient.put(`/clients/${id}`, clientData);
  // Return the actual data from the API response
  return response.data;
}


