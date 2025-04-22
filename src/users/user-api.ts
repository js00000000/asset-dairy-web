// Domain-specific API functions for user/profile/auth actions
// Extracted from services/api.ts

import { User } from './user-types';
import { mockUsers } from '../data/mock-data';
import { USER_KEY } from '../lib/storage-helpers';

export async function fetchProfile(): Promise<User | null> {
  await new Promise(res => setTimeout(res, 300));
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  const parsed = JSON.parse(user);
  // Ensure investmentProfile is present if it exists
  return {
    ...parsed,
    investmentProfile: parsed.investmentProfile ?? undefined,
  };
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  await new Promise(res => setTimeout(res, 300));
  const current = localStorage.getItem(USER_KEY);
  const prev = JSON.parse(current || '{}');
  // Deep merge investmentProfile if present
  let updated = { ...prev, ...data };
  if (data.investmentProfile) {
    updated.investmentProfile = { ...prev.investmentProfile, ...data.investmentProfile };
  }
  localStorage.setItem(USER_KEY, JSON.stringify(updated));

  // --- Also update local_users array if user exists ---
  const localUsersRaw = localStorage.getItem('local_users');
  if (localUsersRaw) {
    let localUsers = JSON.parse(localUsersRaw);
    const idx = localUsers.findIndex((u: any) => u.id === updated.id);
    if (idx !== -1) {
      // Merge investmentProfile for the matched user
      localUsers[idx] = {
        ...localUsers[idx],
        ...data,
        investmentProfile: {
          ...localUsers[idx].investmentProfile,
          ...data.investmentProfile,
        },
      };
      localStorage.setItem('local_users', JSON.stringify(localUsers));
    }
  }
  // --- End local_users update ---

  return updated;
}

export async function login(email: string, password: string): Promise<User | null> {
  await new Promise(res => setTimeout(res, 500));
  // 1. Check mockUsers
  const allUsers = [...mockUsers];
  let user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user && user.password === password) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  }
  // 2. Check local users
  const localUsersRaw = localStorage.getItem('local_users');
  const localUsers: User[] = localUsersRaw ? JSON.parse(localUsersRaw) : [];
  user = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user && user.password === password) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  }
  return null;
}

export async function logout(): Promise<void> {
  await new Promise(res => setTimeout(res, 200));
  localStorage.removeItem(USER_KEY);
}

export async function signup(name: string, username: string, email: string, password: string): Promise<User> {
  await new Promise(res => setTimeout(res, 500));
  // Check mock users
  const allUsers = [...mockUsers];
  const existingMock = allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  if (existingMock) {
    throw new Error('User already exists');
  }
  // Check local users
  const localUsersRaw = localStorage.getItem('local_users');
  const localUsers: User[] = localUsersRaw ? JSON.parse(localUsersRaw) : [];
  const existingLocal = localUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  if (existingLocal) {
    throw new Error('User already exists');
  }
  // Create demo data for avatar
  const newUser: User = {
    id: `new-${Date.now()}`,
    name,
    username,
    email,
    password,
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: new Date().toISOString(),
  };
  // Save to local users array
  localStorage.setItem('local_users', JSON.stringify([...localUsers, newUser]));
  // Also set as current user
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  return newUser;
}

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
