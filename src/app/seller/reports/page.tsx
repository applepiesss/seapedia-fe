"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getSellerReport } from "@/lib/sellerApi";
import { SellerReport } from "@/types/report";
import Link from "next/link";

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

  if (loading) return <div className="p-8">Loading reports...</div>;
  if (!report) return <div className="p-8">Report not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Income Report</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
          <p className="text-gray-500 mb-2 font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-800">Rp {report.totalRevenue.toLocaleString("id-ID")}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
          <p className="text-gray-500 mb-2 font-medium">Total Orders Processed</p>
          <p className="text-3xl font-bold text-gray-800">{report.orders.length}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-800">Order History</h2>
      {report.orders.length === 0 ? (
        <p className="text-gray-500 bg-white p-6 rounded-xl border border-gray-100 text-center">No orders found.</p>
      ) : (
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Order ID</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Revenue (Subtotal)</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {report.orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium">#{order.id}</td>
                  <td className="p-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString("id-ID")}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-gray-800">Rp {order.finalTotal.toLocaleString("id-ID")}</td>
                  <td className="p-4 text-center">
                    <Link href={`/seller/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
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
  );
}
