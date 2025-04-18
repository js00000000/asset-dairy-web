import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (!discountedPrice || discountedPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

export function generateStarRating(rating: number): string[] {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push('full');
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push('half');
  }

  // Add empty stars
  while (stars.length < 5) {
    stars.push('empty');
  }

  return stars;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function getRandomSubset<T>(array: T[], size: number): T[] {
  if (size >= array.length) return [...array];
  
  const result = [];
  const copyArray = [...array];
  
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * copyArray.length);
    result.push(copyArray[randomIndex]);
    copyArray.splice(randomIndex, 1);
  }
  
  return result;
}