import { Trade } from '../trades/trade-types';
import { authGet, authPost, authPut, authDelete } from '../auth/auth-api';

export async function fetchTrades(): Promise<Trade[]> {
  const res = await authGet('/trades');
  if (!res.ok) {
    throw new Error('Failed to fetch trades');
  }
  return await res.json();
}

export async function createTrade(trade: Omit<Trade, 'id'>): Promise<Trade> {
  const res = await authPost('/trades', trade);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create trade');
  }
  return await res.json();
}

export async function updateTrade(id: number, data: Partial<Trade>): Promise<Trade> {
  const res = await authPut(`/trades/${id}`, data);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to update trade');
  }
  return await res.json();
}

export async function deleteTrade(id: number): Promise<void> {
  const res = await authDelete(`/trades/${id}`);
  if (!res.ok && res.status !== 204) {
    const err = await res.text();
    throw new Error(err || 'Failed to delete trade');
  }
}

export const tradeApi = {
  fetchTrades,
  createTrade,
  updateTrade,
  deleteTrade,
};
