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
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="text-lg font-extrabold bg-gradient-to-r from-[#4A9FE8] to-[#25a9a8] bg-clip-text text-transparent">
            SEAPEDIA
            </Link>

            <div className="flex items-center gap-5 text-sm font-medium text-slate-700">
            <Link href="/products" className="transition-colors hover:text-[#4A9FE8]">Products</Link>

            {auth ? (
                <>
                <Link href="/dashboard" className="transition-colors hover:text-[#4A9FE8]">Dashboard</Link>

                {auth.activeRole === "SELLER" && (
                    <Link href="/seller" className="transition-colors hover:text-[#4A9FE8]">Seller</Link>
                )}

                {auth.activeRole === "BUYER" && (
                    <Link href="/buyer" className="transition-colors hover:text-[#4A9FE8]">Buyer</Link>
                )}

                {auth.activeRole === "DRIVER" && (
                    <Link href="/driver" className="transition-colors hover:text-[#4A9FE8]">Driver</Link>
                )}

                {auth.roles.length > 1 && (
                    <Link href="/choose-role" className="transition-colors hover:text-[#4A9FE8]">Switch Role</Link>
                )}

                <span className="rounded-lg border border-slate-200 bg-white/50 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm">
                    {auth.activeRole ?? "No active role"}
                </span>

                <button
                    onClick={logout}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-white transition-colors hover:bg-slate-800 active:scale-[0.98]"
                >
                    Logout
                </button>
                </>
            ) : (
                <>
                <Link href="/login" className="transition-colors hover:text-[#4A9FE8]">Login</Link>
                <Link
                    href="/register"
                    className="rounded-lg bg-gradient-to-r from-[#4A9FE8] to-[#7FDBDA] px-4 py-2 text-white transition-all hover:shadow-[0_4px_15px_rgba(74,159,232,0.4)] hover:opacity-90 active:scale-[0.98]"
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