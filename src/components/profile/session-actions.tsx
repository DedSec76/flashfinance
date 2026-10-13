"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LoaderCircle } from "lucide-react";

export function SessionActions() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.error?.message ?? "Could not sign out.",
        );
      }

      router.replace("/login");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message
          : "An unexpected error occured",
      );
      setLoading(false);
    }
  }

  return (
    <section className="card form-panel">
      <h2>Session</h2>
      <p className="text-muted">Sign out from this device.</p>

      {error && (
        <p className="rounded-md bg-red-50 py-2 text-center text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button 
          type="button" 
          className="btn btn-danger-outline inline-flex items-center gap-2" 
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <LogOut size={18} />
          )}

          { loading ? "Signing out..." : "Sign out" }
        </button>
      </div>
    </section>
  );
}
