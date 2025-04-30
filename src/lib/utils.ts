import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: 'USD' | 'TWD') {
  const symbol = currency === 'TWD' ? 'NT$' : '$';
  return `${symbol}${price.toFixed(2)}`;
}
