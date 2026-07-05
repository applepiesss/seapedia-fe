import { apiRequest } from "./api";
import { AdminMonitoringSummary } from "@/types/admin";

const h = (token: string) => ({ Authorization: `Bearer ${token}` });

export const getAdminMonitoringSummary = (token: string) =>
  apiRequest<AdminMonitoringSummary>("/api/admin/monitoring/summary", { headers: h(token) });

export const simulateNextDay = (token: string) =>
  apiRequest<{ message: string }>("/api/admin/actions/simulate-next-day", {
    method: "POST",
    headers: h(token),
  });

export const processOverdueOrders = (token: string) =>
  apiRequest<{ message: string }>("/api/admin/actions/process-overdue", {
    method: "POST",
    headers: h(token),
  });

import { Voucher, Promo, VoucherRequest, PromoRequest } from "@/types/admin";

export const getVouchers = (token: string) =>
  apiRequest<Voucher[]>("/api/admin/discounts/vouchers", { headers: h(token) });

export const createVoucher = (token: string, data: VoucherRequest) =>
  apiRequest<Voucher>("/api/admin/discounts/vouchers", {
    method: "POST",
    headers: { ...h(token), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const getPromos = (token: string) =>
  apiRequest<Promo[]>("/api/admin/discounts/promos", { headers: h(token) });

export const createPromo = (token: string, data: PromoRequest) =>
  apiRequest<Promo>("/api/admin/discounts/promos", {
    method: "POST",
    headers: { ...h(token), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
