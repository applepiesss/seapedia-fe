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

  if (loading) return <div><Header /><div className="p-8">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-gray-800">Manage Discounts</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vouchers */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Vouchers</h2>
              <Link href="/admin/discounts/vouchers/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                + Create Voucher
              </Link>
            </div>
            {vouchers.length === 0 ? (
              <p className="text-gray-500 bg-white p-6 rounded-xl border border-gray-100 text-center">No vouchers found.</p>
            ) : (
              <div className="space-y-4">
                {vouchers.map(v => (
                  <div key={v.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded font-bold">{v.code}</span>
                      <span className="text-lg font-bold text-green-600">Rp {v.discountAmount.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="text-sm text-gray-600 flex justify-between">
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
              <h2 className="text-xl font-bold text-gray-800">Promos</h2>
              <Link href="/admin/discounts/promos/create" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm">
                + Create Promo
              </Link>
            </div>
            {promos.length === 0 ? (
              <p className="text-gray-500 bg-white p-6 rounded-xl border border-gray-100 text-center">No promos found.</p>
            ) : (
              <div className="space-y-4">
                {promos.map(p => (
                  <div key={p.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono bg-purple-100 text-purple-800 px-3 py-1 rounded font-bold">{p.code}</span>
                      <span className="text-lg font-bold text-green-600">{p.discountPercent}% OFF</span>
                    </div>
                    <div className="text-sm text-gray-600 flex justify-end">
                      <span>Expires: {new Date(p.expiryDate).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
