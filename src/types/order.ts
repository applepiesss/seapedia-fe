export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface OrderStatusHistory {
  status: string;
  createdAt: string;
}

export interface Order {
  id: number;
  storeName: string;
  status: string;
  finalTotal: number;
  createdAt: string;
}

export interface OrderDetail extends Order {
  deliveryMethod: string;
  subtotal: number;
  discount?: number;
  discountType?: string;
  discountCode?: string;
  deliveryFee: number;
  ppn: number;
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
}

export interface Cart {
  items: OrderItem[];
  subtotal: number;
  singleStoreRule: string;
}

export interface CheckoutSummary {
  subtotal: number;
  discount?: number;
  discountType?: string;
  deliveryFee: number;
  ppn: number;
  finalTotal: number;
  deliveryMethod: string;
}
