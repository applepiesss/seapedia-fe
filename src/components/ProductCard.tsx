import Link from "next/link";
import type { ProductResponse } from "@/types/seller";

function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}

export default function ProductCard({ product }: { product: ProductResponse }) {
    return (
        <article className="border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase text-emerald-700">
            {product.storeName}
        </p>
        <h2 className="mt-2 text-lg font-bold text-slate-950">
            {product.productName}
        </h2>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {product.description}
        </p>
        <p className="mt-4 text-xl font-bold text-slate-950">
            {formatRupiah(product.price)}
        </p>
        <p className="mt-2 text-sm text-slate-600">Stock {product.stock}</p>
        <Link
            href={`/products/${product.id}`}
            className="mt-5 inline-flex text-sm font-semibold text-emerald-700"
        >
            View details
        </Link>
        </article>
    );
}