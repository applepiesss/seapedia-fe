"use client";

import { getAuth } from "@/lib/auth";
import Header from "@/components/Header";
import { getPublicProduct } from "@/lib/catalogApi";
import type { ProductResponse } from "@/types/seller";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addToCart } from "@/lib/buyerApi";

function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
    }

    export default function ProductDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [message, setMessage] = useState("Loading product...");
    const [activeRole, setActiveRole] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        async function loadProduct() {
        try {
            const data = await getPublicProduct(params.id);
            setProduct(data);
            setMessage("");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to load product");
        }
        }
        loadProduct();
        setActiveRole(getAuth()?.activeRole || null);
    }, [params.id]);

    const handleAddToCart = async () => {
        setAddingToCart(true);
        try {
            const token = getAuth()?.token;
            if (!token) return;
            await addToCart(token, Number(params.id), 1);
            alert("Product added to cart!");
            router.push("/buyer/cart");
        } catch (e: any) {
            console.error(e);
            alert(`Failed to add: ${e.message || "Unknown error"}`);
        } finally {
            setAddingToCart(false);
        }
    };

    return (
        <main className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#7FDBDA] rounded-full blur-[120px]" />
        </div>

        <Header />

        <section className="mx-auto max-w-5xl px-6 py-12 relative z-10">
            <Link href="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-[#4A9FE8] transition-colors hover:text-[#25a9a8]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Back to products
            </Link>

            {message && <p className="mt-6 text-sm text-slate-500">{message}</p>}

            {product && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-8 shadow-[0_8px_30px_rgba(74,159,232,0.08)]">
                <p className="text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-[#4A9FE8] to-[#25a9a8] bg-clip-text text-transparent">
                {product.storeName}
                </p>
                <h1 className="mt-3 text-4xl font-bold text-slate-950">
                {product.productName}
                </h1>
                <p className="mt-6 text-3xl font-bold text-slate-950">
                {formatRupiah(product.price)}
                </p>
                <p className="mt-4 text-sm text-slate-600">Stock {product.stock}</p>
                <p className="mt-8 max-w-2xl whitespace-pre-wrap break-words leading-7 text-slate-700">
                {product.description}
                </p>

                {activeRole === "BUYER" && (
                    <button
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        className="mt-6 rounded-xl px-6 py-3 bg-gradient-to-r from-[#4A9FE8] to-[#7FDBDA] text-white font-semibold transition-all hover:shadow-[0_4px_15px_rgba(74,159,232,0.4)] hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                    >
                        {addingToCart ? "Adding..." : "Add to Cart"}
                    </button>
                )}

                <div className="mt-8 border-t border-slate-200 pt-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Store Information
                </h2>
                <p className="mt-2 font-semibold text-slate-950">
                    {product.storeName}
                </p>
                </div>
            </div>
            )}
        </section>
        </main>
    );
}