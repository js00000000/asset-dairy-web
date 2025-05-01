import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string) {
  const symbol = currency === 'TWD' ? 'NT$' : '$';
  return `${symbol}${price.toFixed(2)}`;
}

// Currency conversion utility
export function convertToUSD(value: number, currency: string): number {
  const rates: Record<string, number> = {
    USD: 1,
    TWD: 0.03,
    BTC: 90000,
  };
  const rate = rates[currency] || 1;
  return value * rate;
}
