export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  sizes: Size[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  limited: boolean;
  fabricDetails: string;
  careInstructions: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 'limited' | 'seasonal';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'user' | 'admin';
  wishlist: string[];
  addresses: Address[];
  createdAt: Date;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  size: Size;
  color: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  whatsappNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  rating: number;
  comment: string;
  productId?: string;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: Date;
}

export interface WhatsAppConfig {
  businessNumber: string;
  messageTemplate: string;
}
