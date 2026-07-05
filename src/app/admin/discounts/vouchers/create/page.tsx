"use client";

import { getAuth } from "@/lib/auth";
import { useState } from "react";
import { createVoucher } from "@/lib/adminApi";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";

export default function CreateVoucherPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [maxUsages, setMaxUsages] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const token = getAuth()?.token;
      if (!token) return;

      await createVoucher(token, {
        code,
        discountAmount: Number(discountAmount),
        expiryDate: new Date(expiryDate).toISOString(),
        remainingUsage: Number(maxUsages)
      });
      
      alert("Voucher created successfully!");
      router.push("/admin/discounts");
    } catch (err: any) {
      setError(err.message || "Failed to create voucher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-2xl mx-auto p-8">
        <Link href="/admin/discounts" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back</Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Voucher</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Code</label>
            <input 
              type="text" 
              required
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              placeholder="e.g. MEGASEAPEDIA"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount (Rp)</label>
            <input 
              type="number" 
              required
              min="1"
              value={discountAmount}
              onChange={e => setDiscountAmount(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Usages</label>
            <input 
              type="number" 
              required
              min="1"
              value={maxUsages}
              onChange={e => setMaxUsages(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input 
              type="date" 
              required
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Creating..." : "Create Voucher"}
          </button>
        </form>
      </div>
    </div>
  );
}
