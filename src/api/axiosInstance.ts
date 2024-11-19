// src/api/axiosInstance.ts

import axios from 'axios';
import { store } from '../app/store';
import { clearUser } from "../store/slices/authSlice"; // **Correctly import from authSlice**
import { setSessionExpired } from '../store/slices/sessionSlice'; 

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/`,  //  baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.user?.token; 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// **Single Response Interceptor Handling 401 Errors**
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized, set session as expired
      store.dispatch(setSessionExpired(true));
      // Additionally, clear user data
      store.dispatch(clearUser());
      // Optionally, redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
