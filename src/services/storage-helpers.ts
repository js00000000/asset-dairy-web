import { Account } from '../types/account';
import { User } from '../types/user';
import { mockAccounts } from '../data/mock-accounts';

export const USER_KEY = 'user';
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
      return [...mockAccounts];
    }
  }
  return [...mockAccounts];
}

export function saveAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}
