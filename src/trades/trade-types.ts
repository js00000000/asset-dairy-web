export type Trade = {
  type: 'buy' | 'sell';
  tradeDate: string;
  quantity: number;
  price: number;
  accountId: string; // The account whose balance should be updated (account id)
  id: string;
  ticker: string;
  assetType: 'stock' | 'crypto';
  reason?: string; // Optional reason for the trade
  currency: 'USD' | 'TWD'; // Currency of the trade
};
