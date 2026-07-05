"use client";

import { getAuth } from "@/lib/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeRole = getAuth()?.activeRole;
    if (activeRole !== "BUYER") {
      router.push("/dashboard");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Buyer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/buyer/wallet" className="block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Wallet</h2>
          <p className="text-gray-500">Manage your balance and top up.</p>
        </Link>
        
        <Link href="/buyer/address" className="block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Address</h2>
          <p className="text-gray-500">Update your delivery address.</p>
        </Link>
        
        <Link href="/buyer/cart" className="block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Cart</h2>
          <p className="text-gray-500">View items ready for checkout.</p>
        </Link>
        
        <Link href="/buyer/orders" className="block p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Orders</h2>
          <p className="text-gray-500">Track your order history.</p>
        </Link>
      </div>
    </div>
  );
}
