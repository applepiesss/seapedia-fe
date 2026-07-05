import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ApplicationReviewSection from "@/components/ApplicationReviewSection";
import { products } from "@/data/products";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase text-emerald-300">
            Public Marketplace
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-bold">
            One marketplace for buyers, sellers, drivers, and admins.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Guests can browse SEAPEDIA products publicly. Checkout, seller
            management, and delivery jobs are available only after login.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Browse products
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Featured products
            </h2>
            <p className="mt-2 text-slate-600">
              Dummy marketplace data for Level 1 public browsing.
            </p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-emerald-700">
            View all
          </Link>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <ApplicationReviewSection />
    </main>
  );
}