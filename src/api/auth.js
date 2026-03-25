// src/api/auth.js
import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials)
};