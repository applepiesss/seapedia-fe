export type StoreResponse = {
    id: number;
    storeName: string;
    ownerUsername: string;
};

export type ProductResponse = {
    id: number;
    productName: string;
    description: string;
    price: number;
    stock: number;
    storeId: number;
    storeName: string;
    sellerUsername: string;
};

export type ProductPayload = {
    productName: string;
    description: string;
    price: number;
    stock: number;
};