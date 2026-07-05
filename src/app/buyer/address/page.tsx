"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getAddress, saveAddress } from "@/lib/buyerApi";
import { Address } from "@/types/buyer";

export default function BuyerAddressPage() {
  const [address, setAddress] = useState<Address>({
    recipientName: "",
    phoneNumber: "",
    fullAddress: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = getAuth()?.token;
        if (!token) return;
        const data = await getAddress(token);
        if (data) setAddress(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = getAuth()?.token;
      if (!token) return;
      await saveAddress(token, address);
      alert("Address saved successfully!");
    } catch (e) {
      console.error(e);
      alert("Error saving address");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Delivery Address</h1>
      
      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
          <input
            type="text"
            required
            value={address.recipientName}
            onChange={(e) => setAddress({...address, recipientName: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            required
            value={address.phoneNumber}
            onChange={(e) => setAddress({...address, phoneNumber: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
          <textarea
            required
            rows={4}
            value={address.fullAddress}
            onChange={(e) => setAddress({...address, fullAddress: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-300"
        >
          {saving ? "Saving..." : "Save Address"}
        </button>
      </form>
    </div>
  );
}
