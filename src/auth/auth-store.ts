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
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isHydrated: false,

  async checkAuth() {
    set({ isHydrated: true, isLoading: true, error: null });
    try {
      if (!isAccessTokenValid()) {
        const newToken = await refreshAccessToken();
        localStorage.setItem(ACCESS_TOKEN, newToken);
      }
      set({ isAuthenticated: true, isLoading: false });
    } catch (error) {
      await this.logout();
      set({ isLoading: false, error: (error as Error).message || 'Failed to refresh access token' });
    }
  },

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

  async logout() {
    set({ isAuthenticated: false });
    await apiLogout();
  },

}));

function isAccessTokenValid() {
  const token = localStorage.getItem(ACCESS_TOKEN);
  return !!token && !isJwtExpired(token);
}

async function refreshAccessToken(): Promise<string> {
  const newToken = await apiRefreshAccessToken();
  if (newToken) {
    return newToken;
  }
  throw new Error('Failed to refresh access token. Please log in again.');
}