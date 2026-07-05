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
        <main className="min-h-screen bg-white relative overflow-hidden flex flex-col">
            <Header />
            
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
                <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#7FDBDA] rounded-full blur-[120px]" />
            </div>

            <div className="flex-1 flex flex-col justify-center py-12 relative z-10">
                <section className="mx-auto w-full max-w-md px-6">
                    <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-lg p-8 shadow-[0_8px_30px_rgba(74,159,232,0.1)]">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-slate-950">Welcome Back</h1>
                            <p className="mt-2 text-sm text-slate-600">Enter your credentials to access your account.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid gap-5">
                            <label className="grid gap-2">
                                <span className="text-sm font-medium text-slate-700">Username</span>
                                <input
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    required
                                    className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 placeholder-slate-400 outline-none focus:border-[#4A9FE8] focus:ring-2 focus:ring-[#4A9FE8]/20 transition-all"
                                    placeholder="Username"
                                />
                            </label>

                            <label className="grid gap-2">
                                <span className="text-sm font-medium text-slate-700">Password</span>
                                <input
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                    className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 placeholder-slate-400 outline-none focus:border-[#4A9FE8] focus:ring-2 focus:ring-[#4A9FE8]/20 transition-all"
                                    placeholder="Password"
                                    type="password"
                                />
                            </label>

                            <button className="mt-2 h-11 rounded-lg bg-gradient-to-r from-[#4A9FE8] to-[#7FDBDA] font-semibold text-white transition-all hover:shadow-[0_4px_15px_rgba(74,159,232,0.4)] hover:opacity-90 active:scale-[0.98]">
                                Login
                            </button>
                        </form>

                        {message && (
                            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 text-center">
                                {message}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}