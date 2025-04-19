import { create } from 'zustand';
import { mockProducts, mockCategories } from '../../data/mock-data';
import { Product, Category } from '../../types';

interface ProductState {
  products: Product[];
  categories: Category[];
  featured: Product[];
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: () => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: mockProducts,
  categories: mockCategories,
  featured: mockProducts.filter(product => product.featured),
  isLoading: false,
  searchQuery: '',
  selectedCategory: null,
  
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  
  setSelectedCategory: (category: string | null) => set({ selectedCategory: category }),
  
  getProductById: (id: string) => {
    return get().products.find((product) => product.id === id);
  },
  
  getProductsByCategory: (category: string) => {
    return get().products.filter((product) => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  },
  
  searchProducts: () => {
    const { products, searchQuery, selectedCategory } = get();
    
    let filteredProducts = [...products];
    
    // Filter by category if selected
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }
    
    return filteredProducts;
  },
}));
