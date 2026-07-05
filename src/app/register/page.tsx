"use client";

import Header from "@/components/Header";
import { apiRequest } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import type { AuthResponse, Role } from "@/types/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const roleOptions: Role[] = ["BUYER", "SELLER", "DRIVER"];

export default function RegisterPage() {
    const [roles, setRoles] = useState<Role[]>(["BUYER"]);
    const [message, setMessage] = useState("");
    const router = useRouter();

    function toggleRole(role: Role) {
        setRoles((current) =>
        current.includes(role)
            ? current.filter((item) => item !== role)
            : [...current, role],
        );
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");

        if (roles.length === 0) {
        setMessage("Please choose at least one role.");
        return;
        }

        const formData = new FormData(event.currentTarget);

        try {
        const auth = await apiRequest<AuthResponse>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
            username: formData.get("username"),
            email: formData.get("email"),
            phoneNumber: formData.get("phoneNumber"),
            password: formData.get("password"),
            roles,
            }),
        });

        saveAuth(auth);

        if (auth.mustChooseRole) {
            router.replace("/choose-role");
            return;
        }

        router.replace("/dashboard");
        } catch (error) {
        setMessage(error instanceof Error ? error.message : "Register failed");
        }
    }

    return (
        <main className="min-h-screen bg-slate-50">
        <Header />
        <section className="mx-auto max-w-md px-6 py-12">
            <h1 className="text-3xl font-bold text-slate-950">Register</h1>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <input
                name="username"
                className="h-11 border px-3"
                placeholder="Username"
            />
            <input
                name="email"
                className="h-11 border px-3"
                placeholder="Email"
            />
            <input
                name="phoneNumber"
                className="h-11 border px-3"
                placeholder="Phone number"
            />
            <input
                name="password"
                className="h-11 border px-3"
                placeholder="Password"
                type="password"
            />

            <div className="grid gap-2">
                <p className="text-sm font-medium text-slate-700">Choose roles</p>
                {roleOptions.map((role) => (
                <label key={role} className="flex items-center gap-2 text-sm">
                    <input
                    type="checkbox"
                    checked={roles.includes(role)}
                    onChange={() => toggleRole(role)}
                    />
                    {role}
                </label>
                ))}
            </div>

            <button className="h-11 bg-emerald-700 font-semibold text-white">
                Register
            </button>
            </form>

            {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
        </section>
        </main>
    );
}