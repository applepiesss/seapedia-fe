"use client";

import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { getPublicProducts } from "@/lib/catalogApi";
import type { ProductResponse } from "@/types/seller";
import { useEffect, useState } from "react";

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [message, setMessage] = useState("Loading products...");

    useEffect(() => {
        async function loadProducts() {
        try {
            const data = await getPublicProducts();
            setProducts(data);
            setMessage(data.length === 0 ? "No seller products yet." : "");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to load products");
        }
        }

        loadProducts();
    }, []);

    return (
        <main className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#7FDBDA] rounded-full blur-[120px]" />
        </div>

        <Header />

        <section className="mx-auto max-w-6xl px-6 py-12 relative z-10">
            <p className="text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-[#4A9FE8] to-[#25a9a8] bg-clip-text text-transparent">
            Browse our products
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950">
            Products
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
            All products you see are from real sellers on SEAPEDIA. Look around
            as much as you want, you'll just need to log in to actually purchase.
            </p>

            {message && <p className="mt-8 text-slate-500 text-sm">{message}</p>}

            <div className="mt-8 grid gap-5 md:grid-cols-3">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        </section>
        </main>
    );
}