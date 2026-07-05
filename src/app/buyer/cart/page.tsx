"use client";

import { getAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCartItem } from "@/lib/buyerApi";
import { Cart } from "@/types/order";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BuyerCartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const token = getAuth()?.token;
      if (!token) return;
      const data = await getCart(token);
      setCart(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId: number, qty: number) => {
    if (qty < 1) return;
    try {
      const token = getAuth()?.token;
      if (!token) return;
      await updateCartItem(token, productId, qty);
      fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      const token = getAuth()?.token;
      if (!token) return;
      await removeFromCart(token, productId);
      fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Shopping Cart</h1>
      <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mb-6 border border-red-100">
        Note: {cart?.singleStoreRule || "Single-store checkout rule: One cart may only contain products from one store."}
      </p>
      
      {!cart || cart.items.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link href="/products" className="text-blue-600 font-medium hover:underline">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">{item.productName}</h3>
                  <p className="text-blue-600 font-medium mt-1">Rp {item.price.toLocaleString("id-ID")}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <div className="flex items-center gap-3 border rounded-lg p-1">
                    <button 
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      className="px-2 text-gray-500 hover:text-black"
                    >-</button>
                    <span className="w-6 text-center font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      className="px-2 text-gray-500 hover:text-black"
                    >+</button>
                  </div>
                  <button 
                    onClick={() => handleRemove(item.productId)}
                    className="text-sm text-red-500 hover:underline mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-full md:w-80 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h2>
            <div className="flex justify-between items-center py-2 border-t">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-800">Rp {cart.subtotal.toLocaleString("id-ID")}</span>
            </div>
            <button
              onClick={() => router.push("/buyer/checkout")}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium mt-6"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
