export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  categoryId: string;
  category?: string;
  colors?: string[];
  sizes?: string[];
  description?: string;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  stock?: number;
  soldCount?: number;
  sellerId: string;
  tags?: string[];
  condition?: "new" | "refurbished" | "used";
  status?: "active" | "draft" | "archived" | "out_of_stock";
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  addedAt: string;
}

export interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: "buyer" | "seller" | "admin";
  status: "active" | "suspended" | "deactivated";
}

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  storeDescription?: string;
  logo?: string;
  banner?: string;
  rating: number;
  totalSales: number;
  totalProducts: number;
  status: "active" | "suspended" | "deactivated";
}

export interface Order {
  id: string;
  userId: string;
  sellerId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  shippingAddress: string;
  billingAddress: string;
  paymentId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  method: "credit_card" | "debit_card" | "bank_transfer" | "digital_wallet";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionRef?: string;
  createdAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  helpfulCount: number;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount?: number;
}

export interface BillingInfo {
  firstName: string;
  lastName: string;
  company?: string;
  streetAddress: string;
  apartment?: string;
  townCity: string;
  phone: string;
  email: string;
  saveInfo: boolean;
}

export interface PlatformStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
}

export interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
}
