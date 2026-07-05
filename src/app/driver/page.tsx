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

  if (loading) return <div><Header /><div className="p-8">Loading dashboard...</div></div>;
  if (!dashboard) return <div><Header /><div className="p-8">Failed to load dashboard.</div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Driver Dashboard</h1>
          <Link href="/driver/jobs" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Find Delivery Jobs
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
            <p className="text-gray-500 mb-2 font-medium">Total Earnings</p>
            <p className="text-4xl font-bold text-green-600">Rp {dashboard.totalEarnings.toLocaleString("id-ID")}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
            <p className="text-gray-500 mb-2 font-medium">Deliveries Completed</p>
            <p className="text-4xl font-bold text-gray-800">{dashboard.jobHistory.length}</p>
          </div>
        </div>

        {dashboard.activeJob && (
          <div className="mb-8 bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Active Delivery</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-blue-800">Job #{dashboard.activeJob.id} - Order #{dashboard.activeJob.orderId}</p>
                <p className="text-blue-700">From: {dashboard.activeJob.storeName}</p>
                <p className="text-blue-700 font-medium mt-1">Earning: Rp {dashboard.activeJob.earning.toLocaleString("id-ID")}</p>
              </div>
              <Link href={`/driver/jobs/${dashboard.activeJob.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                View & Complete
              </Link>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4 text-gray-800">Job History</h2>
        {dashboard.jobHistory.length === 0 ? (
          <p className="text-gray-500 bg-white p-6 rounded-xl border border-gray-100 text-center">No completed jobs yet.</p>
        ) : (
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Job ID</th>
                  <th className="p-4 font-semibold text-gray-600">Date Completed</th>
                  <th className="p-4 font-semibold text-gray-600">Store</th>
                  <th className="p-4 font-semibold text-gray-600">Earning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashboard.jobHistory.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium">#{job.id}</td>
                    <td className="p-4 text-gray-600">{job.completedAt ? new Date(job.completedAt).toLocaleString("id-ID") : "-"}</td>
                    <td className="p-4 text-gray-800">{job.storeName}</td>
                    <td className="p-4 font-medium text-green-600">+ Rp {job.earning.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
