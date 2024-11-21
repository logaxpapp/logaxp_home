import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { store } from '../app/store';
import { clearUser } from '../store/slices/authSlice';
import { setSessionExpired } from '../store/slices/sessionSlice';
import { setCsrfToken } from '../store/slices/csrfSlice';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for sending cookies
});

// Request interceptor to add auth token and CSRF token
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.user?.token; // Retrieve auth token
    let csrfToken = state.csrf?.csrfToken; // Retrieve CSRF token

    if (!csrfToken) {
      try {
        const response = await axiosInstance.get('/csrf-token');
        csrfToken = response.data.csrfToken;
        if (csrfToken) {
          store.dispatch(setCsrfToken(csrfToken)); // Store CSRF token in Redux
        }
      } catch (err) {
        console.error('Failed to fetch CSRF token', err);
      }
    }

    if (config.headers) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }

    // Debug: Log the headers to verify the CSRF token and Authorization header
    console.log('Request Headers:', {
      ...config.headers,
      'X-CSRF-Token': csrfToken,
      Authorization: token ? `Bearer ${token}` : undefined,
    });

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);


// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors
      store.dispatch(setSessionExpired(true));
      store.dispatch(clearUser());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;





// // src/api/axiosInstance.ts

// import axios from 'axios';
// import { store } from '../app/store';
// import { clearUser } from "../store/slices/authSlice"; // **Correctly import from authSlice**
// import { setSessionExpired } from '../store/slices/sessionSlice'; 

// // Create an Axios instance
// const axiosInstance = axios.create({
//   baseURL: `${import.meta.env.VITE_BASE_URL}/api/`,  //  baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const state = store.getState();
//     const token = state.auth.user?.token; 
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // **Single Response Interceptor Handling 401 Errors**
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Unauthorized, set session as expired
//       store.dispatch(setSessionExpired(true));
//       // Additionally, clear user data
//       store.dispatch(clearUser());
//       // Optionally, redirect to login
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
