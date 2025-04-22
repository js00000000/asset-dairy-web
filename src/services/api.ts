// Mock API Service Layer for user/profile/account actions
// This layer simulates backend endpoints using localStorage and is easy to swap for real HTTP APIs later.

import { User } from '../users/user-types';
import { Account } from '../accounts/account-types';
import { mockUsers } from '../data/mock-data';
import { getCurrentUser, loadAccounts, saveAccounts, USER_KEY } from '../lib/storage-helpers';
// NOTE: All mock users must include a password field for password change to work.

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

export async function fetchAccounts(): Promise<Account[]> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) return [];
  const accounts = loadAccounts();
  return accounts.filter(acc => acc.ownerId === user.id);
}

export async function createAccount(account: Omit<Account, 'id'>): Promise<Account> {
  await new Promise(res => setTimeout(res, 400));
  const accounts = loadAccounts();
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const newAccount: Account = { ...account, id };
  accounts.push(newAccount);
  saveAccounts(accounts);
  return newAccount;
}

export async function updateAccount(id: string, data: Partial<Omit<Account, 'id'>>): Promise<Account> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const accounts = loadAccounts();
  const idx = accounts.findIndex(acc => acc.id === id);
  if (idx === -1) throw new Error('Account not found');
  if (accounts[idx].ownerId !== user.id) throw new Error('Cannot edit account you do not own');
  accounts[idx] = { ...accounts[idx], ...data };
  saveAccounts(accounts);
  return accounts[idx];
}

export async function deleteAccount(id: string): Promise<void> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const accounts = loadAccounts();
  const idx = accounts.findIndex(acc => acc.id === id);
  if (idx === -1) throw new Error('Account not found');
  if (accounts[idx].ownerId !== user.id) throw new Error('Cannot delete account you do not own');
  const newAccounts = accounts.filter(acc => acc.id !== id);
  saveAccounts(newAccounts);
}


export async function login(email: string, password: string): Promise<User | null> {
  await new Promise(res => setTimeout(res, 500));
  const allUsers = [...mockUsers];
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

export async function signup(name: string, username: string, email: string, password: string) {
  await new Promise(res => setTimeout(res, 500));
  const allUsers = [...mockUsers];
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
