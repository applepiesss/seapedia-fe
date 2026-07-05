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

  if (loading) return <div><Header /><div className="p-8">Loading monitoring data...</div></div>;
  if (!summary) return <div><Header /><div className="p-8">Failed to load monitoring data.</div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
            <h1 className="text-3xl font-bold text-gray-800">Marketplace Monitoring</h1>
            <p className="text-gray-500 mt-2">Overview of all system activity and SLA compliance.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleProcessOverdue}
              disabled={processing}
              className="px-5 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-medium disabled:opacity-50"
            >
              Trigger Overdue Check
            </button>
            <button
              onClick={handleSimulateNextDay}
              disabled={processing}
              className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:bg-orange-300 shadow-sm"
            >
              {processing ? "Processing..." : "Simulate Next Day"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Registered Users" value={summary.totalUsers} />
          <StatCard title="Active Stores" value={summary.totalStores} />
          <StatCard title="Total Products" value={summary.totalProducts} />
          <StatCard title="Orders Placed" value={summary.totalOrders} />
          <StatCard title="Vouchers Issued" value={summary.totalVouchers} />
          <StatCard title="Promos Active" value={summary.totalPromos} />
          <StatCard title="Delivery Jobs" value={summary.totalDeliveryJobs} />
          <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-200 flex flex-col justify-center items-center text-center">
            <p className="text-red-700 mb-2 font-medium">Overdue / Returned</p>
            <p className="text-4xl font-bold text-red-700">{summary.totalOverdueOrdersReturned}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Overdue Handling System</h2>
          <p className="text-gray-600 mb-4">
            The SEAPEDIA Overdue Handling system checks all active orders against their Delivery SLA.
            If an order is overdue, the system automatically transitions it to <strong>DIKEMBALIKAN</strong>, 
            restores the product stock to the seller, and refunds the final total back to the Buyer's Wallet.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li><strong>Instant:</strong> 1 Day SLA</li>
            <li><strong>Next Day:</strong> 2 Days SLA</li>
            <li><strong>Regular:</strong> 5 Days SLA</li>
          </ul>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm">
            <strong>Simulation Mode:</strong> Clicking "Simulate Next Day" will artificially age all active orders by 24 hours in the database, allowing you to instantly trigger and demonstrate SLA breaches.
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string, value: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
      <p className="text-gray-500 mb-2 font-medium">{title}</p>
      <p className="text-4xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
