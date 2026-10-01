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
    <aside className="w-full border-b border-zinc-200 bg-white md:w-64 md:border-b-0 md:border-r">
      <nav className="grid gap-1 p-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
