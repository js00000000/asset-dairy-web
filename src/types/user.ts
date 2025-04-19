// Unified User type for the entire app
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  avatar: string;
  createdAt: string;
  address?: string;
  phone?: string;
  /**
   * Only for mock/localStorage use! Do NOT use in production.
   */
  password?: string;
}
