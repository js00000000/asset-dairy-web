import { create } from 'zustand';
import { login as apiLogin, signup as apiSignup, changePassword as apiChangePassword } from './user-api';
import { USER_KEY, JWT_TOKEN } from '../lib/storage-helpers';
import { User } from './user-types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
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
      const updatedUser = await apiChangePassword(currentPassword, newPassword);
      set({ user: updatedUser, isLoading: false });
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
      const user = await apiLogin(email, password);
      if (!user) throw new Error('Invalid credentials');
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Login failed', isLoading: false });
    }
  },

  async signup(name: string, username: string, email: string, password: string) {
    set({ isLoading: true, error: null });
    try {
      const user = await apiSignup(name, username, email, password);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Signup failed', isLoading: false });
    }
  },

  async logout() {
    await import('./user-api').then(api => api.logout());
    set({ user: null, isAuthenticated: false });
  },

  async refreshAuth() {
    set({ isLoading: true, error: null });
    try {
      const { refreshAuth } = await import('./user-api');
      await refreshAuth();
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Token refresh failed', isLoading: false });
    }
  },

  updateUser(user: User) {
    set({ user });
  },
}));
