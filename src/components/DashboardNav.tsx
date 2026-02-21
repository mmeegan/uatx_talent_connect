"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import NavBrand from "@/components/brand/NavBrand";

type DashboardNavProps = {
  mainHref: string;
  mainLabel: string;
};

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

  const isMainActive = pathname === mainHref;

  return (
    <header
      className="border-b bg-gradient-to-b from-[#0E131A] to-[#0B0F14]"
      style={{
        minHeight: "92px",
        borderBottomColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="mx-auto flex h-[92px] max-w-[1100px] items-center justify-between px-8 lg:px-10">
        <NavBrand variant="full" className="shrink-0" />
        <nav className="flex items-center gap-8">
          <Link
            href={mainHref}
            className={`group relative text-sm font-medium transition-colors duration-200 ${
              isMainActive ? "text-[#F4F4F2]" : "text-[rgba(244,244,242,0.6)] hover:text-[#F4F4F2]"
            }`}
          >
            {mainLabel}
            <span
              className={`absolute -bottom-1 left-0 h-px bg-[#C6A75E] transition-all duration-200 ${
                isMainActive ? "w-full" : "w-0 group-hover:w-full"
              }`}
              aria-hidden
            />
          </Link>
          <div className="relative" ref={ref}>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className={`relative text-sm font-medium transition-colors duration-200 ${
                open ? "text-[#F4F4F2]" : "text-[rgba(244,244,242,0.6)] hover:text-[#F4F4F2]"
              }`}
              aria-expanded={open}
              aria-haspopup="true"
            >
              Account
              <span
                className={`absolute -bottom-1 left-0 h-px bg-[#C6A75E] transition-all duration-200 ${
                  open ? "w-full" : "w-0"
                }`}
                aria-hidden
              />
            </button>
            {open && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] py-1 shadow-lg backdrop-blur-sm"
                role="menu"
                style={{ boxShadow: "0 1px 0 0 rgba(255,255,255,0.03) inset" }}
              >
                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-2.5 text-sm text-[rgba(244,244,242,0.8)] transition-colors hover:bg-[rgba(198,167,94,0.06)] hover:text-[#F4F4F2]"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2.5 text-sm text-[rgba(244,244,242,0.8)] transition-colors hover:bg-[rgba(198,167,94,0.06)] hover:text-[#F4F4F2]"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Settings
                </Link>
                <Link
                  href="/signout"
                  className="block px-4 py-2.5 text-sm text-[rgba(244,244,242,0.8)] transition-colors hover:bg-[rgba(198,167,94,0.06)] hover:text-[#F4F4F2]"
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
