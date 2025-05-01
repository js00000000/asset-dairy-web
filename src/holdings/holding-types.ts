export interface Holding {
  ticker: string;
  quantity: number;
  price: number | null;
  averagePrice: number;
  assetType: 'stock' | 'crypto';
  currency: string;
}