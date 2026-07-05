"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState, use } from "react";
import { getSellerOrder } from "@/lib/orderApi";
import { processOrder } from "@/lib/sellerApi";
import { OrderDetail } from "@/types/order";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

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

  if (loading) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-slate-500 text-sm">Loading order details...</p>
    </main>
  );
  if (!order) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-slate-500 text-sm">Order not found.</p>
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
        <div className="mb-6 flex justify-between items-end">
          <div>
            <Link href="/seller/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-[#4A9FE8] mb-4 transition-colors hover:text-[#25a9a8] inline-block">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
              Back to Orders
            </Link>
            <h1 className="text-3xl font-bold text-slate-950">Order #{order.id}</h1>
            <p className="text-slate-500 mt-1">Placed on {new Date(order.createdAt).toLocaleString("id-ID")}</p>
          </div>
          {order.status === "SEDANG_DIKEMAS" && (
            <button
              onClick={handleProcessOrder}
              disabled={processing}
              className="rounded-xl px-6 py-2.5 bg-gradient-to-r from-[#4A9FE8] to-[#7FDBDA] text-white font-semibold transition-all hover:shadow-[0_4px_15px_rgba(74,159,232,0.4)] hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              {processing ? "Processing..." : "Process Order"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)]">
              <h2 className="text-xl font-semibold mb-4 text-slate-950">Items Ordered</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <h3 className="font-medium text-slate-900">{item.productName}</h3>
                      <p className="text-sm text-slate-500">{item.quantity} x Rp {item.price.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="font-semibold text-slate-900">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)]">
              <h2 className="text-xl font-semibold mb-4 text-slate-950">Status History</h2>
              <div className="space-y-4">
                {order.statusHistory.map((history, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-2 h-2 mt-2 bg-[#4A9FE8] rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-900">{history.status.replace(/_/g, " ")}</p>
                      <p className="text-sm text-slate-500">{new Date(history.createdAt).toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)] h-fit">
              <h2 className="text-lg font-semibold mb-4 text-slate-950">Summary</h2>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between text-slate-600">
                  <span>Status</span>
                  <span className="font-semibold text-[#4A9FE8]">{order.status.replace(/_/g, " ")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Method</span>
                  <span>{order.deliveryMethod.replace("_", " ")}</span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm pt-4 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>Rp {order.subtotal.toLocaleString("id-ID")}</span>
                </div>
                {order.discount && order.discount > 0 ? (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount ({order.discountType})</span>
                    <span>- Rp {order.discount.toLocaleString("id-ID")}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-slate-600">
                  <span>PPN (12%)</span>
                  <span>Rp {order.ppn.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span>Rp {order.deliveryFee.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-950 text-base pt-3 border-t border-slate-100">
                  <span>Final Total</span>
                  <span>Rp {order.finalTotal.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
