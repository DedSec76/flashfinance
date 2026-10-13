
"use client";

import { useEffect } from "react";

type ProtectedErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProtectedError({
  error,
  reset,
}: ProtectedErrorProps) {
  useEffect(() => {
    console.error("Protected page error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-4 py-16 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-700"
        aria-hidden="true"
      >
        !
      </div>

      <h1 className="text-2xl font-semibold text-zinc-900">
        Something went wrong
      </h1>

      <p className="max-w-md text-sm leading-6 text-zinc-600" role="alert">
        We couldn&apos;t load this page. Your data has not necessarily been
        lost. Please try again.
      </p>

      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        Try again
      </button>
    </main>
  );
}
