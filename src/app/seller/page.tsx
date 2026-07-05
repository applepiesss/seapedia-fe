import Header from "@/components/Header";
import Link from "next/link";

export default function SellerHomePage() {
    return (
        <main className="min-h-screen bg-slate-50">
        <Header />

        <section className="mx-auto max-w-6xl px-6 py-12">
            <p className="text-sm font-semibold uppercase text-emerald-700">
            Seller Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Manage your SEAPEDIA store
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
            Create your unique store identity and manage products that appear in
            the public catalog.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Link href="/seller/store" className="border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">Store Profile</h2>
                <p className="mt-2 text-sm text-slate-600">
                Create or update your seller store name.
                </p>
            </Link>

            <Link href="/seller/products" className="border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">Products</h2>
                <p className="mt-2 text-sm text-slate-600">
                Create, update, and delete products owned by your store.
                </p>
            </Link>

            <Link href="/seller/orders" className="border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">Incoming Orders</h2>
                <p className="mt-2 text-sm text-slate-600">
                Manage incoming orders from buyers.
                </p>
            </Link>
            </div>
        </section>
        </main>
    );
}