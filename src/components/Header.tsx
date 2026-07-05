"use client";

import { clearAuth, getAuth } from "@/lib/auth";
import type { AuthResponse } from "@/types/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
    const router = useRouter();
    const [auth, setAuth] = useState<AuthResponse | null>(null);

    useEffect(() => {
        setAuth(getAuth());
    }, []);

    function logout() {
        clearAuth();
        setAuth(null);
        router.replace("/login");
    }

    return (
        <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="text-lg font-bold text-emerald-700">
            SEAPEDIA
            </Link>

            <div className="flex items-center gap-5 text-sm font-medium text-slate-700">
            <Link href="/products">Products</Link>

            {auth ? (
                <>
                <Link href="/dashboard">Dashboard</Link>

                {auth.activeRole === "SELLER" && (
                    <Link href="/seller">Seller</Link>
                )}

                {auth.roles.length > 1 && (
                    <Link href="/choose-role">Switch Role</Link>
                )}

                <span className="border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {auth.activeRole ?? "No active role"}
                </span>

                <button
                    onClick={logout}
                    className="bg-slate-950 px-4 py-2 text-white"
                >
                    Logout
                </button>
                </>
            ) : (
                <>
                <Link href="/login">Login</Link>
                <Link
                    href="/register"
                    className="bg-emerald-700 px-4 py-2 text-white"
                >
                    Register
                </Link>
                </>
            )}
            </div>
        </nav>
        </header>
    );
}