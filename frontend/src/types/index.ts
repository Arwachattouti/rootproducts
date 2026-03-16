declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.svg';
declare module '*.webp';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  countInStock: number;
  weight: string;
  ingredients: string[];
  benefits: string[];
  origin: string;
  location: {
  latitude: number;
  longitude: number;
}
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface BlogPost {
  _id: string;
  title: string;
  category: 'Nutrition' | 'Culture' | 'Jardinage' | 'Cuisine' | 'Technique';
  author: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content?: string; 
  tags: string[];
}
export interface Order {
  id: string;
  user: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
  notes?: string;
}

export interface User {
 id?: string;    
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?:string;
  role: 'admin' | 'customer';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  newUsersCount: number; 
  recentOrders: {
    id: string;
    user: {
      name: string;
    };
    createdAt: string; 
    total: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  }[];
  topProducts: {
    product: {
      _id: string;
      name: string;
    };
    sales: number;
  }[];
}