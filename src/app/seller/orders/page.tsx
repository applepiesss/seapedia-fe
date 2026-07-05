"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getSellerOrders } from "@/lib/orderApi";
import { Order } from "@/types/order";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const activeRole = getAuth()?.activeRole;
    if (activeRole !== "SELLER") {
      router.push("/dashboard");
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = getAuth()?.token;
        if (!token) return;
        const data = await getSellerOrders(token);
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [router]);

  if (loading) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-slate-500 text-sm">Loading incoming orders...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#7FDBDA] rounded-full blur-[120px]" />
      </div>

      <Header />

      <div className="max-w-4xl mx-auto p-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-950">Incoming Orders</h1>
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-[#4A9FE8] transition-colors hover:text-[#25a9a8]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Back to Dashboard
          </Link>
        </div>
        
        {orders.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-12 text-center shadow-[0_4px_20px_rgba(74,159,232,0.08)]">
            <p className="text-slate-500">You don&apos;t have any incoming orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)]">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Order #{order.id} • {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </p>
                    <p className="font-semibold text-slate-900">
                      Rp {order.finalTotal.toLocaleString("id-ID")}
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:items-end gap-2">
                    <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-sm font-medium rounded-lg w-fit border border-amber-100">
                      {order.status.replace(/_/g, " ")}
                    </span>
                    <Link 
                      href={`/seller/orders/${order.id}`}
                      className="text-sm font-semibold text-[#4A9FE8] transition-colors hover:text-[#25a9a8]"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
