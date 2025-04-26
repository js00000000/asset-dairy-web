/**
 * Domain-specific API functions for account actions
 * Extracted from services/api.ts
 */

import { Account } from './account-types';
import api from '../lib/api';

export async function fetchAccounts(): Promise<Account[]> {
  try {
    const res = await api.get<Account[]>('/accounts');
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch accounts');
  }
}

export async function createAccount(account: Omit<Account, 'id'>): Promise<Account> {
  try {
    const res = await api.post<Account>('/accounts', account);
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to create account');
  }
}


export async function updateAccount(id: string, data: Partial<Omit<Account, 'id'>>): Promise<Account> {
  try {
    const res = await api.put<Account>(`/accounts/${id}`, data);
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to update account');
  }
}

export async function deleteAccount(id: string): Promise<void> {
  try {
    await api.delete(`/accounts/${id}`);
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to delete account');
  }
}

