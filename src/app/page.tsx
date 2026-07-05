"use client";

import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ApplicationReviewSection from "@/components/ApplicationReviewSection";
import { getFeaturedProducts } from "@/lib/publicApi";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    getFeaturedProducts().then(setFeaturedProducts);
  }, []);

  return (
    <main className="min-h-screen">
      <Header />

      <section className="bg-gradient-to-br from-[#0A0E1A] to-[#1B2A4A] px-6 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-5%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-1/3 h-1/3 bg-[#7FDBDA] rounded-full blur-[100px]" />
        </div>
        <div className="mx-auto max-w-6xl relative z-10">
          <p className="text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-[#4A9FE8] to-[#7FDBDA] bg-clip-text text-transparent">
            Public Marketplace
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight text-white">
            One marketplace for buyers, sellers, drivers, and admins.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#8B9BB8]">
            No account needed to explore what's on SEAPEDIA. Log in when you're
            ready to buy, sell, or deliver.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-[#4A9FE8] to-[#7FDBDA] px-6 py-3 text-sm font-semibold text-[#0A0E1A] transition-all hover:shadow-[0_6px_20px_rgba(74,159,232,0.4)] hover:opacity-90 active:scale-[0.98]"
          >
            Browse products
          </Link>
        </div>
      </section>

      <section className="bg-white px-6 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
          <div className="absolute top-[-20%] right-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
        </div>
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Featured products
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                The latest products added to the SEAPEDIA marketplace.
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold bg-gradient-to-r from-[#4A9FE8] to-[#25a9a8] bg-clip-text text-transparent transition-opacity hover:opacity-70 shrink-0"
            >
              View all
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {featuredProducts.length === 0 && (
              <p className="text-sm text-slate-500 col-span-3 py-8 text-center">
                No products yet. Add some through the Seller dashboard!
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="relative w-full overflow-hidden leading-none bg-white">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e0f0fd" />
              <stop offset="50%" stopColor="#d4f0f0" />
              <stop offset="100%" stopColor="#e0f0fd" />
            </linearGradient>
          </defs>
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="url(#waveGrad)"
          />
        </svg>
      </div>

      <ApplicationReviewSection />
    </main>
  );
}