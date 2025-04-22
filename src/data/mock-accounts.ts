import { Account } from '../accounts/account-types';

export const mockAccounts: Account[] = [
  { id: '1', name: 'Main Checking', currency: 'USD', balance: 3200.5, ownerId: 's1' },
  { id: '2', name: 'Savings', currency: 'USD', balance: 12000, ownerId: 's2' },
  { id: '3', name: 'Crypto Wallet', currency: 'BTC', balance: 0.45, ownerId: 's3' },
];
