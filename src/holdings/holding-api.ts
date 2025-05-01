import api from '@/lib/api';
import { Holding } from './holding-types';

export async function fetchHoldings(): Promise<Holding[]> {
  try {
    const res = await api.get<Holding[]>('/holdings');
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch holdings');
  }
} 