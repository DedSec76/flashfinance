import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Unauthorized</h1>
      <p className="mt-2 text-zinc-600">
        Your session is missing or expired, or you do not have access to this resource.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-flex w-fit rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        Go to Sign In
      </Link>
    </main>
  );
}
