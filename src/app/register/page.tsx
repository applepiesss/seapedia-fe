"use client";

import Header from "@/components/Header";
import { apiRequest } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import type { AuthResponse, Role } from "@/types/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const roleOptions: { role: Role; label: string; desc: string }[] = [
  { role: "BUYER", label: "Buyer", desc: "Shop and manage your orders." },
  { role: "SELLER", label: "Seller", desc: "Open a store and sell products." },
  { role: "DRIVER", label: "Driver", desc: "Deliver orders and earn money." },
];

export default function RegisterPage() {
    const [roles, setRoles] = useState<Role[]>(["BUYER"]);
    const [message, setMessage] = useState("");
    const router = useRouter();

    function toggleRole(role: Role) {
        setRoles((current) =>
        current.includes(role)
            ? current.filter((item) => item !== role)
            : [...current, role],
        );
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");

        if (roles.length === 0) {
        setMessage("Please choose at least one role.");
        return;
        }

        const formData = new FormData(event.currentTarget);

        try {
        const auth = await apiRequest<AuthResponse>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
            username: formData.get("username"),
            email: formData.get("email"),
            phoneNumber: formData.get("phoneNumber"),
            password: formData.get("password"),
            roles,
            }),
        });

        saveAuth(auth);

        if (auth.mustChooseRole) {
            router.replace("/choose-role");
            return;
        }

        router.replace("/dashboard");
        } catch (error) {
        setMessage(error instanceof Error ? error.message : "Register failed");
        }
    }

    return (
        <main className="min-h-screen bg-white relative overflow-hidden flex flex-col">
            <Header />
            
            {/* Decorative gradient waves */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
                <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#7FDBDA] rounded-full blur-[120px]" />
            </div>

            <div className="flex-1 flex flex-col justify-center py-12 relative z-10">
                <section className="mx-auto w-full max-w-2xl px-6">
                    <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-lg p-8 shadow-[0_8px_30px_rgba(74,159,232,0.1)]">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-slate-950">Join SEAPEDIA</h1>
                            <p className="mt-2 text-sm text-slate-600">Create an account and start your journey.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid gap-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <label className="grid gap-2">
                                    <span className="text-sm font-medium text-slate-700">Username</span>
                                    <input
                                        name="username"
                                        required
                                        className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 placeholder-slate-400 outline-none focus:border-[#4A9FE8] focus:ring-2 focus:ring-[#4A9FE8]/20 transition-all"
                                        placeholder="Username"
                                    />
                                </label>
                                <label className="grid gap-2">
                                    <span className="text-sm font-medium text-slate-700">Phone Number</span>
                                    <input
                                        name="phoneNumber"
                                        required
                                        className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 placeholder-slate-400 outline-none focus:border-[#4A9FE8] focus:ring-2 focus:ring-[#4A9FE8]/20 transition-all"
                                        placeholder="Phone number"
                                    />
                                </label>
                            </div>
                            
                            <label className="grid gap-2">
                                <span className="text-sm font-medium text-slate-700">Email Address</span>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 placeholder-slate-400 outline-none focus:border-[#4A9FE8] focus:ring-2 focus:ring-[#4A9FE8]/20 transition-all"
                                    placeholder="Email"
                                />
                            </label>

                            <label className="grid gap-2">
                                <span className="text-sm font-medium text-slate-700">Password</span>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 placeholder-slate-400 outline-none focus:border-[#4A9FE8] focus:ring-2 focus:ring-[#4A9FE8]/20 transition-all"
                                    placeholder="Password"
                                />
                            </label>

                            <div className="grid gap-3 mt-2">
                                <span className="text-sm font-medium text-slate-700">Choose your roles</span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {roleOptions.map(({ role, label, desc }) => {
                                        const isSelected = roles.includes(role);
                                        return (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => toggleRole(role)}
                                                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 ${
                                                    isSelected 
                                                        ? "border-[#4A9FE8] bg-[#4A9FE8]/5 shadow-[0_4px_20px_rgba(74,159,232,0.15)] ring-1 ring-[#4A9FE8]" 
                                                        : "border-slate-200 bg-white hover:border-[#7FDBDA] hover:shadow-md"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between w-full mb-2">
                                                    <span className={`font-semibold text-sm ${isSelected ? "text-[#4A9FE8]" : "text-slate-700"}`}>
                                                        {label}
                                                    </span>
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                                        isSelected ? "border-[#4A9FE8] bg-[#4A9FE8]" : "border-slate-300"
                                                    }`}>
                                                        {isSelected && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-500 leading-relaxed">{desc}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button className="mt-4 h-11 rounded-lg bg-gradient-to-r from-[#4A9FE8] to-[#7FDBDA] font-semibold text-white transition-all hover:shadow-[0_4px_15px_rgba(74,159,232,0.4)] hover:opacity-90 active:scale-[0.98]">
                                Register Account
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