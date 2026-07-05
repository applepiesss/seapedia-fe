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
        <main className="min-h-screen bg-slate-50">
        <Header />

        <section className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="text-3xl font-bold text-slate-950">Seller Products</h1>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 border bg-white p-5">
            <input
                value={form.productName}
                onChange={(event) => setForm({ ...form, productName: event.target.value })}
                className="h-11 border px-3"
                placeholder="Product name"
            />
            <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="min-h-28 border p-3"
                placeholder="Description"
            />
            <input
                value={form.price}
                onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
                className="h-11 border px-3"
                placeholder="Price"
                type="number"
                min="0"
            />
            <input
                value={form.stock}
                onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })}
                className="h-11 border px-3"
                placeholder="Stock"
                type="number"
                min="0"
            />

            <button className="h-11 bg-emerald-700 font-semibold text-white">
                {editingId ? "Update product" : "Create product"}
            </button>
            </form>

            {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}

            <div className="mt-8 grid gap-4 md:grid-cols-2">
            {products.map((product) => (
                <article key={product.id} className="border bg-white p-5 shadow-sm">
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
                    className="border border-slate-300 px-4 py-2 text-sm font-semibold"
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-700 px-4 py-2 text-sm font-semibold text-white"
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