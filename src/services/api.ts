// Mock API Service Layer for user/profile/account actions
// This layer simulates backend endpoints using localStorage and is easy to swap for real HTTP APIs later.

import { User } from '../types/user';
import { mockBuyers, mockSellers } from '../data/mock-data';
// NOTE: All mock users must include a password field for password change to work.

const USER_KEY = 'user';

export async function fetchProfile(): Promise<User | null> {
  await new Promise(res => setTimeout(res, 300));
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  await new Promise(res => setTimeout(res, 300));
  const current = localStorage.getItem(USER_KEY);
  const updated = { ...JSON.parse(current || '{}'), ...data };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
}

export async function login(email: string, password: string): Promise<User | null> {
  await new Promise(res => setTimeout(res, 500));
  const allUsers = [...mockBuyers, ...mockSellers];
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  // Password check (mock/local only)
  if (!user.password || user.password !== password) {
    return null;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function logout() {
  await new Promise(res => setTimeout(res, 200));
  localStorage.removeItem(USER_KEY);
}

export async function signup(name: string, username: string, email: string, password: string, role: 'buyer' | 'seller') {
  await new Promise(res => setTimeout(res, 500));
  const allUsers = [...mockBuyers, ...mockSellers];
  const existingUser = allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    throw new Error('Email already in use');
  }
  // Create demo data for avatar
  const newUser: User = {
    id: `new-${Date.now()}`,
    name,
    username,
    email,
    role,
    password,
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem('user', JSON.stringify(newUser));
  return newUser;
}

// Change password mock endpoint
export async function changePassword(currentPassword: string, newPassword: string): Promise<User> {
  await new Promise(res => setTimeout(res, 400));
  const userRaw = localStorage.getItem(USER_KEY);
  if (!userRaw) throw new Error('Not authenticated');
  const user = JSON.parse(userRaw);
  if (!user.password || user.password !== currentPassword) {
    throw new Error('Current password is incorrect');
  }
  const updated = { ...user, password: newPassword };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
}

// Add more mock endpoints as needed (e.g., password change, avatar upload)
