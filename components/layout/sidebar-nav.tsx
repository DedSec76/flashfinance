import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/categories", label: "Categories" },
  { href: "/reports/monthly", label: "Monthly Report" },
  { href: "/profile", label: "Profile" },
];

export function SidebarNav() {
  return (
    <aside className="w-full border-b border-slate-700 bg-[#0f172a] md:w-64 md:border-b-0 md:border-r md:border-slate-700">
      <nav className="grid gap-2 p-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
