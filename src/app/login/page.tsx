"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
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
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Link href="/" className="font-serif text-xl text-charcoal">
            Bridge
          </Link>
          <h2 className="mt-6 font-serif text-2xl text-charcoal">Log in</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal/80">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded border border-stone-200 bg-white px-3 py-2 text-charcoal placeholder:text-charcoal/40 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-charcoal/80">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded border border-stone-200 bg-white px-3 py-2 text-charcoal placeholder:text-charcoal/40 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-maroon px-4 py-2.5 text-sm font-medium text-white hover:bg-maroon-hover disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>
        <p className="text-center text-sm text-charcoal/70">
          Don’t have an account?{" "}
          <Link href="/signup" className="font-medium text-maroon hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
