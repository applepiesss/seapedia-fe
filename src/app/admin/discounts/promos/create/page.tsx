"use client";

import { getAuth } from "@/lib/auth";
import { useState } from "react";
import { createPromo } from "@/lib/adminApi";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";

export default function CreatePromoPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const token = getAuth()?.token;
      if (!token) return;

      await createPromo(token, {
        code,
        discountPercent: Number(discountPercentage),
        expiryDate: new Date(expiryDate).toISOString()
      });
      
      alert("Promo created successfully!");
      router.push("/admin/discounts");
    } catch (err: any) {
      setError(err.message || "Failed to create promo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-2xl mx-auto p-8">
        <Link href="/admin/discounts" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back</Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Promo</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
            <input 
              type="text" 
              required
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500" 
              placeholder="e.g. FLASH10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage (%)</label>
            <input 
              type="number" 
              required
              min="1"
              max="100"
              value={discountPercentage}
              onChange={e => setDiscountPercentage(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input 
              type="date" 
              required
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 disabled:bg-purple-300"
          >
            {loading ? "Creating..." : "Create Promo"}
          </button>
        </form>
      </div>
    </div>
  );
}
