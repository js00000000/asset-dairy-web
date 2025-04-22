import { Transaction } from '../transactions/transaction-types';
import { getTransactions, setTransactions } from '../lib/assetStorage';
import { getCurrentUser } from '../lib/storage-helpers';

type UserTransaction = Transaction & { ownerId: string };

/**
 * Fetch all transactions for the current user.
 */
export async function fetchTransactions(): Promise<UserTransaction[]> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) return [];
  return (getTransactions() as UserTransaction[]).filter(tx => tx.ownerId === user.id);
}

/**
 * Create a new transaction for the current user.
 * @throws Error if not authenticated.
 */
export async function createTransaction(tx: Omit<Transaction, 'id'>): Promise<UserTransaction> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated. Please log in to create a transaction.');
  const transactions = getTransactions() as UserTransaction[];
  const newTx: UserTransaction = { ...tx, id: Date.now(), ownerId: user.id };
  transactions.push(newTx);
  setTransactions(transactions);
  return newTx;
}

/**
 * Update a transaction by id for the current user.
 * @throws Error if not authenticated.
 */
export async function updateTransaction(id: number, data: Partial<UserTransaction>): Promise<UserTransaction | null> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated. Please log in to update a transaction.');
  const transactions = getTransactions() as UserTransaction[];
  const idx = transactions.findIndex(t => t.id === id && t.ownerId === user.id);
  if (idx === -1) return null;
  transactions[idx] = { ...transactions[idx], ...data };
  setTransactions(transactions);
  return transactions[idx];
}

/**
 * Delete a transaction by id for the current user.
 * @throws Error if not authenticated.
 */
export async function deleteTransaction(id: number): Promise<void> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated. Please log in to delete a transaction.');
  const transactions = getTransactions() as UserTransaction[];
  setTransactions(transactions.filter(t => !(t.id === id && t.ownerId === user.id)));
}

// Export all for easier imports
export const transactionApi = {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
