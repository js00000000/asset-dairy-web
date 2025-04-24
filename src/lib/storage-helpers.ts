import { Account } from '../accounts/account-types';
import { User } from '../profile/user-types';

export const USER_KEY = 'user';
export const JWT_TOKEN = 'jwt_token';
export const ACCOUNTS_KEY = 'accounts';

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function loadAccounts(): Account[] {
  const local = localStorage.getItem(ACCOUNTS_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // No fallback mock data
      return [];
    }
  }
  // No fallback mock data
  return [];
}

export function saveAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}
