import { create } from 'zustand';
import { tradeApi } from './trade-api';
import { Trade } from './trade-types';

interface TradeStore {
  trades: Trade[];
  isLoading: boolean;
  error: string | null;
  fetchTrades: () => Promise<void>;
  createTrade: (trade: Omit<Trade, 'id'>) => Promise<void>;
  updateTrade: (id: string, trade: Partial<Trade>) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;
}

export const useTradeStore = create<TradeStore>((set) => ({
  trades: [],
  isLoading: false,
  error: null,

  fetchTrades: async () => {
    set({ isLoading: true, error: null });
    try {
      const trades = await tradeApi.fetchTrades();
      set({ trades, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch trades', 
        isLoading: false 
      });
    }
  },

  createTrade: async (trade) => {
    set({ isLoading: true, error: null });
    try {
      const newTrade = await tradeApi.createTrade(trade);
      set((state) => ({ 
        trades: [...state.trades, newTrade], 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create trade', 
        isLoading: false 
      });
    }
  },

  updateTrade: async (id, trade) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTrade = await tradeApi.updateTrade(id, trade);
      set((state) => ({ 
        trades: state.trades.map(t => t.id === id ? updatedTrade : t), 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update trade', 
        isLoading: false 
      });
    }
  },

  deleteTrade: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await tradeApi.deleteTrade(id);
      set((state) => ({ 
        trades: state.trades.filter(t => t.id !== id), 
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete trade', 
        isLoading: false 
      });
    }
  },
}));
