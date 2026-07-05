import Link from "next/link";

export default function Header() {
    return (
        <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="text-lg font-bold text-emerald-700">
            SEAPEDIA
            </Link>

            <div className="flex items-center gap-5 text-sm font-medium text-slate-700">
            <Link href="/products">Products</Link>
            <Link href="/login">Login</Link>
            <Link
                href="/register"
                className="bg-emerald-700 px-4 py-2 text-white"
            >
                Register
            </Link>
            </div>
        </nav>
        </header>
    );
}