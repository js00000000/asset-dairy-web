import { create } from 'zustand';
import { login as apiLogin, signup as apiSignup } from '../../services/api';
import { User } from '../../types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, username: string, email: string, password: string, role: 'buyer' | 'seller') => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  async changePassword(currentPassword: string, newPassword: string) {
    set({ isLoading: true, error: null });
    try {
      // Dynamically import to avoid circular dependency
      const { changePassword } = await import('../../services/api');
      const updatedUser = await changePassword(currentPassword, newPassword);
      set({ user: updatedUser, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to change password',
        isLoading: false
      });
      throw error;
    }
  },

  updateUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await apiLogin(email, password);
      if (!user) {
        throw new Error('Invalid email or password');
      }
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      });
    }
  },
  
  signup: async (name: string, username: string, email: string, password: string, role: 'buyer' | 'seller') => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await apiSignup(name, username, email, password, role);
      set({ user: newUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },
  
  logout: () => {
    // Clear user data
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
}));

// Initialize auth state from localStorage
export const initAuthStore = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser) as User;
      useAuthStore.setState({ user, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('user');
    }
  }
};
