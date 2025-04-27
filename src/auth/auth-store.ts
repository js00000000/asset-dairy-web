import { create } from 'zustand';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, refreshAccessToken as apiRefreshAccessToken } from './auth-api';
import { changePassword as apiChangePassword } from '../profile/profile-api';
import { ACCESS_TOKEN } from '../lib/storage-helpers';
import { isJwtExpired } from '../lib/jwt-utils';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isAccessTokenValid: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isHydrated: false,

  async changePassword(currentPassword: string, newPassword: string) {
    set({ isLoading: true, error: null });
    try {
      await apiChangePassword(currentPassword, newPassword);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Password change failed',
        isLoading: false,
      });
    }
  },

  async login(email: string, password: string) {
    set({ isLoading: true, error: null });
    try {
      await apiLogin(email, password);
      set({ isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Login failed', isLoading: false });
    }
  },

  async signup(name: string, username: string, email: string, password: string) {
    set({ isLoading: true, error: null });
    try {
      await apiSignup(name, username, email, password);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Signup failed', isLoading: false });
    }
  },

  async refreshAccessToken() {
    try {
      const newToken = await apiRefreshAccessToken();
      if (newToken) {
        localStorage.setItem(ACCESS_TOKEN, newToken);
        set({ isAuthenticated: true });
      } else {
        throw new Error('Failed to refresh access token. Please log in again.');
      }
    } catch (err) {
      throw new Error('Failed to refresh access token. Please log in again.');
    }
  },

  async logout() {
    await apiLogout();
    set({ isAuthenticated: false });
  },

  isAccessTokenValid() {
    const token = localStorage.getItem(ACCESS_TOKEN);
    return !!token && !isJwtExpired(token);
  },
}));
