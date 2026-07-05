import Header from "@/components/Header";
import { formatRupiah, products } from "@/data/products";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
    params,
    }: {
    params: Promise<{ slug: string }>;
    }) {
    const { slug } = await params;
    const product = products.find((item) => item.slug === slug);

    if (!product) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-50">
        <Header />

        <section className="mx-auto max-w-5xl px-6 py-12">
            <Link href="/products" className="text-sm font-semibold text-emerald-700">
            Back to products
            </Link>

            <div className="mt-6 border border-slate-200 bg-white p-8">
            <p className="text-sm font-semibold uppercase text-emerald-700">
                {product.category}
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950">
                {product.name}
            </h1>
            <p className="mt-2 text-slate-500">Sold by {product.storeName}</p>
            <p className="mt-6 text-3xl font-bold text-slate-950">
                {formatRupiah(product.price)}
            </p>
            <p className="mt-4 text-sm text-slate-600">
                Rating {product.rating} · Stock {product.stock}
            </p>
            <p className="mt-8 max-w-2xl leading-7 text-slate-700">
                {product.description}
            </p>
            <p className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-500">
                Checkout is hidden for guests and will be introduced in later buyer
                flows.
            </p>
            </div>
        </section>
        </main>
    );
}