"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import Card from "@/components/ui/Card";

type InviteCodeRow = {
  id: string;
  code: string;
  used: boolean;
  usedAt: string | null;
  createdAt: string;
};

type NetworkStudent = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

type NetworkMentor = {
  id: string;
  email: string;
  name: string;
  headline: string;
  createdAt: string;
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [codes, setCodes] = useState<InviteCodeRow[]>([]);
  const [students, setStudents] = useState<NetworkStudent[]>([]);
  const [mentors, setMentors] = useState<NetworkMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeSuccess, setCodeSuccess] = useState(false);
  const [creating, setCreating] = useState(false);

  const role = (session?.user as { role?: string })?.role;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status === "authenticated" && role !== "ADMIN") {
      router.replace(role === "MENTOR" ? "/dashboard/mentor" : "/dashboard/student");
      return;
    }
    if (status !== "authenticated" || role !== "ADMIN") return;

    (async () => {
      const [codesRes, networkRes] = await Promise.all([
        fetch("/api/admin/invite-codes"),
        fetch("/api/admin/network"),
      ]);
      if (codesRes.ok) {
        const data = await codesRes.json();
        setCodes(data);
      }
      if (networkRes.ok) {
        const data = await networkRes.json();
        setStudents(data.students ?? []);
        setMentors(data.mentors ?? []);
      }
      setLoading(false);
    })();
  }, [status, role, router]);

  async function handleCreateCode(e: React.FormEvent) {
    e.preventDefault();
    setCodeError("");
    setCodeSuccess(false);
    const trimmed = newCode.trim().toUpperCase();
    if (!trimmed) {
      setCodeError("Enter a code.");
      return;
    }
    setCreating(true);
    const res = await fetch("/api/admin/invite-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: trimmed }),
    });
    const data = await res.json().catch(() => ({}));
    setCreating(false);
    if (!res.ok) {
      setCodeError(data.error || "Failed to create code.");
      return;
    }
    setCodeSuccess(true);
    setNewCode("");
    setCodes((prev) => [data, ...prev]);
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F14]">
        <p className="text-[rgba(244,244,242,0.5)]">Loading…</p>
      </div>
    );
  }
  if (status === "unauthenticated") return null;

  return (
    <div className="relative min-h-screen w-full bg-[#0B0F14]">
      <div className="radial-bg absolute inset-0 pointer-events-none" aria-hidden />
      <DashboardNav mainHref="/admin" mainLabel="Admin" />

      <main className="relative mx-auto w-full max-w-[880px] px-6 py-16 lg:px-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-[#F4F4F2]">
          Admin
        </h1>
        <div className="mt-4 h-px w-16 bg-[#C6A75E]" />
        <p className="mt-6 text-[rgba(244,244,242,0.6)] leading-relaxed">
          Manage invite codes and view the network.
        </p>

        {loading ? (
          <p className="mt-12 text-[rgba(244,244,242,0.5)]">Loading…</p>
        ) : (
          <div className="mt-20 space-y-20">
            <Card>
              <div className="border-l-2 border-[#C6A75E] pl-4">
                <h2 className="text-xl font-medium text-[#F4F4F2]">Invite codes</h2>
                <div className="mt-3 h-px w-full max-w-[200px] bg-[rgba(255,255,255,0.08)]" />
              </div>
              <div className="mt-6 space-y-6">
                <form onSubmit={handleCreateCode} className="flex flex-wrap items-end gap-3">
                  <div className="min-w-[200px] flex-1">
                    <label htmlFor="new-code" className="block text-sm font-medium text-[rgba(244,244,242,0.8)]">
                      New code
                    </label>
                    <input
                      id="new-code"
                      type="text"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="e.g. MENTOR2025"
                      className="input-constellate mt-1.5 w-full rounded-lg px-3 py-2.5 text-[#F4F4F2] uppercase placeholder:normal-case"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={creating}
                    className="rounded-lg border border-[rgba(244,244,242,0.4)] bg-transparent px-4 py-2.5 text-sm font-medium text-[#F4F4F2] transition-colors hover:border-[#C6A75E] hover:text-[#C6A75E] focus:outline-none focus:ring-2 focus:ring-[#C6A75E] focus:ring-offset-2 focus:ring-offset-[#0B0F14] disabled:opacity-50"
                  >
                    {creating ? "Creating…" : "Create invite code"}
                  </button>
                </form>
                {codeError && (
                  <p className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-sm text-[rgba(244,244,242,0.9)]" role="alert">
                    {codeError}
                  </p>
                )}
                {codeSuccess && (
                  <p className="text-sm text-[#C6A75E]">Invite code created.</p>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.08)]">
                        <th className="pb-3 font-medium text-[rgba(244,244,242,0.6)]">Code</th>
                        <th className="pb-3 font-medium text-[rgba(244,244,242,0.6)]">Status</th>
                        <th className="pb-3 font-medium text-[rgba(244,244,242,0.6)]">Used at</th>
                      </tr>
                    </thead>
                    <tbody>
                      {codes.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-6 text-[rgba(244,244,242,0.4)]">
                            No invite codes yet. Create one above.
                          </td>
                        </tr>
                      ) : (
                        codes.map((c) => (
                          <tr key={c.id} className="border-b border-[rgba(255,255,255,0.06)]">
                            <td className="py-3 font-medium text-[#F4F4F2]">{c.code}</td>
                            <td className="py-3">
                              <span
                                className={
                                  c.used
                                    ? "text-[rgba(244,244,242,0.4)]"
                                    : "text-[#C6A75E]"
                                }
                              >
                                {c.used ? "Used" : "Available"}
                              </span>
                            </td>
                            <td className="py-3 text-[rgba(244,244,242,0.5)]">
                              {c.usedAt
                                ? new Date(c.usedAt).toLocaleString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "—"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            <Card>
              <div className="border-l-2 border-[#C6A75E] pl-4">
                <h2 className="text-xl font-medium text-[#F4F4F2]">Network</h2>
                <div className="mt-3 h-px w-full max-w-[200px] bg-[rgba(255,255,255,0.08)]" />
              </div>
              <div className="mt-6 space-y-10">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-[rgba(244,244,242,0.6)]">
                    Mentors ({mentors.length})
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.08)]">
                    {mentors.length === 0 ? (
                      <p className="p-6 text-center text-sm text-[rgba(244,244,242,0.4)]">
                        No mentors yet.
                      </p>
                    ) : (
                      <ul className="divide-y divide-[rgba(255,255,255,0.06)]" role="list">
                        {mentors.map((m) => (
                          <li
                            key={m.id}
                            className="flex flex-wrap items-center gap-x-6 gap-y-1 p-4"
                          >
                            <span className="font-medium text-[#F4F4F2]">{m.name}</span>
                            <span className="text-sm text-[rgba(244,244,242,0.5)]">
                              {m.headline}
                            </span>
                            <span className="w-full text-sm text-[rgba(244,244,242,0.6)] sm:w-auto">
                              {m.email}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-medium text-[rgba(244,244,242,0.6)]">
                    Students ({students.length})
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.08)]">
                    {students.length === 0 ? (
                      <p className="p-6 text-center text-sm text-[rgba(244,244,242,0.4)]">
                        No students yet.
                      </p>
                    ) : (
                      <ul className="divide-y divide-[rgba(255,255,255,0.06)]" role="list">
                        {students.map((s) => (
                          <li
                            key={s.id}
                            className="flex flex-wrap items-center gap-x-6 gap-y-1 p-4"
                          >
                            <span className="font-medium text-[#F4F4F2]">{s.name}</span>
                            <span className="text-sm text-[rgba(244,244,242,0.6)]">
                              {s.email}
                            </span>
                            <span className="text-xs text-[rgba(244,244,242,0.4)]">
                              {new Date(s.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
