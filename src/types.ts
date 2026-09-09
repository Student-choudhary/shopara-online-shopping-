export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  emoji: string;
  category: 'Fashion' | 'Electronics' | 'Beauty' | 'Home & Living';
  image?: string;
  description: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  shipping: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    paymentMethod: 'cod' | 'upi' | 'card';
  };
  status: 'confirmed' | 'processing' | 'shipped';
  createdAt: string;
}

export interface ServerStatus {
  status: 'ok' | 'error';
  database: 'supabase' | 'in-memory-store';
  supabaseConnected: boolean;
  totalProducts: number;
  port: number;
  version: string;
}
