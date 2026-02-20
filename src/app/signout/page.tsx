"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import ConstellateIcon from "@/components/ConstellateIcon";

export default function SignoutPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  async function handleSignOut() {
    await signOut({ callbackUrl: "/" });
    router.push("/");
    router.refresh();
  }

  if (status === "unauthenticated" || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F14]">
        <p className="text-[rgba(244,244,242,0.5)]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <div className="radial-bg absolute inset-0 pointer-events-none" aria-hidden />
      <Link
        href="/"
        className="absolute left-6 top-8 flex items-center text-[#F4F4F2] hover:opacity-90"
        aria-label="Constellate"
      >
        <ConstellateIcon className="h-9 w-9" />
      </Link>

      <div
        className="relative w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-8 shadow-sm backdrop-blur-sm"
        style={{ boxShadow: "0 1px 0 0 rgba(255,255,255,0.03) inset" }}
      >
        <h1 className="text-center font-display text-2xl font-bold tracking-tight text-[#F4F4F2]">
          Sign out
        </h1>
        <p className="mt-4 text-center text-[rgba(244,244,242,0.6)] leading-relaxed">
          Are you sure you want to sign out?
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg border border-[rgba(244,244,242,0.4)] bg-transparent px-5 py-2.5 text-sm font-medium text-[#F4F4F2] transition-colors hover:border-[#C6A75E] hover:text-[#C6A75E] focus:outline-none focus:ring-2 focus:ring-[#C6A75E] focus:ring-offset-2 focus:ring-offset-[#0B0F14]"
          >
            Sign out
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent px-5 py-2.5 text-sm font-medium text-[rgba(244,244,242,0.8)] transition-colors hover:border-[rgba(255,255,255,0.2)] hover:text-[#F4F4F2] focus:outline-none focus:ring-2 focus:ring-[#C6A75E] focus:ring-offset-2 focus:ring-offset-[#0B0F14]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
