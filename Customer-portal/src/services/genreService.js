import axios from 'axios';

const GENRE_API_URL = 'http://localhost:8082/api/genres';

const api = axios.create({
  baseURL: GENRE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const genreService = {
  
  getGenres: async () => {
    const response = await api.get('/names');
    return response.data;
  },

  // Get genre names by exhibitor ID
  getGenresById: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

   // Get genre names by exhibitor ID
  addGenreToUser: async (exhibitorId, genreId) => {
    const response = await api.post(`/${exhibitorId}/${genreId}`);
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
};