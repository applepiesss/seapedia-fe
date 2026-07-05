import { apiRequest } from "@/lib/api";
import type { ProductResponse, StoreResponse } from "@/types/seller";

export function getPublicProducts() {
    return apiRequest<ProductResponse[]>("/api/public/products");
}

export function getPublicProduct(productId: string) {
    return apiRequest<ProductResponse>(`/api/public/products/${productId}`);
}

export function getPublicStore(storeId: number) {
    return apiRequest<StoreResponse>(`/api/public/stores/${storeId}`);
}