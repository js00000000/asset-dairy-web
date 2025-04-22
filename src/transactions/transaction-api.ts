import { Transaction } from '../transactions/transaction-types';
import { getTransactions, setTransactions } from '../lib/assetStorage';
import { getCurrentUser } from '../lib/storage-helpers';

type UserTransaction = Transaction & { ownerId: string };


// Fetch all transactions
export async function fetchTransactions(): Promise<UserTransaction[]> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) return [];
  return (getTransactions() as UserTransaction[]).filter(tx => tx.ownerId === user.id);
}

// Create a new transaction
export async function createTransaction(tx: Omit<Transaction, 'id'>): Promise<UserTransaction> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const transactions = getTransactions() as UserTransaction[];
  const newTx: UserTransaction = { ...tx, id: Date.now(), ownerId: user.id };
  transactions.push(newTx);
  setTransactions(transactions);
  return newTx;
}

// Update a transaction by id
export async function updateTransaction(id: number, data: Partial<UserTransaction>): Promise<UserTransaction | null> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const transactions = getTransactions() as UserTransaction[];
  const idx = transactions.findIndex(t => t.id === id && t.ownerId === user.id);
  if (idx === -1) return null;
  transactions[idx] = { ...transactions[idx], ...data };
  setTransactions(transactions);
  return transactions[idx];
}

// Delete a transaction by id
export async function deleteTransaction(id: number): Promise<void> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const transactions = getTransactions() as UserTransaction[];
  setTransactions(transactions.filter(t => !(t.id === id && t.ownerId === user.id)));
}
