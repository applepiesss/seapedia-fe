import { apiRequest } from "@/lib/api";
import type { ProductPayload, ProductResponse, StoreResponse } from "@/types/seller";

function authHeaders(token: string) {
    return {
        Authorization: `Bearer ${token}`,
    };
}

export function getMyStore(token: string) {
    return apiRequest<StoreResponse>("/api/seller/store", {
        headers: authHeaders(token),
    });
}

export function saveMyStore(token: string, storeName: string) {
    return apiRequest<StoreResponse>("/api/seller/store", {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify({ storeName }),
    });
}

export function getMyProducts(token: string) {
    return apiRequest<ProductResponse[]>("/api/seller/products", {
        headers: authHeaders(token),
    });
}

export function createProduct(token: string, payload: ProductPayload) {
    return apiRequest<ProductResponse>("/api/seller/products", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(payload),
    });
}

export function updateProduct(token: string, productId: number, payload: ProductPayload) {
    return apiRequest<ProductResponse>(`/api/seller/products/${productId}`, {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(payload),
    });
}

export function deleteProduct(token: string, productId: number) {
    return apiRequest<void>(`/api/seller/products/${productId}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
}

import { OrderDetail } from "@/types/order";
export function processOrder(token: string, orderId: number) {
    return apiRequest<OrderDetail>(`/api/seller/orders/${orderId}/process`, {
        method: "POST",
        headers: authHeaders(token),
    });
}

import { SellerReport } from "@/types/report";
export function getSellerReport(token: string) {
    return apiRequest<SellerReport>("/api/seller/reports/income", {
        headers: authHeaders(token),
    });
}