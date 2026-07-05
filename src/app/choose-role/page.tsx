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

        if (!auth.mustChooseRole && auth.activeRole) {
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
        <main className="min-h-screen bg-slate-50">
        <Header />

        <section className="mx-auto max-w-3xl px-6 py-12">
            <p className="text-sm font-semibold uppercase text-emerald-700">
            Active Role
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Choose how you want to use SEAPEDIA
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
            Your username owns more than one role. SEAPEDIA needs one active role
            for this session before opening a private dashboard.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {roles.map((role) => (
                <button
                key={role}
                onClick={() => chooseRole(role)}
                className="border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-emerald-700"
                >
                <p className="text-lg font-bold text-slate-950">{role}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    Continue as {role.toLowerCase()} for this session.
                </p>
                </button>
            ))}
            </div>

            {message && <p className="mt-5 text-sm text-red-700">{message}</p>}
        </section>
        </main>
    );
}