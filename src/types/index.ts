export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: string;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  rating: number;
  reviewCount: number;
  stock: number;
  createdAt: string;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  discountedPrice?: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
}

export interface Address {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}