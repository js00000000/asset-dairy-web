export type Transaction = {
  type: 'buy' | 'sell';
  date: string;
  quantity: number;
  price: number;
  account: string;
  id: number;
};
