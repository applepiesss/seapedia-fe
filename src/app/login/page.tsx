"use client";

import Header from "@/components/Header";
import { apiRequest } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import type { AuthResponse } from "@/types/auth";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");
        
        try {
            const auth = await apiRequest<AuthResponse>("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });
        
            saveAuth(auth);
        
            if (auth.mustChooseRole) {
                router.replace("/choose-role");
                return;
            }
        
            router.replace("/dashboard");
            } catch (error) {
            setMessage(error instanceof Error ? error.message : "Login failed");
        }
    }

    return (
        <main className="min-h-screen bg-slate-50">
        <Header />
        <section className="mx-auto max-w-md px-6 py-12">
            <h1 className="text-3xl font-bold text-slate-950">Login</h1>
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="h-11 border border-slate-300 px-3"
                placeholder="Username"
            />
            <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 border border-slate-300 px-3"
                placeholder="Password"
                type="password"
            />
            <button className="h-11 bg-emerald-700 font-semibold text-white">
                Login
            </button>
            </form>
            {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
        </section>
        </main>
    );
}