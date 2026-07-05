"use client";

import Header from "@/components/Header";
import { apiRequest } from "@/lib/api";
import { getAuth } from "@/lib/auth";
import type { Role } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type UserProfileResponse = {
    username: string;
    email: string;
    phoneNumber: string | null;
    roles: Role[];
    activeRole: Role | null;
    financialSummary: {
        walletBalance: string;
        sellerIncome: string;
        driverEarnings: string;
        note: string;
    };
    };

    export default function DashboardPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const auth = getAuth();

        if (!auth) {
        router.replace("/login");
        return;
        }

        if (auth.mustChooseRole || !auth.activeRole) {
        router.replace("/choose-role");
        return;
        }

        async function loadProfile() {
          if (!auth) return;
        try {
            const data = await apiRequest<UserProfileResponse>("/api/users/me", {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
            });

            setProfile(data);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to load profile");
        }
        }

        loadProfile();
    }, [router]);

    if (!profile) {
        return (
        <main className="min-h-screen bg-white">
            <Header />
            <section className="mx-auto max-w-6xl px-6 py-12">
            <p className="text-slate-500 text-sm">{message || "Loading dashboard..."}</p>
            </section>
        </main>
        );
    }

    return (
        <main className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#7FDBDA] rounded-full blur-[120px]" />
        </div>

        <Header />

        <section className="mx-auto max-w-6xl px-6 py-12 relative z-10">
            <div className="border-b border-slate-200 pb-6">
            <p className="text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-[#4A9FE8] to-[#25a9a8] bg-clip-text text-transparent">
                Dashboard Summary
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">
                Welcome, {profile.username}
            </h1>
            <p className="mt-2 text-slate-500">{profile.email}</p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
            <section className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)]">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Active Role
                </h2>
                <p className="mt-3 text-2xl font-bold bg-gradient-to-r from-[#4A9FE8] to-[#25a9a8] bg-clip-text text-transparent">
                {profile.activeRole}
                </p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)] md:col-span-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Roles Owned
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                {profile.roles.map((role) => (
                    <span
                    key={role}
                    className={
                        role === profile.activeRole
                        ? "rounded-lg px-3 py-1 text-sm font-semibold bg-gradient-to-r from-[#4A9FE8] to-[#7FDBDA] text-white shadow-[0_2px_10px_rgba(74,159,232,0.3)]"
                        : "rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600"
                    }
                    >
                    {role}
                    </span>
                ))}
                </div>
            </section>
            </div>

            <section className="mt-6 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)]">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Role Actions
                </h2>

                {profile.activeRole === "SELLER" && (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Link
                        href="/seller/store"
                        className="rounded-xl border border-slate-200 bg-white/70 p-5 transition-all hover:border-[#4A9FE8] hover:shadow-[0_4px_15px_rgba(74,159,232,0.12)] hover:-translate-y-0.5"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Store Profile</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        Create or update your unique seller store.
                        </p>
                    </Link>

                    <Link
                        href="/seller/products"
                        className="rounded-xl border border-slate-200 bg-white/70 p-5 transition-all hover:border-[#4A9FE8] hover:shadow-[0_4px_15px_rgba(74,159,232,0.12)] hover:-translate-y-0.5"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Product Management</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        Add, update, and delete products owned by your store.
                        </p>
                    </Link>
                    
                    <Link
                        href="/seller/orders"
                        className="rounded-xl border border-slate-200 bg-white/70 p-5 transition-all hover:border-[#4A9FE8] hover:shadow-[0_4px_15px_rgba(74,159,232,0.12)] hover:-translate-y-0.5"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Store Orders</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        Manage and process customer orders.
                        </p>
                    </Link>
                    
                    <Link
                        href="/seller/reports"
                        className="rounded-xl border border-slate-200 bg-white/70 p-5 transition-all hover:border-[#4A9FE8] hover:shadow-[0_4px_15px_rgba(74,159,232,0.12)] hover:-translate-y-0.5"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Income Report</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        View store revenue and order history.
                        </p>
                    </Link>
                    </div>
                )}

                {profile.activeRole === "BUYER" && (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Link
                        href="/buyer"
                        className="rounded-xl border border-slate-200 bg-white/70 p-5 transition-all hover:border-[#4A9FE8] hover:shadow-[0_4px_15px_rgba(74,159,232,0.12)] hover:-translate-y-0.5"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Buyer Dashboard</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        Manage your wallet, cart, address, and orders.
                        </p>
                    </Link>
                    
                    <Link
                        href="/buyer/reports"
                        className="rounded-xl border border-slate-200 bg-white/70 p-5 transition-all hover:border-[#4A9FE8] hover:shadow-[0_4px_15px_rgba(74,159,232,0.12)] hover:-translate-y-0.5"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Spending Report</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        View your shopping expenses and history.
                        </p>
                    </Link>
                    </div>
                )}

                {profile.activeRole === "DRIVER" && (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Link
                        href="/driver"
                        className="rounded-xl border border-slate-200 bg-white/70 p-5 transition-all hover:border-[#4A9FE8] hover:shadow-[0_4px_15px_rgba(74,159,232,0.12)] hover:-translate-y-0.5"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Driver Dashboard</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        View your active job, job history, and total earnings.
                        </p>
                    </Link>

                    <Link
                        href="/driver/jobs"
                        className="rounded-xl border border-slate-200 bg-white/70 p-5 transition-all hover:border-[#4A9FE8] hover:shadow-[0_4px_15px_rgba(74,159,232,0.12)] hover:-translate-y-0.5"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Find Jobs</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        Search and accept available delivery jobs.
                        </p>
                    </Link>
                    </div>
                )}

                {profile.activeRole === "ADMIN" && (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Link
                        href="/admin/monitoring"
                        className="rounded-xl border border-slate-200 bg-white/70 p-5 transition-all hover:border-[#4A9FE8] hover:shadow-[0_4px_15px_rgba(74,159,232,0.12)] hover:-translate-y-0.5"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Monitoring Dashboard</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        View marketplace statistics and manage overdue orders.
                        </p>
                    </Link>

                    <Link
                        href="/admin/discounts"
                        className="rounded-xl border border-slate-200 bg-white/70 p-5 transition-all hover:border-[#4A9FE8] hover:shadow-[0_4px_15px_rgba(74,159,232,0.12)] hover:-translate-y-0.5"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Manage Discounts</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        Create and monitor Vouchers and Promo codes.
                        </p>
                    </Link>
                    </div>
                )}
            </section>
        </section>
        </main>
    );
}