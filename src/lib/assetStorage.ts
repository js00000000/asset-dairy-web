import { Trade } from '../trades/trade-types';

const STORAGE_KEY = 'assetDairy_trades';

// Local Storage CRUD
export function getTrades(): Trade[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function setTrades(trades: Trade[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
}

export function clearTrades(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Calculate balance from all trades
export function calculateBalance(trades: Trade[]): number {
  return trades.reduce((acc, tx) => {
    const delta = tx.quantity * tx.price;
    return tx.type === 'buy' ? acc - delta : acc + delta;
  }, 0);
}

// Mock API sync (simulate fetch/save)
export function mockFetchTrades(): Promise<Trade[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getTrades()); // For now, just return local data
    }, 500);
  });
}

export function mockSaveTrades(trades: Trade[]): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      setTrades(trades);
      resolve();
    }, 500);
  });
}
