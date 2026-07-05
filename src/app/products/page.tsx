import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-slate-50">
        <Header />

        <section className="mx-auto max-w-6xl px-6 py-12">
            <p className="text-sm font-semibold uppercase text-emerald-700">
            Guest Browsing
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950">
            Public product listing
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
            Guests may browse products and read product details. Private actions
            like checkout, product management, and delivery jobs are not shown.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        </section>
        </main>
    );
}