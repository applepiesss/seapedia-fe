import { apiRequest } from "./api";
import { Order, OrderDetail } from "@/types/order";

const h = (token: string) => ({ Authorization: `Bearer ${token}` });

export const getBuyerOrders = (token: string) =>
  apiRequest<Order[]>("/api/buyer/orders", { headers: h(token) });

export const getBuyerOrder = (token: string, id: string) =>
  apiRequest<OrderDetail>(`/api/buyer/orders/${id}`, { headers: h(token) });

export const getSellerOrders = (token: string) =>
  apiRequest<Order[]>("/api/seller/orders", { headers: h(token) });

export const getSellerOrder = (token: string, id: string) =>
  apiRequest<OrderDetail>(`/api/seller/orders/${id}`, { headers: h(token) });
