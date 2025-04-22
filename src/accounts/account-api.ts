/**
 * Domain-specific API functions for account actions
 * Extracted from services/api.ts
 */

import { Account } from './account-types';
import { getCurrentUser, loadAccounts, saveAccounts } from '../lib/storage-helpers';

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
  accounts.splice(idx, 1);
  saveAccounts(accounts);
}
