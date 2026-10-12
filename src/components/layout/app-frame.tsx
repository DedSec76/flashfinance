"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/categories", label: "Categories" },
  { href: "/reports/monthly", label: "Monthly Report" },
  { href: "/profile", label: "Profile" },
];

function isCurrent(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  function closeMenu(restoreFocus = false) {
    setOpenPath(null);

    if (restoreFocus) {
      menuButtonRef.current?.focus();
    }
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const media = window.matchMedia("(max-width: 767px)");

    if (!media.matches) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    navRef.current?.querySelector("a")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPath(null);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="app-header">
        <Link href="/dashboard" className="app-brand">
          Flash Finance
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          className="app-menu-button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpenPath((current) => (current === pathname ? null : pathname))}
        >
          <span className="app-menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          {open ? "Close" : "Menu"}
        </button>
      </header>
      {open ? (
        <button type="button" className="app-scrim" aria-label="Close menu" onClick={() => closeMenu(true)} />
      ) : null}
      <div className="app-body">
        <aside id={menuId} className={open ? "app-sidebar is-open" : "app-sidebar"}>
          <nav ref={navRef} aria-label="Account" className="app-nav">
            {links.map((link) => {
              const current = isCurrent(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className="app-nav-link"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main id="main-content" tabIndex={-1} className="app-main">
          {children}
        </main>
      </div>
    </>
  );
}
