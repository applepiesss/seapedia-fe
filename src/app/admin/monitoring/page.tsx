"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getAdminMonitoringSummary, simulateNextDay, processOverdueOrders } from "@/lib/adminApi";
import { AdminMonitoringSummary } from "@/types/admin";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminMonitoringPage() {
  const [summary, setSummary] = useState<AdminMonitoringSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const fetchSummary = async () => {
    try {
      const token = getAuth()?.token;
      if (!token) {
        router.push("/login");
        return;
      }
      const data = await getAdminMonitoringSummary(token);
      setSummary(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load monitoring summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [router]);

  const handleSimulateNextDay = async () => {
    if (!confirm("Are you sure? This will artificially age all active orders by 1 day and trigger the overdue check.")) return;
    
    setProcessing(true);
    try {
      const token = getAuth()?.token;
      if (!token) return;
      const res = await simulateNextDay(token);
      alert(res.message);
      fetchSummary();
    } catch (e: any) {
      alert(`Simulation failed: ${e.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessOverdue = async () => {
    setProcessing(true);
    try {
      const token = getAuth()?.token;
      if (!token) return;
      const res = await processOverdueOrders(token);
      alert(res.message);
      fetchSummary();
    } catch (e: any) {
      alert(`Overdue check failed: ${e.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500 text-sm">Loading monitoring data...</p>
      </div>
    </main>
  );
  if (!summary) return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500 text-sm">Failed to load monitoring data.</p>
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
        <div className="mb-8 flex justify-between items-end">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-[#4A9FE8] mb-4 transition-colors hover:text-[#25a9a8] inline-block">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-950">Marketplace Monitoring</h1>
            <p className="text-slate-500 mt-2">Overview of all system activity and SLA compliance.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleProcessOverdue}
              disabled={processing}
              className="rounded-xl px-5 py-2.5 border border-slate-200 bg-white text-slate-700 font-semibold text-sm transition-all hover:border-slate-300 hover:shadow-sm disabled:opacity-50"
            >
              Trigger Overdue Check
            </button>
            <button
              onClick={handleSimulateNextDay}
              disabled={processing}
              className="rounded-xl px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold text-sm transition-all hover:shadow-[0_4px_15px_rgba(249,115,22,0.35)] hover:opacity-90 disabled:opacity-50"
            >
              {processing ? "Processing..." : "Simulate Next Day"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          <StatCard title="Registered Users" value={summary.totalUsers} />
          <StatCard title="Active Stores" value={summary.totalStores} />
          <StatCard title="Total Products" value={summary.totalProducts} />
          <StatCard title="Orders Placed" value={summary.totalOrders} />
          <StatCard title="Vouchers Issued" value={summary.totalVouchers} />
          <StatCard title="Promos Active" value={summary.totalPromos} />
          <StatCard title="Delivery Jobs" value={summary.totalDeliveryJobs} />
          <div className="rounded-xl border border-red-200 bg-red-50/80 p-6 flex flex-col justify-center items-center text-center">
            <p className="text-red-600 mb-2 font-medium">Overdue / Returned</p>
            <p className="text-4xl font-bold text-red-600">{summary.totalOverdueOrdersReturned}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)]">
          <h2 className="text-xl font-bold text-slate-950 mb-4">Overdue Handling System</h2>
          <p className="text-slate-600 mb-4">
            The SEAPEDIA Overdue Handling system checks all active orders against their Delivery SLA.
            If an order is overdue, the system automatically transitions it to <strong>DIKEMBALIKAN</strong>, 
            restores the product stock to the seller, and refunds the final total back to the Buyer&apos;s Wallet.
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-6">
            <li><strong>Instant:</strong> 1 Day SLA</li>
            <li><strong>Next Day:</strong> 2 Days SLA</li>
            <li><strong>Regular:</strong> 5 Days SLA</li>
          </ul>
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-sm">
            <strong>Simulation Mode:</strong> Clicking &quot;Simulate Next Day&quot; will artificially age all active orders by 24 hours in the database, allowing you to instantly trigger and demonstrate SLA breaches.
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value }: { title: string, value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)] flex flex-col justify-center items-center text-center">
      <p className="text-slate-500 mb-2 font-medium text-sm">{title}</p>
      <p className="text-4xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
