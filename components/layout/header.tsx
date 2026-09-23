import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-700 bg-[#0f172a] px-4 py-3 text-slate-100 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/dashboard" className="text-sm font-bold tracking-[0.18em] text-white uppercase">
          Flash Finance
        </Link>
        <Link
          href="/profile"
          className="rounded-full border border-slate-600 bg-slate-800/80 px-3 py-1.5 text-sm font-medium text-slate-100 transition hover:border-sky-300 hover:text-sky-200"
        >
          Profile
        </Link>
      </div>
    </header>
  );
}
