"use client";

import { useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";

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
  const mainLabel = "Requests";

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <p className="text-[rgba(244,244,242,0.5)]">Loading…</p>
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

  const inputClass =
    "input-constellate mt-1.5 block w-full rounded-lg px-3 py-2.5 text-[#F4F4F2]";

  return (
    <div className="relative min-h-screen w-full bg-[#0B0F14]">
      <div className="radial-bg absolute inset-0 pointer-events-none" aria-hidden />
      <DashboardNav mainHref={mainHref} mainLabel={mainLabel} />
      <main className="relative mx-auto w-full max-w-[880px] px-6 py-16 lg:px-8">
        <Link href={mainHref} className="text-sm text-[rgba(244,244,242,0.6)] hover:text-[#C6A75E] transition-colors">
          ← Back to dashboard
        </Link>
        <h1 className="mt-8 font-display text-4xl font-bold tracking-tight text-[#F4F4F2]">Settings</h1>
        <div className="mt-4 h-px w-16 bg-[#C6A75E]" />
        <p className="mt-6 text-[rgba(244,244,242,0.6)] leading-relaxed">Account control.</p>

        <Card className="mt-12">
          <div className="border-l-2 border-[#C6A75E] pl-4">
            <h2 className="text-xl font-medium text-[#F4F4F2]">Change password</h2>
            <div className="mt-3 h-px w-full max-w-[200px] bg-[rgba(255,255,255,0.08)]" />
          </div>
          <div className="mt-6 space-y-5">
            {error && (
              <p className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-sm text-[rgba(244,244,242,0.9)]" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-sm text-[rgba(244,244,242,0.9)]">
                Password updated successfully.
              </p>
            )}
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-[rgba(244,244,242,0.8)]">
                  Current password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-[rgba(244,244,242,0.8)]">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[rgba(244,244,242,0.8)]">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  required
                  minLength={8}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg border border-[rgba(244,244,242,0.4)] bg-transparent px-4 py-2.5 text-sm font-medium text-[#F4F4F2] transition-colors hover:border-[#C6A75E] hover:text-[#C6A75E] focus:outline-none focus:ring-2 focus:ring-[#C6A75E] focus:ring-offset-2 focus:ring-offset-[#0B0F14] disabled:opacity-50"
              >
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          </div>
        </Card>
      </main>
    </div>
  );
}
