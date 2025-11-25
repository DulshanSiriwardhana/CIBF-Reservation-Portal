export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/users/login`,
  REGISTER: `${API_BASE_URL}/api/users/register`,
  GET_PROFILE: `${API_BASE_URL}/api/users/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/users/profile`,
  LOGOUT: `${API_BASE_URL}/api/users/logout`,
  GET_USER_BY_ID: (userId) => `${API_BASE_URL}/api/users/${userId}`,
};

export const USER_ROLES = {
  VENDOR: 'VENDOR',
  EMPLOYEE: 'EMPLOYEE',
};