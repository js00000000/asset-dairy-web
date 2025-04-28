import axios, { AxiosInstance } from 'axios';
import { ACCESS_TOKEN } from '@/lib/storage-helpers';

/**
 * Factory to create Axios instances with or without auth interceptors.
 * @param withAuth Whether to attach auth token and refresh logic.
 */
export function createApiInstance(withAuth: boolean = true): AxiosInstance {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  });

  if (withAuth) {
    // Request interceptor: Add auth token from localStorage
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: Global error handling
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
              {},
              {
                withCredentials: true,
              }
            );
            const newToken = refreshResponse.data.token;
            localStorage.setItem(ACCESS_TOKEN, newToken);
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return instance(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem(ACCESS_TOKEN);
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  return instance;
}

// Default: with auth
const api = createApiInstance(true);
// No-auth instance for login/signup
export const apiNoAuth = createApiInstance(false);

export default api;