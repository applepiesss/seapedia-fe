"use client";

import Header from "@/components/Header";
import { apiRequest } from "@/lib/api";
import { getAuth, saveAuth } from "@/lib/auth";
import type { AuthResponse, Role } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChooseRolePage() {
    const router = useRouter();
    const [roles, setRoles] = useState<Role[]>([]);
    const [token, setToken] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const auth = getAuth();

        if (!auth) {
        router.replace("/login");
        return;
        }

        if (auth.roles.length <= 1) {
        router.replace("/dashboard");
        return;
        }

        setToken(auth.token);
        setRoles(auth.roles.filter((role) => role !== "ADMIN"));
    }, [router]);

    async function chooseRole(activeRole: Role) {
        setMessage("");

        try {
        const auth = await apiRequest<AuthResponse>("/api/auth/active-role", {
            method: "POST",
            headers: {
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ activeRole }),
        });

        saveAuth(auth);
        router.replace("/dashboard");
        } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to choose role");
        }
    }

    return (
        <main className="min-h-screen bg-white relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
                <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#7FDBDA] rounded-full blur-[120px]" />
            </div>

            <Header />

            <section className="mx-auto max-w-4xl px-6 py-12 relative z-10 w-full">
                <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-lg p-8 shadow-[0_8px_30px_rgba(74,159,232,0.1)]">
                    <p className="text-sm font-semibold uppercase bg-gradient-to-r from-[#4A9FE8] to-[#25a9a8] bg-clip-text text-transparent">
                        Active Role
                    </p>
                    <h1 className="mt-3 text-3xl font-bold text-slate-950">
                        Choose how you want to use SEAPEDIA
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-600">
                        Your username owns more than one role. SEAPEDIA needs one active role
                        for this session before opening a private dashboard.
                    </p>

                    <div className="mt-10 grid gap-5 sm:grid-cols-3">
                        {roles.map((role) => (
                            <button
                                key={role}
                                onClick={() => chooseRole(role)}
                                className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-6 text-left shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7FDBDA] hover:shadow-[0_8px_25px_rgba(74,159,232,0.15)] group"
                            >
                                <div className="flex items-center justify-between w-full mb-3">
                                    <p className="text-xl font-bold text-slate-900 group-hover:text-[#4A9FE8] transition-colors">{role}</p>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#4A9FE8]/10 transition-colors">
                                        <svg className="w-4 h-4 text-slate-400 group-hover:text-[#4A9FE8] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed text-slate-500 group-hover:text-slate-600 transition-colors">
                                    Continue as {role.toLowerCase()} for this session.
                                </p>
                            </button>
                        ))}
                    </div>

                    {message && (
                        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 text-center">
                            {message}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}