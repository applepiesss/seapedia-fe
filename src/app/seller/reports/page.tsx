"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getSellerReport } from "@/lib/sellerApi";
import { SellerReport } from "@/types/report";
import Link from "next/link";
import Header from "@/components/Header";

export default function SellerReportsPage() {
  const [report, setReport] = useState<SellerReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = getAuth()?.token;
        if (!token) return;
        const data = await getSellerReport(token);
        setReport(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-slate-500 text-sm">Loading reports...</p>
    </main>
  );
  if (!report) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-slate-500 text-sm">Report not found.</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#7FDBDA] rounded-full blur-[120px]" />
      </div>

      <Header />

      <div className="max-w-5xl mx-auto p-8 relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-slate-950">Income Report</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)] flex flex-col justify-center items-center text-center">
            <p className="text-slate-500 mb-2 font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-950">Rp {report.totalRevenue.toLocaleString("id-ID")}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)] flex flex-col justify-center items-center text-center">
            <p className="text-slate-500 mb-2 font-medium">Total Orders Processed</p>
            <p className="text-3xl font-bold text-slate-950">{report.orders.length}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 text-slate-950">Order History</h2>
        {report.orders.length === 0 ? (
          <p className="text-slate-500 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 text-center shadow-[0_4px_20px_rgba(74,159,232,0.08)]">No orders found.</p>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(74,159,232,0.08)] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-600">Order ID</th>
                  <th className="p-4 font-semibold text-slate-600">Date</th>
                  <th className="p-4 font-semibold text-slate-600">Status</th>
                  <th className="p-4 font-semibold text-slate-600">Revenue (Subtotal)</th>
                  <th className="p-4 font-semibold text-slate-600 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 font-medium text-slate-900">#{order.id}</td>
                    <td className="p-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString("id-ID")}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-[#4A9FE8]/10 text-[#4A9FE8] text-xs font-semibold rounded-lg border border-[#4A9FE8]/20">
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-900">Rp {order.finalTotal.toLocaleString("id-ID")}</td>
                    <td className="p-4 text-center">
                      <Link href={`/seller/orders/${order.id}`} className="text-[#4A9FE8] hover:text-[#25a9a8] font-medium text-sm transition-colors">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
