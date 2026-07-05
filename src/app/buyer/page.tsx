"use client";

import { getAuth } from "@/lib/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function BuyerDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeRole = getAuth()?.activeRole;
    if (activeRole !== "BUYER") {
      router.push("/dashboard");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-slate-500 text-sm">Loading...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#7FDBDA] rounded-full blur-[120px]" />
      </div>

      <Header />

      <section className="mx-auto max-w-4xl px-6 py-12 relative z-10">
        <p className="text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-[#4A9FE8] to-[#25a9a8] bg-clip-text text-transparent">
          Buyer Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 mb-8">
          Manage your shopping
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link href="/buyer/wallet" className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)] transition-all hover:border-[#4A9FE8] hover:shadow-[0_6px_24px_rgba(74,159,232,0.16)] hover:-translate-y-0.5">
            <h2 className="text-xl font-bold text-slate-950 mb-2">Wallet</h2>
            <p className="text-slate-600 text-sm">Manage your balance and top up.</p>
          </Link>

          <Link href="/buyer/address" className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)] transition-all hover:border-[#4A9FE8] hover:shadow-[0_6px_24px_rgba(74,159,232,0.16)] hover:-translate-y-0.5">
            <h2 className="text-xl font-bold text-slate-950 mb-2">Address</h2>
            <p className="text-slate-600 text-sm">Update your delivery address.</p>
          </Link>

          <Link href="/buyer/cart" className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)] transition-all hover:border-[#4A9FE8] hover:shadow-[0_6px_24px_rgba(74,159,232,0.16)] hover:-translate-y-0.5">
            <h2 className="text-xl font-bold text-slate-950 mb-2">Cart</h2>
            <p className="text-slate-600 text-sm">View items ready for checkout.</p>
          </Link>

          <Link href="/buyer/orders" className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)] transition-all hover:border-[#4A9FE8] hover:shadow-[0_6px_24px_rgba(74,159,232,0.16)] hover:-translate-y-0.5">
            <h2 className="text-xl font-bold text-slate-950 mb-2">Orders</h2>
            <p className="text-slate-600 text-sm">Track your order history.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
