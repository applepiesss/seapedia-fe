"use client";

import Header from "@/components/Header";
import { getAuth } from "@/lib/auth";
import {
    createProduct,
    deleteProduct,
    getMyProducts,
    updateProduct,
    } from "@/lib/sellerApi";
    import type { ProductPayload, ProductResponse } from "@/types/seller";
    import { FormEvent, useEffect, useState } from "react";
    import { useRouter } from "next/navigation";

    const emptyForm: ProductPayload = {
    productName: "",
    description: "",
    price: 0,
    stock: 0,
    };

    export default function SellerProductsPage() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<ProductPayload>(emptyForm);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const auth = getAuth();

        if (!auth) {
        router.replace("/login");
        return;
        }

        if (auth.activeRole !== "SELLER") {
        router.replace("/choose-role");
        return;
        }

        setToken(auth.token);
        loadProducts(auth.token);
    }, [router]);

    async function loadProducts(authToken: string) {
        try {
        const data = await getMyProducts(authToken);
        setProducts(data);
        setMessage(data.length === 0 ? "No products yet." : "");
        } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to load products");
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");

        try {
        if (editingId) {
            await updateProduct(token, editingId, form);
        } else {
            await createProduct(token, form);
        }

        setForm(emptyForm);
        setEditingId(null);
        await loadProducts(token);
        } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to save product");
        }
    }

    function startEdit(product: ProductResponse) {
        setEditingId(product.id);
        setForm({
        productName: product.productName,
        description: product.description,
        price: product.price,
        stock: product.stock,
        });
    }

    async function handleDelete(productId: number) {
        try {
        await deleteProduct(token, productId);
        await loadProducts(token);
        } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to delete product");
        }
    }

    return (
        <main className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#7FDBDA] rounded-full blur-[120px]" />
        </div>

        <Header />

        <section className="mx-auto max-w-6xl px-6 py-12 relative z-10">
            <h1 className="text-3xl font-bold text-slate-950">Seller Products</h1>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-5 shadow-[0_4px_20px_rgba(74,159,232,0.08)]">
            <input
                value={form.productName}
                onChange={(event) => setForm({ ...form, productName: event.target.value })}
                className="h-11 rounded-lg border border-slate-200 bg-white/70 px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4A9FE8]/40"
                placeholder="Product name"
            />
            <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="min-h-28 rounded-lg border border-slate-200 bg-white/70 p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4A9FE8]/40"
                placeholder="Description"
            />
            <input
                value={form.price}
                onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
                className="h-11 rounded-lg border border-slate-200 bg-white/70 px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4A9FE8]/40"
                placeholder="Price"
                type="number"
                min="0"
            />
            <input
                value={form.stock}
                onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })}
                className="h-11 rounded-lg border border-slate-200 bg-white/70 px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4A9FE8]/40"
                placeholder="Stock"
                type="number"
                min="0"
            />

            <button className="h-11 rounded-xl bg-gradient-to-r from-[#4A9FE8] to-[#7FDBDA] font-semibold text-white transition-all hover:shadow-[0_4px_15px_rgba(74,159,232,0.4)] hover:opacity-90 active:scale-[0.98]">
                {editingId ? "Update product" : "Create product"}
            </button>
            </form>

            {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}

            <div className="mt-8 grid gap-4 md:grid-cols-2">
            {products.map((product) => (
                <article key={product.id} className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-5 shadow-[0_4px_20px_rgba(74,159,232,0.08)]">
                <h2 className="text-xl font-bold text-slate-950">
                    {product.productName}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{product.description}</p>
                <p className="mt-4 font-semibold text-slate-950">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                </p>
                <p className="mt-1 text-sm text-slate-600">Stock {product.stock}</p>

                <div className="mt-5 flex gap-3">
                    <button
                    onClick={() => startEdit(product)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-[#4A9FE8] hover:text-[#4A9FE8]"
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
                    >
                    Delete
                    </button>
                </div>
                </article>
            ))}
            </div>
        </section>
        </main>
    );
}