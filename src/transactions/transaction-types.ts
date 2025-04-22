export type Transaction = {
  type: 'buy' | 'sell';
  date: string;
  quantity: number;
  price: number;
  accountId: string; // The account whose balance should be updated (account id)
  id: number;
  ticker: string;
  assetType: 'stock' | 'crypto';
};
