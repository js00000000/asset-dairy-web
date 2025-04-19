import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          (item) => item.productId === newItem.productId
        );
        
        if (existingItemIndex >= 0) {
          // Item exists, update quantity
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
          };
          return { items: updatedItems };
        } else {
          // Add new item
          return { 
            items: [...state.items, { ...newItem, id: `ci-${Date.now()}` }] 
          };
        }
      }),
      
      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.productId !== productId),
      })),
      
      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            items: state.items.filter((item) => item.productId !== productId),
          };
        }
        
        return {
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        };
      }),
      
      clearCart: () => set({ items: [] }),
      
      get itemCount() {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      
      get subtotal() {
        return get().items.reduce((total, item) => {
          const price = item.discountedPrice || item.price;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'shopping-cart',
    }
  )
);
