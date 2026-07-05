"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState, use } from "react";
import { getSellerOrder } from "@/lib/orderApi";
import { processOrder } from "@/lib/sellerApi";
import { OrderDetail } from "@/types/order";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SellerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const fetchOrder = async () => {
    try {
      const token = getAuth()?.token;
      if (!token) return;
      const data = await getSellerOrder(token, unwrappedParams.id);
      setOrder(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [unwrappedParams.id]);

  const handleProcessOrder = async () => {
    setProcessing(true);
    try {
      const token = getAuth()?.token;
      if (!token) return;
      await processOrder(token, Number(unwrappedParams.id));
      alert("Order processed successfully!");
      fetchOrder();
    } catch (e: any) {
      alert(`Failed to process order: ${e.message || "Unknown error"}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-8">Loading order details...</div>;
  if (!order) return <div className="p-8">Order not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <Link href="/seller/orders" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Orders</Link>
          <h1 className="text-3xl font-bold text-gray-800">Order #{order.id}</h1>
          <p className="text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleString("id-ID")}</p>
        </div>
        {order.status === "SEDANG_DIKEMAS" && (
          <button
            onClick={handleProcessOrder}
            disabled={processing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-300"
          >
            {processing ? "Processing..." : "Process Order"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Items Ordered</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.productName}</h3>
                    <p className="text-sm text-gray-500">{item.quantity} x Rp {item.price.toLocaleString("id-ID")}</p>
                  </div>
                  <div className="font-semibold text-gray-800">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Status History</h2>
            <div className="space-y-4">
              {order.statusHistory.map((history, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-800">{history.status.replace(/_/g, " ")}</p>
                    <p className="text-sm text-gray-500">{new Date(history.createdAt).toLocaleString("id-ID")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Status</span>
                <span className="font-semibold text-blue-600">{order.status.replace(/_/g, " ")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Method</span>
                <span>{order.deliveryMethod.replace("_", " ")}</span>
              </div>
            </div>
            
            <div className="space-y-3 text-sm pt-4 border-t">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rp {order.subtotal.toLocaleString("id-ID")}</span>
              </div>
              {order.discount && order.discount > 0 ? (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({order.discountType})</span>
                  <span>- Rp {order.discount.toLocaleString("id-ID")}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-gray-600">
                <span>PPN (12%)</span>
                <span>Rp {order.ppn.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>Rp {order.deliveryFee.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 text-base pt-3 border-t">
                <span>Final Total</span>
                <span>Rp {order.finalTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
