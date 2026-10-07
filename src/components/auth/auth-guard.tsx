"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LoadingState } from "@/components/ui/loading-state";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "anonymous"
  >("loading");

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => {
        if (!active) {
          return;
        }

        setStatus(response.ok ? "authenticated" : "anonymous");
      })
      .catch(() => {
        if (active) {
          setStatus("anonymous");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-16">
        <LoadingState label="Checking your session..." />
      </main>
    );
  }

  if (status === "anonymous") {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">
          Authentication Required
        </h1>
        <p className="mt-2 text-zinc-600">
          You must sign in to view this page.
        </p>
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
