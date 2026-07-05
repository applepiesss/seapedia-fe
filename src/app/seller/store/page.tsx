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
          if (!auth) return;
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
        <main className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#7FDBDA] rounded-full blur-[120px]" />
        </div>

        <Header />

        <section className="mx-auto max-w-xl px-6 py-12 relative z-10">
            <h1 className="text-3xl font-bold text-slate-950">Seller Store</h1>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <input
                value={storeName}
                onChange={(event) => setStoreName(event.target.value)}
                className="h-11 rounded-lg border border-slate-200 bg-white/70 px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4A9FE8]/40"
                placeholder="Unique store name"
            />

            <button className="h-11 rounded-xl bg-gradient-to-r from-[#4A9FE8] to-[#7FDBDA] font-semibold text-white transition-all hover:shadow-[0_4px_15px_rgba(74,159,232,0.4)] hover:opacity-90 active:scale-[0.98]">
                Save store
            </button>
            </form>

            {store && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-5 shadow-[0_4px_20px_rgba(74,159,232,0.08)]">
                <p className="text-sm text-slate-500">Current store</p>
                <p className="mt-1 text-xl font-bold text-slate-950">
                {store.storeName}
                </p>
            </div>
            )}

            {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
        </section>
        </main>
    );
}