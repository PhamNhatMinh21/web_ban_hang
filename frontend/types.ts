// File: src/types.ts

export interface ProductVariant {
  variantId: number;
  name: string;
  sku: string;
  price: number;
  oldPrice?: number;
  stockQuantity: number;
  flavor: string;
  size: string;
  imageUrl?: string;
  salePrice?: number;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface Product {
  id: number;
  name: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  price: number;
  oldPrice?: number;
  description: string;
  flavors?: string[];
  sizes?: string[];
  variants: ProductVariant[];
  category: string;
  brand: string;
  sku?: string;
  subCategory?: string;
  sold: number;
  stockQuantity: number;
  categoryId?: number;
  brandId?: number;
  isFeatured?: boolean;
  parentCategoryId?: number;
  comments?: Review[]; 
}

export interface CartItem {
  variantId: number;
  productId: number;
  name: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
  size?: string;
  flavor?: string;
}

export interface Brand {
  id: number;
  name: string;
  logo: string;
}

export interface Article {
  id: number;
  title: string;
  date: string;
  snippet: string;
  image: string;
  category: string;
  url?: string;
}

export interface MegaMenuLink {
  label: string;
  href: string;
  category?: string;
}

export interface MegaMenuItem {
  title: string;
  links: MegaMenuLink[];
}

export interface NavLink {
  label: string;
  href: string;
  megaMenu?: MegaMenuItem[];
}

export interface SortOption {
  value: 'default' | 'popularity' | 'price-asc' | 'price-desc';
  label: string;
}

export type Theme = 'default' | 'light' | 'black';

export interface User {
  name: string;
  role: 'USER' | 'ADMIN';
  email: string;
  phone?: string; // <--- ĐÃ THÊM DÒNG NÀY ĐỂ KHÔNG BỊ MẤT SỐ ĐIỆN THOẠI
}

export type OrderStatus = 'PENDING_CONFIRMATION' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED' | 'RETURNED';
export type PaymentStatus = 'Chưa thanh toán' | 'Đã thanh toán';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentStatus: PaymentStatus;
  paymentMethod: 'cod' | 'card';
}

export interface UserResponse {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface ProductVariantRequest {
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  flavor: string;
  size: string;
  imageUrl?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  categoryId: number;
  brandId: number;
  variants: ProductVariantRequest[];
  imageUrls: string[]; 
}