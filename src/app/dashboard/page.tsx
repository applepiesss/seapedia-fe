"use client";

import Header from "@/components/Header";
import { apiRequest } from "@/lib/api";
import { clearAuth, getAuth } from "@/lib/auth";
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

    function logout() {
        clearAuth();
        router.replace("/login");
    }

    if (!profile) {
        return (
        <main className="min-h-screen bg-slate-50">
            <Header />
            <section className="mx-auto max-w-6xl px-6 py-12">
            <p className="text-slate-600">{message || "Loading dashboard..."}</p>
            </section>
        </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">
        <Header />

        <section className="mx-auto max-w-6xl px-6 py-12">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
            <div>
                <p className="text-sm font-semibold uppercase text-emerald-700">
                Dashboard Summary
                </p>
                <h1 className="mt-3 text-3xl font-bold text-slate-950">
                Welcome, {profile.username}
                </h1>
                <p className="mt-2 text-slate-600">{profile.email}</p>
            </div>

            <button
                onClick={logout}
                className="h-11 bg-slate-950 px-5 text-sm font-semibold text-white"
            >
                Logout
            </button>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
            <section className="border border-slate-200 bg-white p-6">
                <h2 className="text-sm font-semibold uppercase text-slate-500">
                Active Role
                </h2>
                <p className="mt-3 text-2xl font-bold text-emerald-700">
                {profile.activeRole}
                </p>
            </section>

            <section className="border border-slate-200 bg-white p-6 md:col-span-2">
                <h2 className="text-sm font-semibold uppercase text-slate-500">
                Roles Owned
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                {profile.roles.map((role) => (
                    <span
                    key={role}
                    className="border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"
                    >
                    {role}
                    </span>
                ))}
                </div>
            </section>
            </div>

            <section className="mt-6 border border-slate-200 bg-white p-6">
                <h2 className="text-sm font-semibold uppercase text-slate-500">
                    Role Actions
                </h2>

                {profile.activeRole === "SELLER" && (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Link
                        href="/seller/store"
                        className="border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-700"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Store Profile</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        Create or update your unique seller store.
                        </p>
                    </Link>

                    <Link
                        href="/seller/products"
                        className="border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-700"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Product Management</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        Add, update, and delete products owned by your store.
                        </p>
                    </Link>
                    
                    <Link
                        href="/seller/orders"
                        className="border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-700"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Store Orders</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        Manage and process customer orders.
                        </p>
                    </Link>
                    
                    <Link
                        href="/seller/reports"
                        className="border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-700"
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
                        className="border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-700"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Buyer Dashboard</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        Manage your wallet, cart, address, and orders.
                        </p>
                    </Link>
                    
                    <Link
                        href="/buyer/reports"
                        className="border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-700"
                    >
                        <h3 className="text-lg font-bold text-slate-950">Spending Report</h3>
                        <p className="mt-2 text-sm text-slate-600">
                        View your shopping expenses and history.
                        </p>
                    </Link>
                    </div>
                )}

                {profile.activeRole === "DRIVER" && (
                    <p className="mt-4 text-sm text-slate-600">
                    Driver delivery jobs and earnings will be introduced in later levels.
                    </p>
                )}

                {profile.activeRole === "ADMIN" && (
                    <p className="mt-4 text-sm text-slate-600">
                    Admin monitoring tools will be introduced in later levels.
                    </p>
                )}
            </section>

            <section className="mt-6 border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase text-slate-500">
                Financial Summary Placeholder
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div>
                <p className="text-sm text-slate-500">Wallet balance</p>
                <p className="mt-1 font-semibold text-slate-950">
                    {profile.financialSummary.walletBalance}
                </p>
                </div>
                <div>
                <p className="text-sm text-slate-500">Seller income</p>
                <p className="mt-1 font-semibold text-slate-950">
                    {profile.financialSummary.sellerIncome}
                </p>
                </div>
                <div>
                <p className="text-sm text-slate-500">Driver earnings</p>
                <p className="mt-1 font-semibold text-slate-950">
                    {profile.financialSummary.driverEarnings}
                </p>
                </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">
                {profile.financialSummary.note}
            </p>
            </section>
        </section>
        </main>
    );
}