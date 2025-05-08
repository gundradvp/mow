// Current implementation
updateClient: async (id, clientData) => {
  await apiClient.put(`/clients/${id}`, clientData);
  // Returns the input data, not necessarily what the server saved/returned
  return clientData;
},
// Current implementation
updateClient: async (id, clientData) => {
  await apiClient.put(`/clients/${id}`, clientData);
  // Returns the input data, not necessarily what the server saved/returned
  return clientData;
},
