"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const AUTH_STORAGE_KEY = "flashfinance-authenticated";

export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function setAuthenticated(isValid: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, String(isValid));
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticatedState] = useState(false);

  useEffect(() => {
    setAuthenticatedState(isAuthenticated());
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  if (!authenticated) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Authentication Required</h1>
        <p className="mt-2 text-zinc-600">You must sign in to view this page.</p>
        <Link
          href="/login"
          className="mt-6 inline-flex w-fit rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Sign In
        </Link>
      </main>
    );
  }

  return <>{children}</>;
}
