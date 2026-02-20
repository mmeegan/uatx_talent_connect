"use client";

import { useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const role = (session?.user as { role?: string })?.role;
  const isMentor = role === "MENTOR";
  const mainHref = isMentor ? "/dashboard/mentor" : "/dashboard/student";
  const mainLabel = isMentor ? "Incoming requests" : "Your requests";

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-uatx-cream flex items-center justify-center">
        <p className="text-uatx-sand">Loading…</p>
      </div>
    );
  }
  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to change password.");
      return;
    }
    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="min-h-screen w-full bg-uatx-cream">
      <DashboardNav mainHref={mainHref} mainLabel={mainLabel} />
      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
        <Link
          href={mainHref}
          className="text-small text-uatx-sand hover:text-uatx-gold transition-colors"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 font-display text-display-md uppercase tracking-tight text-uatx-ink">
          Settings
        </h1>
        <p className="mt-1 text-small text-uatx-sand">
          Account control: change your password.
        </p>

        <section className="mt-8 max-w-md border border-uatx-ink/10 bg-white p-6">
          <h2 className="font-display text-small font-semibold uppercase tracking-wider text-uatx-ink">
            Change password
          </h2>
          {error && (
            <p className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-small text-red-800">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-small text-green-800">
              Password updated successfully.
            </p>
          )}
          <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-small font-medium text-uatx-ink">
                Current password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded border border-uatx-ink/15 bg-white px-3 py-2 text-body text-uatx-ink focus:border-uatx-gold focus:outline-none focus:ring-1 focus:ring-uatx-gold"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-small font-medium text-uatx-ink">
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded border border-uatx-ink/15 bg-white px-3 py-2 text-body text-uatx-ink focus:border-uatx-gold focus:outline-none focus:ring-1 focus:ring-uatx-gold"
                required
                minLength={8}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-small font-medium text-uatx-ink">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded border border-uatx-ink/15 bg-white px-3 py-2 text-body text-uatx-ink focus:border-uatx-gold focus:outline-none focus:ring-1 focus:ring-uatx-gold"
                required
                minLength={8}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded border border-uatx-gold bg-uatx-gold px-4 py-2 text-small font-semibold uppercase tracking-wide text-uatx-ink hover:bg-uatx-gold/90 disabled:opacity-50 transition-colors"
            >
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
