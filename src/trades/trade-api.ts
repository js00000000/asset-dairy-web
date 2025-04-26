import { Trade } from '../trades/trade-types';
import api from '../lib/api';

export async function fetchTrades(): Promise<Trade[]> {
  try {
    const res = await api.get<Trade[]>('/trades');
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch trades');
  }
}

export async function createTrade(trade: Omit<Trade, 'id'>): Promise<Trade> {
  try {
    const res = await api.post<Trade>('/trades', trade);
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to create trade');
  }
}

export async function updateTrade(id: number, data: Partial<Trade>): Promise<Trade> {
  try {
    const res = await api.put<Trade>(`/trades/${id}`, data);
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to update trade');
  }
}

export async function deleteTrade(id: number): Promise<void> {
  try {
    await api.delete(`/trades/${id}`);
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to delete trade');
  }
}

export const tradeApi = {
  fetchTrades,
  createTrade,
  updateTrade,
  deleteTrade,
};
