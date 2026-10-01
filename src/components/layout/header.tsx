import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
      <Link href="/dashboard" className="text-sm font-semibold tracking-wide text-zinc-900">
        Flash Finance
      </Link>
      <Link href="/profile" className="text-sm text-zinc-600 hover:text-zinc-900">
        Profile
      </Link>
    </header>
  );
}
