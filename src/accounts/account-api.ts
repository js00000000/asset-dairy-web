/**
 * Domain-specific API functions for account actions
 * Extracted from services/api.ts
 */

import { Account } from './account-types';
import { authGet, authPost, authPut, authDelete } from '../users/user-api';

export async function fetchAccounts(): Promise<Account[]> {
  const res = await authGet('/accounts');
  if (!res.ok) {
    throw new Error('Failed to fetch accounts');
  }
  return await res.json();
}

export async function createAccount(account: Omit<Account, 'id'>): Promise<Account> {
  const res = await authPost('/accounts', account);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create account');
  }
  return await res.json();
}


export async function updateAccount(id: string, data: Partial<Omit<Account, 'id'>>): Promise<Account> {
  const res = await authPut(`/accounts/${id}`, data);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to update account');
  }
  return await res.json();
}

export async function deleteAccount(id: string): Promise<void> {
  const res = await authDelete(`/accounts/${id}`);
  if (!res.ok && res.status !== 204) {
    const err = await res.text();
    throw new Error(err || 'Failed to delete account');
  }
}

