"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type ToastType = "success" | "error" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "error") => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`flex items-start gap-3 rounded-xl px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] text-sm font-semibold max-w-sm transition-all backdrop-blur-xl border
                ${
                  t.type === "success"
                    ? "bg-emerald-100/60 border-emerald-500/30 text-emerald-900"
                    : t.type === "warning"
                    ? "bg-amber-100/60 border-amber-500/30 text-amber-900"
                    : "bg-red-100/60 border-red-500/30 text-red-900"
                }`}
            >
              <span className="mt-0.5 shrink-0 text-base">
                {t.type === "success" ? "✓" : t.type === "warning" ? "⚠" : "✕"}
              </span>
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => dismissToast(t.id)}
                className="ml-2 shrink-0 opacity-70 hover:opacity-100 text-lg leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
