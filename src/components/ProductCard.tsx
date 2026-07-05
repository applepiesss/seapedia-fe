import Link from "next/link";
import type { ProductResponse } from "@/types/seller";

function formatRupiah(value: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}

export default function ProductCard({ product }: { product: any }) {
    return (
        <article className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(74,159,232,0.12)] hover:border-[#7FDBDA]">
        <p className="text-xs font-semibold uppercase bg-gradient-to-r from-[#4A9FE8] to-[#25a9a8] bg-clip-text text-transparent">
            {product.storeName}
        </p>
        <h2 className="mt-2 text-lg font-bold text-slate-950">
            {product.productName || product.name}
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
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#4A9FE8] transition-colors hover:text-[#25a9a8]"
        >
            View details
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
        </Link>
        </article>
    );
}