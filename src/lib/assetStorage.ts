import { Transaction } from '../transactions/transaction-types';

const STORAGE_KEY = 'assetDairy_transactions';

// Local Storage CRUD
export function getTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function setTransactions(transactions: Transaction[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function clearTransactions(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Calculate balance from all transactions
export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, tx) => {
    const delta = tx.quantity * tx.price;
    return tx.type === 'buy' ? acc - delta : acc + delta;
  }, 0);
}

// Mock API sync (simulate fetch/save)
export function mockFetchTransactions(): Promise<Transaction[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getTransactions()); // For now, just return local data
    }, 500);
  });
}

export function mockSaveTransactions(transactions: Transaction[]): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      setTransactions(transactions);
      resolve();
    }, 500);
  });
}
