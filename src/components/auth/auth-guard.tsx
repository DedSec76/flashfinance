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
      <main className="app-main gate">
        <LoadingState label="Checking your session..." />
      </main>
    );
  }

  if (status === "anonymous") {
    return (
      <main className="app-main gate">
        <section className="card form-panel">
          <h1>Authentication required</h1>
          <p>You must sign in to view this page.</p>
          <div className="form-actions">
            <Link href="/login" className="btn btn-primary">
              Sign in
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
