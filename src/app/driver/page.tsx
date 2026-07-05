"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getDriverDashboard } from "@/lib/driverApi";
import { DriverDashboard } from "@/types/driver";
import Link from "next/link";
import Header from "@/components/Header";

export default function DriverDashboardPage() {
  const [dashboard, setDashboard] = useState<DriverDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = getAuth()?.token;
        if (!token) return;
        const data = await getDriverDashboard(token);
        setDashboard(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500 text-sm">Loading dashboard...</p>
      </div>
    </main>
  );
  if (!dashboard) return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-500 text-sm">Failed to load dashboard.</p>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-[#4A9FE8] to-[#25a9a8] bg-clip-text text-transparent">
              Driver Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Your delivery overview</h1>
          </div>
          <Link href="/driver/jobs" className="rounded-xl px-5 py-2.5 bg-gradient-to-r from-[#4A9FE8] to-[#7FDBDA] text-white font-semibold text-sm transition-all hover:shadow-[0_4px_15px_rgba(74,159,232,0.4)] hover:opacity-90 active:scale-[0.98]">
            Find Delivery Jobs
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)] flex flex-col justify-center items-center text-center">
            <p className="text-slate-500 mb-2 font-medium">Total Earnings</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-[#4A9FE8] to-[#25a9a8] bg-clip-text text-transparent">
              Rp {dashboard.totalEarnings.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)] flex flex-col justify-center items-center text-center">
            <p className="text-slate-500 mb-2 font-medium">Deliveries Completed</p>
            <p className="text-4xl font-bold text-slate-950">{dashboard.jobHistory.length}</p>
          </div>
        </div>

        {dashboard.activeJob && (
          <div className="mb-8 rounded-xl border border-[#4A9FE8]/30 bg-[#4A9FE8]/5 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.1)]">
            <h2 className="text-xl font-bold mb-4 text-slate-950">Active Delivery</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-900">Job #{dashboard.activeJob.id} - Order #{dashboard.activeJob.orderId}</p>
                <p className="text-slate-600 mt-1">From: {dashboard.activeJob.storeName}</p>
                <p className="text-[#4A9FE8] font-medium mt-1">Earning: Rp {dashboard.activeJob.earning.toLocaleString("id-ID")}</p>
              </div>
              <Link href={`/driver/jobs/${dashboard.activeJob.id}`} className="rounded-xl px-4 py-2 bg-gradient-to-r from-[#4A9FE8] to-[#7FDBDA] text-white font-semibold text-sm transition-all hover:opacity-90">
                View & Complete
              </Link>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4 text-slate-950">Job History</h2>
        {dashboard.jobHistory.length === 0 ? (
          <p className="text-slate-500 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 text-center shadow-[0_4px_20px_rgba(74,159,232,0.08)]">
            No completed jobs yet.
          </p>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(74,159,232,0.08)] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-600">Job ID</th>
                  <th className="p-4 font-semibold text-slate-600">Date Completed</th>
                  <th className="p-4 font-semibold text-slate-600">Store</th>
                  <th className="p-4 font-semibold text-slate-600">Earning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboard.jobHistory.map((job) => (
                  <tr key={job.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 font-medium text-slate-900">#{job.id}</td>
                    <td className="p-4 text-slate-600">{job.completedAt ? new Date(job.completedAt).toLocaleString("id-ID") : "-"}</td>
                    <td className="p-4 text-slate-800">{job.storeName}</td>
                    <td className="p-4 font-medium text-[#4A9FE8]">+ Rp {job.earning.toLocaleString("id-ID")}</td>
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
