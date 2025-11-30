// src/lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-production-3c0b.up.railway.app/api/v1',
  //http://localhost:8080
  withCredentials: false,
});

// GỬI TOKEN TRONG MỌI REQUEST
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('Gửi token:', token.substring(0, 20) + '...'); // DEBUG
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;