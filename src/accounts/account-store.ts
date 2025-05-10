import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Account } from './account-types';
import { accountApi } from './account-api';

interface AccountState {
  accounts: Account[];
  isLoading: boolean;
  error: string | null;

  fetchAccounts: () => Promise<void>;
  createAccount: (account: Omit<Account, 'id'>) => Promise<void>;
  updateAccount: (id: string, data: Partial<Omit<Account, 'id'>>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      accounts: [],
      isLoading: false,
      error: null,

      fetchAccounts: async () => {
        set({ isLoading: true, error: null });
        try {
          const accounts = await accountApi.fetchAccounts();
          set({ accounts, isLoading: false });
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'Failed to fetch accounts', 
            isLoading: false 
          });
        }
      },

      createAccount: async (account: Omit<Account, 'id'>) => {
        set({ isLoading: true, error: null });
        try {
          const newAccount = await accountApi.createAccount(account);
          set(state => ({ 
            accounts: [...state.accounts, newAccount], 
            isLoading: false 
          }));
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'Failed to create account', 
            isLoading: false 
          });
        }
      },

      updateAccount: async (id: string, data: Partial<Omit<Account, 'id'>>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedAccount = await accountApi.updateAccount(id, data);
          set(state => ({
            accounts: state.accounts.map(account => 
              account.id === id ? updatedAccount : account
            ),
            isLoading: false,
          }));
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'Failed to update account', 
            isLoading: false 
          });
        }
      },

      deleteAccount: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await accountApi.deleteAccount(id);
          set(state => ({
            accounts: state.accounts.filter(account => account.id !== id),
            isLoading: false,
          }));
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'Failed to delete account', 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'account-storage', // unique name for localStorage
      partialize: (state) => ({
        accounts: state.accounts,
      })
    }
  )
);
