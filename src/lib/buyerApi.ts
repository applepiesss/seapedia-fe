import { apiRequest } from "./api";
import { Wallet, Address } from "@/types/buyer";
import { Cart, CheckoutSummary } from "@/types/order";

const h = (token: string) => ({ Authorization: `Bearer ${token}` });

export const getWallet = (token: string) =>
  apiRequest<Wallet>("/api/buyer/wallet", { headers: h(token) });

export const topUpWallet = (token: string, amount: number) =>
  apiRequest<Wallet>("/api/buyer/wallet/top-up", {
    method: "POST",
    headers: h(token),
    body: JSON.stringify({ amount }),
  });

export const getAddress = (token: string) =>
  apiRequest<Address>("/api/buyer/address", { headers: h(token) });

export const saveAddress = (token: string, payload: unknown) =>
  apiRequest<Address>("/api/buyer/address", {
    method: "PUT",
    headers: h(token),
    body: JSON.stringify(payload),
  });

export const getCart = (token: string) =>
  apiRequest<Cart>("/api/buyer/cart", { headers: h(token) });

export const addToCart = (token: string, productId: number, quantity: number) =>
  apiRequest<Cart>("/api/buyer/cart/items", {
    method: "POST",
    headers: h(token),
    body: JSON.stringify({ productId, quantity }),
  });

export const updateCartItem = (token: string, productId: number, quantity: number) =>
  apiRequest<Cart>(`/api/buyer/cart/items/${productId}?quantity=${quantity}`, {
    method: "PUT",
    headers: h(token),
  });

export const removeFromCart = (token: string, productId: number) =>
  apiRequest<Cart>(`/api/buyer/cart/items/${productId}`, {
    method: "DELETE",
    headers: h(token),
  });

export const getCheckoutSummary = (token: string, deliveryMethod: string) =>
  apiRequest<CheckoutSummary>(`/api/buyer/checkout/summary?deliveryMethod=${deliveryMethod}`, { headers: h(token) });

export const checkout = (token: string, deliveryMethod: string) =>
  apiRequest<void>("/api/buyer/checkout", {
    method: "POST",
    headers: h(token),
    body: JSON.stringify({ deliveryMethod }),
  });
