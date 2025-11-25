import api from './api';

export const stallService = {
  // Get all stalls
  getAllStalls: async () => {
    const response = await api.get('/stalls');
    return response.data;
  },

  // Get available stalls
  getAvailableStalls: async () => {
    const response = await api.get('/stalls/available');
    return response.data;
  },

  // Get stall by ID
  getStallById: async (id) => {
    const response = await api.get(`/stalls/${id}`);
    return response.data;
  },

  // Get stalls by size
  getStallsBySize: async (size) => {
    const response = await api.get(`/stalls/size/${size}`);
    return response.data;
  },

  // Get stalls by price range
  getStallsByPriceRange: async (minPrice, maxPrice) => {
    const response = await api.get(`/stalls/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    return response.data;
  },

  // Check stall availability
  checkAvailability: async (stallId) => {
    const response = await api.get(`/stalls/${stallId}/availability`);
    return response.data;
  },

  // Reserve stall
  reserveStall: async (stallId, userId, reservationId) => {
    const response = await api.post(`/stalls/${stallId}/reserve?userId=${userId}&reservationId=${reservationId}`);
    return response.data;
  },

  // Release stall
  releaseStall: async (stallId) => {
    const response = await api.post(`/stalls/${stallId}/release`);
    return response.data;
  },

  // Get user's stalls
  getUserStalls: async (userId) => {
    const response = await api.get(`/stalls/user/${userId}`);
    return response.data;
  },

  // Check if user can reserve more
  canUserReserveMore: async (userId) => {
    const response = await api.get(`/stalls/user/${userId}/can-reserve`);
    return response.data;
  },

  // Create stall (admin)
  createStall: async (stallData) => {
    const response = await api.post('/stalls', stallData);
    return response.data;
  },

  // Update stall (admin)
  updateStall: async (id, stallData) => {
    const response = await api.put(`/stalls/${id}`, stallData);
    return response.data;
  },

  // Delete stall (admin)
  deleteStall: async (id) => {
    const response = await api.delete(`/stalls/${id}`);
    return response.data;
  },
};
