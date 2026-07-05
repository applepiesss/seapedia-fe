import type { Product } from "@/types/product";

export const products: Product[] = [
    {
        id: "1",
        slug: "kopi-aceh-gayo",
        name: "Kopi Aceh Gayo",
        category: "Groceries",
        storeName: "Nusantara Beans",
        price: 85000,
        rating: 4.8,
        stock: 25,
        description:
        "Arabica coffee beans from Aceh Gayo with a balanced aroma and smooth finish.",
    },
    {
        id: "2",
        slug: "batik-megamendung",
        name: "Batik Megamendung",
        category: "Fashion",
        storeName: "Cirebon Craft",
        price: 175000,
        rating: 4.7,
        stock: 12,
        description:
        "Read-only product preview for SEAPEDIA public marketplace visitors.",
    },
    {
        id: "3",
        slug: "lampu-meja-minimalis",
        name: "Lampu Meja Minimalis",
        category: "Home",
        storeName: "Ruang Rapi",
        price: 129000,
        rating: 4.5,
        stock: 18,
        description:
        "A compact table lamp for study desks, home offices, and bedroom corners.",
    },
];

export function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}