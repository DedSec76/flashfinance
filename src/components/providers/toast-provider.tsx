
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ToastType = "success" | "error" | "info";

type ToastMessage = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Date.now() + Math.random();

      setToasts((current) => [
        ...current,
        { id, message, type },
      ]);
    },
    [],
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((toast) =>
      window.setTimeout(() => dismissToast(toast.id), 5000),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [toasts, dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.type === "error" ? "alert" : "status"}
            aria-live={toast.type === "error" ? "assertive" : "polite"}
            className={`flex items-start justify-between gap-3 rounded-lg border p-4 shadow-lg ${
              toast.type === "success"
                ? "border-green-200 bg-green-50 text-green-900"
                : toast.type === "error"
                  ? "border-red-200 bg-red-50 text-red-900"
                  : "border-blue-200 bg-blue-50 text-blue-900"
            }`}
          >
            <p className="text-sm font-medium">{toast.message}</p>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 rounded px-2 text-lg leading-none hover:opacity-70"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
