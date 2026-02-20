"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ConstellateIcon from "@/components/ConstellateIcon";

const inputClass =
  "input-constellate mt-1.5 block w-full rounded-lg px-3 py-2.5 text-[#F4F4F2]";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    const callback = searchParams.get("callbackUrl") || "/";
    router.push(callback);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#F4F4F2] hover:opacity-90"
        >
          <ConstellateIcon className="h-8 w-8" />
        </Link>
        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-[#F4F4F2]">Log in</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p
            className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-sm text-[rgba(244,244,242,0.9)]"
            role="alert"
          >
            {error}
          </p>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[rgba(244,244,242,0.8)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[rgba(244,244,242,0.8)]">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg border border-[rgba(244,244,242,0.4)] bg-transparent py-2.5 text-sm font-medium text-[#F4F4F2] transition-colors hover:border-[#C6A75E] hover:text-[#C6A75E] focus:outline-none focus:ring-2 focus:ring-[#C6A75E] focus:ring-offset-2 focus:ring-offset-[#0B0F14] disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>
      <p className="text-center text-sm text-[rgba(244,244,242,0.5)]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-[#C6A75E] hover:text-[rgba(198,167,94,0.8)] transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <div className="radial-bg absolute inset-0 pointer-events-none" aria-hidden />
      <Suspense fallback={<div className="text-[rgba(244,244,242,0.5)]">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
