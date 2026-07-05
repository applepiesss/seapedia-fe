"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getBuyerOrders } from "@/lib/orderApi";
import { Order } from "@/types/order";
import Link from "next/link";

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getAuth()?.token;
        if (!token) return;
        const data = await getBuyerOrders(token);
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-8">Loading orders...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link 
              key={order.id} 
              href={`/buyer/orders/${order.id}`}
              className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Order #{order.id} • {new Date(order.createdAt).toLocaleDateString("id-ID")}
                  </p>
                  <h3 className="font-semibold text-gray-800 text-lg">{order.storeName}</h3>
                </div>
                
                <div className="flex flex-col md:items-end gap-2">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full w-fit">
                    {order.status.replace(/_/g, " ")}
                  </span>
                  <p className="font-bold text-gray-800">Rp {order.finalTotal.toLocaleString("id-ID")}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
