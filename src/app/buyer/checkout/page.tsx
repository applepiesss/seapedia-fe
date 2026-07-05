"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getCheckoutSummary, checkout } from "@/lib/buyerApi";
import { CheckoutSummary } from "@/types/order";
import { useRouter } from "next/navigation";

export default function BuyerCheckoutPage() {
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState("REGULAR");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const fetchSummary = async (method: string) => {
    setLoading(true);
    try {
      const token = getAuth()?.token;
      if (!token) return;
      const data = await getCheckoutSummary(token, method);
      setSummary(data);
    } catch (e: any) {
      alert(e.message || "Failed to fetch checkout summary. Cart might be empty.");
      router.push("/buyer/cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(deliveryMethod);
  }, [deliveryMethod]);

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const token = getAuth()?.token;
      if (!token) return;
      await checkout(token, deliveryMethod);
      alert("Checkout successful!");
      router.push("/buyer/orders");
    } catch (e: any) {
      alert(`Checkout failed: ${e.message || "Unknown error"}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading && !summary) return <div className="p-8 text-center">Loading checkout...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Delivery Method</h2>
            <div className="space-y-3">
              {["INSTANT", "NEXT_DAY", "REGULAR"].map((method) => (
                <label key={method} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${deliveryMethod === method ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value={method}
                    checked={deliveryMethod === method}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{method.replace("_", " ")}</p>
                    <p className="text-sm text-gray-500">
                      Fee: Rp {method === "INSTANT" ? "20.000" : method === "NEXT_DAY" ? "12.000" : "8.000"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Payment Summary</h2>
          {summary && (
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rp {summary.subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>PPN (12%)</span>
                <span>Rp {summary.ppn.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>Rp {summary.deliveryFee.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 text-base pt-3 border-t">
                <span>Final Total</span>
                <span>Rp {summary.finalTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>
          )}
          
          <button
            onClick={handleCheckout}
            disabled={processing || loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-300 transition-colors"
          >
            {processing ? "Processing..." : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}
