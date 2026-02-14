"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Mentor = {
  mentorId: string;
  name: string;
  headline: string;
  bio: string;
  topics: string[];
  industryTags: string[];
  availability: string;
  contactEmail: string;
  score: number;
  activeConnections: number;
};

export default function MatchesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [matches, setMatches] = useState<Mentor[]>([]);
  const [request, setRequest] = useState<{ title: string } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const [matchRes, reqRes] = await Promise.all([
        fetch(`/api/help-requests/${id}/matches`),
        fetch(`/api/help-requests/${id}`),
      ]);
      if (matchRes.ok) setMatches(await matchRes.json());
      if (reqRes.ok) {
        const r = await reqRes.json();
        setRequest(r);
      }
    })();
  }, [id]);

  function toggle(mentorId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(mentorId)) next.delete(mentorId);
      else if (next.size < 3) next.add(mentorId);
      return next;
    });
  }

  async function sendRequests() {
    if (selected.size === 0) {
      setError("Select at least one mentor.");
      return;
    }
    setError("");
    setSending(true);
    const res = await fetch(`/api/help-requests/${id}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mentorIds: Array.from(selected) }),
    });
    setSending(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to send.");
      return;
    }
    setSent(true);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/dashboard/student" className="text-xl font-semibold text-stone-800">
            Bridge
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard/student" className="text-sm text-stone-600 hover:text-stone-900">
              My requests
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link href={`/dashboard/student/requests/${id}`} className="text-sm text-stone-600 hover:underline">
          ← Back to request
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-stone-900">
          Matches for “{request?.title ?? "…"}”
        </h1>
        <p className="mt-1 text-stone-600">
          Select up to 3 mentors to send your request to. They can accept or decline.
        </p>

        {sent ? (
          <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 text-green-800">
            <p className="font-medium">Requests sent.</p>
            <p className="mt-1 text-sm">
              You can view status on your request page. When a mentor accepts, you’ll see their contact email and a template to start the coffee chat.
            </p>
            <Link
              href={`/dashboard/student/requests/${id}`}
              className="mt-4 inline-block font-medium text-green-900 hover:underline"
            >
              View request →
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
            )}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-stone-600">
                {selected.size} of 3 selected
              </p>
              <button
                onClick={sendRequests}
                disabled={sending || selected.size === 0}
                className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send request to selected"}
              </button>
            </div>
            <ul className="mt-6 space-y-4">
              {matches.map((m) => {
                const isSelected = selected.has(m.mentorId);
                const isDisabled = !isSelected && selected.size >= 3;
                return (
                  <li
                    key={m.mentorId}
                    className={`rounded-lg border bg-white p-4 shadow-sm ${
                      isSelected ? "border-stone-900 ring-1 ring-stone-900" : "border-stone-200"
                    }`}
                  >
                    <label className="flex cursor-pointer gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => toggle(m.mentorId)}
                        className="mt-1 rounded border-stone-300"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-stone-900">{m.name}</div>
                        <div className="text-sm text-stone-600">{m.headline}</div>
                        <p className="mt-2 text-sm text-stone-700">{m.bio}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {m.topics.slice(0, 5).map((t) => (
                            <span
                              key={t}
                              className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700"
                            >
                              {t}
                            </span>
                          ))}
                          {m.industryTags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="rounded bg-stone-200 px-2 py-0.5 text-xs text-stone-600"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-stone-500">
                          Availability: {m.availability} · Match score: {(m.score * 100).toFixed(0)}%
                        </p>
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
            {matches.length === 0 && (
              <p className="mt-8 text-center text-stone-500">No matching mentors right now. Try different tags.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
