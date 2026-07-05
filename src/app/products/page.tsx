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
        <main className="min-h-screen bg-slate-50">
        <Header />

        <section className="mx-auto max-w-6xl px-6 py-12">
            <p className="text-sm font-semibold uppercase text-emerald-700">
            Guest Browsing
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950">
            Public product listing
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
            Products are loaded from real Seller stores. Guests can browse product
            details, but cannot create, update, delete, or checkout products.
            </p>

            {message && <p className="mt-8 text-slate-600">{message}</p>}

            <div className="mt-8 grid gap-5 md:grid-cols-3">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        </section>
        </main>
    );
}