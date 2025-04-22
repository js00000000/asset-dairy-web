import { Trade } from '../trades/trade-types';
import { getTrades, setTrades } from '../lib/assetStorage';
import { getCurrentUser } from '../lib/storage-helpers';

type UserTrade = Trade & { ownerId: string };

/**
 * Fetch all trades for the current user.
 */
export async function fetchTrades(): Promise<UserTrade[]> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) return [];
  return (getTrades() as UserTrade[]).filter(tx => tx.ownerId === user.id);
}

/**
 * Create a new trade for the current user.
 * @throws Error if not authenticated.
 */
export async function createTrade(tx: Omit<Trade, 'id'>): Promise<UserTrade> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated. Please log in to create a trade.');
  const trades = getTrades() as UserTrade[];
  const newTx: UserTrade = { ...tx, id: Date.now(), ownerId: user.id };
  trades.push(newTx);
  setTrades(trades);
  return newTx;
}

/**
 * Update a trade by id for the current user.
 * @throws Error if not authenticated.
 */
export async function updateTrade(id: number, data: Partial<UserTrade>): Promise<UserTrade | null> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated. Please log in to update a trade.');
  const trades = getTrades() as UserTrade[];
  const idx = trades.findIndex(t => t.id === id && t.ownerId === user.id);
  if (idx === -1) return null;
  trades[idx] = { ...trades[idx], ...data };
  setTrades(trades);
  return trades[idx];
}

/**
 * Delete a trade by id for the current user.
 * @throws Error if not authenticated.
 */
export async function deleteTrade(id: number): Promise<void> {
  await new Promise(res => setTimeout(res, 400));
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated. Please log in to delete a trade.');
  const trades = getTrades() as UserTrade[];
  setTrades(trades.filter(t => !(t.id === id && t.ownerId === user.id)));
}

// Export all for easier imports
export const tradeApi = {
  fetchTrades,
  createTrade,
  updateTrade,
  deleteTrade,
};
