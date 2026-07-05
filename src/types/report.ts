import { Order } from "./order";

export interface BuyerReport {
  totalSpent: number;
  orders: Order[];
}

export interface SellerReport {
  totalRevenue: number;
  orders: Order[];
}
