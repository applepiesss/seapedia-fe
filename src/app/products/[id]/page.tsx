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
        <main className="min-h-screen bg-slate-50">
        <Header />

        <section className="mx-auto max-w-5xl px-6 py-12">
            <Link href="/products" className="text-sm font-semibold text-emerald-700">
            Back to products
            </Link>

            {message && <p className="mt-6 text-slate-600">{message}</p>}

            {product && (
            <div className="mt-6 border border-slate-200 bg-white p-8">
                <p className="text-sm font-semibold uppercase text-emerald-700">
                {product.storeName}
                </p>
                <h1 className="mt-3 text-4xl font-bold text-slate-950">
                {product.productName}
                </h1>
                <p className="mt-2 text-slate-500">
                Sold by {product.sellerUsername}
                </p>
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
                        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-300"
                    >
                        {addingToCart ? "Adding..." : "Add to Cart"}
                    </button>
                )}

                <div className="mt-8 border-t border-slate-200 pt-5">
                <h2 className="text-sm font-semibold uppercase text-slate-500">
                    Store Information
                </h2>
                <p className="mt-2 font-semibold text-slate-950">
                    {product.storeName}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                    This public block identifies which Seller store owns the product.
                </p>
                </div>
            </div>
            )}
        </section>
        </main>
    );
}