"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getVouchers, getPromos } from "@/lib/adminApi";
import { Voucher, Promo } from "@/types/admin";
import Header from "@/components/Header";
import Link from "next/link";

export default function ManageDiscountsPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const token = getAuth()?.token;
        if (!token) return;
        const [vData, pData] = await Promise.all([
          getVouchers(token),
          getPromos(token)
        ]);
        setVouchers(vData);
        setPromos(pData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, []);

  if (loading) return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#7FDBDA] rounded-full blur-[120px]" />
      </div>

      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-[#4A9FE8] mb-4 transition-colors hover:text-[#25a9a8] inline-block">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-950">Manage Discounts</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vouchers */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-950">Vouchers</h2>
              <Link href="/admin/discounts/vouchers/create" className="rounded-xl px-4 py-2 bg-gradient-to-r from-[#4A9FE8] to-[#7FDBDA] text-white font-semibold text-sm transition-all hover:shadow-[0_4px_15px_rgba(74,159,232,0.4)] hover:opacity-90">
                + Create Voucher
              </Link>
            </div>
            {vouchers.length === 0 ? (
              <p className="text-slate-500 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 text-center shadow-[0_4px_20px_rgba(74,159,232,0.08)]">No vouchers found.</p>
            ) : (
              <div className="space-y-4">
                {vouchers.map(v => (
                  <div key={v.id} className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-5 shadow-[0_4px_20px_rgba(74,159,232,0.08)]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono bg-[#4A9FE8]/10 text-[#4A9FE8] border border-[#4A9FE8]/20 px-3 py-1 rounded-lg font-bold text-sm">{v.code}</span>
                      <span className="text-lg font-bold text-green-600">Rp {v.discountAmount.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="text-sm text-slate-600 flex justify-between">
                      <span>Remaining usages: {v.remainingUsage}</span>
                      <span>Expires: {new Date(v.expiryDate).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Promos */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-950">Promos</h2>
              <Link href="/admin/discounts/promos/create" className="rounded-xl px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-400 text-white font-semibold text-sm transition-all hover:shadow-[0_4px_15px_rgba(168,85,247,0.35)] hover:opacity-90">
                + Create Promo
              </Link>
            </div>
            {promos.length === 0 ? (
              <p className="text-slate-500 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 text-center shadow-[0_4px_20px_rgba(74,159,232,0.08)]">No promos found.</p>
            ) : (
              <div className="space-y-4">
                {promos.map(p => (
                  <div key={p.id} className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-5 shadow-[0_4px_20px_rgba(74,159,232,0.08)]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1 rounded-lg font-bold text-sm">{p.code}</span>
                      <span className="text-lg font-bold text-green-600">{p.discountPercentage}% OFF</span>
                    </div>
                    <div className="text-sm text-slate-600 flex justify-end">
                      <span>Expires: {new Date(p.expiryDate).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
