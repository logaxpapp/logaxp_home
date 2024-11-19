// import axios from 'axios';
// import { store } from '../app/store';
// import { clearUser } from "../store/slices/authSlice"; // Correctly import from authSlice
// import { setSessionExpired } from '../store/slices/sessionSlice';

// // Create an Axios instance
// const axiosInstance = axios.create({
//   baseURL: `${import.meta.env.VITE_BASE_URL}/api/`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // Required for sending cookies
// });

// // Request interceptor to add auth token and CSRF token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const state = store.getState();
//     const token = state.auth.user?.token; // Retrieve auth token
//     const csrfToken = state.csrf.csrfToken; // Retrieve CSRF token

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     if (csrfToken) {
//       config.headers['X-CSRF-Token'] = csrfToken; // Attach CSRF token to headers
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for handling errors
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Handle unauthorized errors
//       store.dispatch(setSessionExpired(true));
//       store.dispatch(clearUser());
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
