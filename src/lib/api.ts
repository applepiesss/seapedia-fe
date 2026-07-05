const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function apiRequest<T>(
    path: string,
    options: RequestInit = {},
    ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
        "Content-Type": "application/json",
        ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? "Request failed");
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const text = await response.text();
    if (!text) {
        return undefined as unknown as T;
    }

    return JSON.parse(text) as T;
}