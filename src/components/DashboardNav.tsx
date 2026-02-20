"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type DashboardNavProps = {
  mainHref: string;
  mainLabel: string;
};

const navLinkClass =
  "text-sm text-zinc-400 transition-colors duration-200 hover:text-zinc-100";

export default function DashboardNav({ mainHref, mainLabel }: DashboardNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="border-b border-zinc-800 bg-[#0B0F14]">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-zinc-100 hover:text-zinc-100"
        >
          Constellate
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href={mainHref}
            className={pathname === mainHref ? "text-sm font-medium text-zinc-100" : navLinkClass}
          >
            {mainLabel}
          </Link>
          <div className="relative" ref={ref}>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className={open ? "text-sm font-medium text-zinc-100" : navLinkClass}
              aria-expanded={open}
              aria-haspopup="true"
            >
              Account
            </button>
            {open && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-zinc-800 bg-zinc-900 py-1 shadow-lg"
                role="menu"
              >
                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Settings
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
