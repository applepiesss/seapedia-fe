import type { AuthResponse } from "@/types/auth";

const AUTH_STORAGE_KEY = "seapedia-auth";

export function saveAuth(auth: AuthResponse) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function getAuth(): AuthResponse | null {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    try {
        return JSON.parse(stored) as AuthResponse;
    } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
    }
}

export function clearAuth() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
}