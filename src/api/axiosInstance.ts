// src/api/axiosInstance.ts

import axios from 'axios';
import { store } from '../app/store';
import { clearUser } from "../store/slices/userSlice"; // Correctly import the clearUser action

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/', // Replace with your API's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.token; // Adjust based on your user state structure
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized, logout the user
      store.dispatch(clearUser());
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized, logout the user
      store.dispatch(clearUser());
      // Optionally, redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
