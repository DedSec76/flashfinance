import Link from "next/link";

const IS_AUTHENTICATED = true;

export function AuthGuard({ children }: { children: React.ReactNode }) {
  if (!IS_AUTHENTICATED) {
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
