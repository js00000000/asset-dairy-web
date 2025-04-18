import { create } from 'zustand';
import { mockBuyers, mockSellers } from '../data/mock-data';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'buyer' | 'seller') => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to verify credentials
      const allUsers = [...mockBuyers, ...mockSellers];
      const user = allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Password check would happen server-side in a real app
      // For demo purposes, any password works
      
      set({ user, isAuthenticated: true, isLoading: false });
      // Store in localStorage (in a real app, store a token instead)
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },
  
  signup: async (name: string, email: string, password: string, role: 'buyer' | 'seller') => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to create a new user
      const allUsers = [...mockBuyers, ...mockSellers];
      const existingUser = allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      // Create a new user (in a real app, this would be done on the server)
      const newUser: User = {
        id: `new-${Date.now()}`,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      };
      
      set({ user: newUser, isAuthenticated: true, isLoading: false });
      // Store in localStorage (in a real app, store a token instead)
      localStorage.setItem('user', JSON.stringify(newUser));
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