"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getWallet, topUpWallet } from "@/lib/buyerApi";
import { Wallet } from "@/types/buyer";

export default function BuyerWalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [amount, setAmount] = useState<number>(50000);
  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    try {
      const token = getAuth()?.token;
      if (!token) return;
      const data = await getWallet(token);
      setWallet(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getAuth()?.token;
      if (!token) return;
      await topUpWallet(token, amount);
      alert("Top up successful!");
      fetchWallet();
    } catch (e) {
      console.error(e);
      alert("Error occurred");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Wallet</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Current Balance</h2>
        <p className="text-4xl font-bold text-blue-600">
          Rp {wallet?.balance.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Dummy Top Up</h2>
        <form onSubmit={handleTopUp} className="flex gap-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="1000"
            step="1000"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Top Up
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Transaction History</h2>
        {wallet?.transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <div className="space-y-4">
            {wallet?.transactions.map((tx, idx) => (
              <div key={idx} className="flex justify-between items-center py-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{tx.description}</p>
                  <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString("id-ID")}</p>
                </div>
                <div className={`font-bold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                  {tx.amount > 0 ? "+" : ""}Rp {Math.abs(tx.amount).toLocaleString("id-ID")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
