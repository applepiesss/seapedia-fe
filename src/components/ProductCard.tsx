import Link from "next/link";
import { formatRupiah } from "@/data/products";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
    return (
        <article className="border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase text-emerald-700">
            {product.category}
        </p>
        <h2 className="mt-2 text-lg font-bold text-slate-950">{product.name}</h2>
        <p className="mt-1 text-sm text-slate-500">{product.storeName}</p>
        <p className="mt-4 text-xl font-bold text-slate-950">
            {formatRupiah(product.price)}
        </p>
        <p className="mt-2 text-sm text-slate-600">
            Rating {product.rating} · Stock {product.stock}
        </p>
        <Link
            href={`/products/${product.slug}`}
            className="mt-5 inline-flex text-sm font-semibold text-emerald-700"
        >
            View details
        </Link>
        </article>
    );
}