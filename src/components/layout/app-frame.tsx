"use client";

import { Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { UserProvider, useUser } from "@/contexts/user-context";

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

export function AppFrameContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const { user } = useUser();
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
        <Link href="/dashboard" className="flex items-center gap-4 app-brand">
          <div className="bg-black p-2 rounded-md">
            <Wallet />
          </div>
          <div>
            <p className="text-lg">FlashFinance</p>
            <p className="text-sm text-gray-300 font-normal">Personal finances</p>
          </div>
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

        <Link
          href="/profile"
          className="flex items-center gap-3"
          aria-label="Go to your profile"
        >
          <Image
            src={user?.avatar ? user.avatar : "/profiles/profile.png"}
            alt={user?.avatar ? `Profile picture of user ${user.firstName} ${user.lastName}` : "Standard user profile"}
            width={64}
            height={64}
            className="h-10 w-10 rounded-full object-cover"
          /> 

          <div className="hidden sm:block">
            <span></span>
            <p className="text-sm font-semibold">
              Welcome, 
              {user 
              ? ` ${user.firstName}`
              : "Loading profile..."}
            </p>
            <p className="text-xs text-gray-500">
                My profile 
            </p>
          </div>
        </Link>
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

export function AppFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <AppFrameContent>{children}</AppFrameContent>
    </UserProvider>
  )
}
