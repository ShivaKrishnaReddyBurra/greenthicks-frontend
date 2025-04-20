
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  weightOptions: {
    value: string;
    label: string;
    price: number;
  }[];
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isOrganic: boolean;
  isSeasonal: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: {
    id: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    isDefault: boolean;
  }[];
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  paymentMethod: 'credit' | 'upi' | 'cod';
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  deliveryETA: string;
  trackingInfo?: {
    status: string;
    timestamp: string;
    location?: string;
  }[];
}
