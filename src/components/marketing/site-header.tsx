"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function Mark({ light }: { light: boolean }) {
  const stroke = light ? "white" : "var(--color-primary)";

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8">
      <path
        d="M16 3.5 27.5 8.2V16c0 6.4-6.4 11.2-11.5 13.4C11 27.2 4.5 22.4 4.5 16V8.2L16 3.5Z"
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
      />
      <path d="M16 10.5 18.2 16h-4.4L16 10.5Z" fill={stroke} />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const menuId = useId();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const onHero = pathname === "/";
  const onDark = pathname === "/about" || pathname === "/contact";
  const onLight = !onHero && !onDark;

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPath(null);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className={
        onHero
          ? "hero-nav absolute inset-x-0 top-0 z-20"
          : onDark
            ? "future-nav sticky top-0 z-20"
            : "sticky top-0 z-10 border-b border-[var(--color-border)] bg-white/95 backdrop-blur"
      }
    >
      <div
        className={`site-bar mx-auto flex w-full items-center justify-between gap-4 ${
          onHero ? "max-w-[1440px] px-6 py-6 md:px-10" : "max-w-6xl px-6 py-4"
        }`}
      >
        <Link href="/" aria-label="Flash Finance" className="inline-flex items-center gap-2">
          <Mark light={onHero || onDark} />
          {onHero ? null : (
            <span
              className={`text-sm font-bold tracking-wide ${onDark ? "" : "text-[var(--color-heading)]"}`}
            >
              Flash Finance
            </span>
          )}
        </Link>

        <button
          type="button"
          className="site-menu-button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpenPath((current) => (current === pathname ? null : pathname))}
        >
          {open ? "Close" : "Menu"}
        </button>

        <div id={menuId} className={open ? "site-menu is-open" : "site-menu"}>
          <nav aria-label="Primary" className="flex items-center gap-5">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    onHero || onDark
                      ? `text-sm font-medium hover:text-white ${
                          active ? "underline decoration-white/70 underline-offset-4" : ""
                        }`
                      : `text-sm font-medium ${
                          active
                            ? "text-[var(--color-primary)]"
                            : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                        }`
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {onLight ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
              >
                Sign in
              </Link>
              <Link href="/register" className="btn btn-primary btn-pill">
                Create account
              </Link>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-medium hover:text-white">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
