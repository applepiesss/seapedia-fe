"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getSellerOrders } from "@/lib/orderApi";
import { Order } from "@/types/order";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  if (loading) return <div className="p-8">Loading incoming orders...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Incoming Orders</h1>
        <Link href="/seller" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">You don't have any incoming orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Order #{order.id} • {new Date(order.createdAt).toLocaleDateString("id-ID")}
                  </p>
                  <p className="font-semibold text-gray-800">
                    Rp {order.finalTotal.toLocaleString("id-ID")}
                  </p>
                </div>
                
                <div className="flex flex-col md:items-end gap-2">
                  <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-full w-fit">
                    {order.status.replace(/_/g, " ")}
                  </span>
                  <Link 
                    href={`/seller/orders/${order.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
