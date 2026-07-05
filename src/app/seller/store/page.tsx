"use client";

import Header from "@/components/Header";
import { getAuth } from "@/lib/auth";
import { getMyStore, saveMyStore } from "@/lib/sellerApi";
import type { StoreResponse } from "@/types/seller";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function SellerStorePage() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [store, setStore] = useState<StoreResponse | null>(null);
    const [storeName, setStoreName] = useState("");
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

        async function loadStore() {
        try {
            const data = await getMyStore(auth.token);
            setStore(data);
            setStoreName(data.storeName);
        } catch {
            setMessage("Create your seller store first.");
        }
        }

        loadStore();
    }, [router]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");

        try {
        const data = await saveMyStore(token, storeName);
        setStore(data);
        setStoreName(data.storeName);
        setMessage("Store profile saved.");
        } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to save store");
        }
    }

    return (
        <main className="min-h-screen bg-slate-50">
        <Header />

        <section className="mx-auto max-w-xl px-6 py-12">
            <h1 className="text-3xl font-bold text-slate-950">Seller Store</h1>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <input
                value={storeName}
                onChange={(event) => setStoreName(event.target.value)}
                className="h-11 border border-slate-300 px-3"
                placeholder="Unique store name"
            />

            <button className="h-11 bg-emerald-700 font-semibold text-white">
                Save store
            </button>
            </form>

            {store && (
            <div className="mt-6 border bg-white p-5">
                <p className="text-sm text-slate-500">Current store</p>
                <p className="mt-1 text-xl font-bold text-slate-950">
                {store.storeName}
                </p>
            </div>
            )}

            {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
        </section>
        </main>
    );
}