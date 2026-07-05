export interface AdminMonitoringSummary {
  totalUsers: number;
  totalStores: number;
  totalProducts: number;
  totalOrders: number;
  totalVouchers: number;
  totalPromos: number;
  totalDeliveryJobs: number;
  totalOverdueOrdersReturned: number;
}

export interface Voucher {
  id: number;
  code: string;
  discountAmount: number;
  expiryDate: string;
  remainingUsage: number;
}

export interface Promo {
  id: number;
  code: string;
  discountPercentage: number;
  expiryDate: string;
}

export interface VoucherRequest {
  code: string;
  discountAmount: number;
  expiryDate: string;
  remainingUsage: number;
}

export interface PromoRequest {
  code: string;
  discountPercent: number;
  expiryDate: string;
}
