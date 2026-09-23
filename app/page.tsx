import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 text-zinc-900">
      <main className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Flash Finance</h1>
        <p className="mt-3 text-zinc-600">
          Track your income and expenses in a private account with monthly summaries and categorized transactions.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
          >
            Create Account
          </Link>
        </div>

        <section className="mt-10 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 p-4">Dashboard and monthly balance at a glance.</div>
          <div className="rounded-lg border border-zinc-200 p-4">Fast transaction CRUD with filters and pagination.</div>
          <div className="rounded-lg border border-zinc-200 p-4">Category management with usage-aware restrictions.</div>
          <div className="rounded-lg border border-zinc-200 p-4">Profile and password management per account.</div>
        </section>
      </main>
    </div>
  );
}
