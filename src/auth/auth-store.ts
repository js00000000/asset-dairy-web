import { create } from 'zustand';
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from './auth-api';
import { changePassword as apiChangePassword } from '../profile/profile-api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
    await apiLogout();
    set({ isAuthenticated: false });
  },
}));
