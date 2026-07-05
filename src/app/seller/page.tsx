import Header from "@/components/Header";
import Link from "next/link";

export default function SellerHomePage() {
    return (
        <main className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-[#4A9FE8] rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-[#7FDBDA] rounded-full blur-[120px]" />
        </div>

        <Header />

        <section className="mx-auto max-w-6xl px-6 py-12 relative z-10">
            <p className="text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-[#4A9FE8] to-[#25a9a8] bg-clip-text text-transparent">
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
            <Link href="/seller/store" className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)] transition-all hover:shadow-[0_6px_24px_rgba(74,159,232,0.16)] hover:-translate-y-0.5">
                <h2 className="text-xl font-bold text-slate-950">Store Profile</h2>
                <p className="mt-2 text-sm text-slate-600">
                Create or update your seller store name.
                </p>
            </Link>

            <Link href="/seller/products" className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)] transition-all hover:shadow-[0_6px_24px_rgba(74,159,232,0.16)] hover:-translate-y-0.5">
                <h2 className="text-xl font-bold text-slate-950">Products</h2>
                <p className="mt-2 text-sm text-slate-600">
                Create, update, and delete products owned by your store.
                </p>
            </Link>

            <Link href="/seller/orders" className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-6 shadow-[0_4px_20px_rgba(74,159,232,0.08)] transition-all hover:shadow-[0_6px_24px_rgba(74,159,232,0.16)] hover:-translate-y-0.5">
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