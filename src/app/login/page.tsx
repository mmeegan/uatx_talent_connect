"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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
          <Link href="/" className="font-display text-xl uppercase tracking-widest text-uatx-ink">
            Bridge
          </Link>
          <h2 className="mt-6 font-display text-display-md uppercase tracking-tight text-uatx-ink">Log in</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-small text-red-800">{error}</p>
          )}
          <div>
            <label htmlFor="email" className="block text-small font-medium text-uatx-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded border border-uatx-ink/15 bg-white px-3 py-2 text-body text-uatx-ink placeholder:text-uatx-sand focus:border-uatx-gold focus:outline-none focus:ring-1 focus:ring-uatx-gold"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-small font-medium text-uatx-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded border border-uatx-ink/15 bg-white px-3 py-2 text-body text-uatx-ink placeholder:text-uatx-sand focus:border-uatx-gold focus:outline-none focus:ring-1 focus:ring-uatx-gold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded border border-uatx-gold bg-uatx-gold py-2.5 text-small font-semibold uppercase tracking-wide text-uatx-ink hover:bg-uatx-gold/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>
        <p className="text-center text-small text-uatx-sand">
          Don’t have an account?{" "}
          <Link href="/signup" className="font-medium text-uatx-gold hover:underline">
            Sign up
          </Link>
        </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-uatx-cream flex flex-col items-center justify-center px-6">
      <Suspense fallback={<div className="text-uatx-sand">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
