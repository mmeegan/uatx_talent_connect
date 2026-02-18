"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type RequestItem = {
  id: string;
  status: string;
  createdAt: string;
  helpRequest: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    studentName: string;
  };
};

export default function MentorRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [item, setItem] = useState<RequestItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/mentor/requests");
      if (!res.ok) return;
      const list = await res.json();
      const found = list.find((r: RequestItem) => r.id === id);
      setItem(found ?? null);
      setLoading(false);
    })();
  }, [id]);

  async function respond(action: "accept" | "decline") {
    setResponding(true);
    const res = await fetch(`/api/mentor/requests/${id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setResponding(false);
    if (res.ok) {
      setItem((prev) => (prev ? { ...prev, status: action === "accept" ? "ACCEPTED" : "DECLINED" } : null));
      router.refresh();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-charcoal/60">Loading…</p>
      </div>
    );
  }
  if (!item) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
        <p className="text-charcoal/60">Request not found.</p>
        <Link href="/dashboard/mentor" className="mt-2 text-maroon hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const isPending = item.status === "PENDING";

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-stone-200/80 bg-cream">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/dashboard/mentor" className="font-serif text-xl text-charcoal">
            Bridge
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard/mentor" className="text-sm text-charcoal/70 hover:text-charcoal">
              Incoming requests
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <Link href="/dashboard/mentor" className="text-sm text-charcoal/70 hover:text-charcoal">
          ← Back to dashboard
        </Link>
        <div className="mt-6 rounded border border-stone-200/80 bg-white p-6">
          <h1 className="font-serif text-xl text-charcoal">{item.helpRequest.title}</h1>
          <p className="mt-1 text-sm text-charcoal/70">From {item.helpRequest.studentName}</p>
          <p className="mt-4 text-charcoal/80">{item.helpRequest.description}</p>
          {item.helpRequest.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.helpRequest.tags.map((t) => (
                <span key={t} className="rounded bg-stone-100 px-2 py-0.5 text-xs text-charcoal/80">
                  {t}
                </span>
              ))}
            </div>
          )}
          <p className="mt-4">
            <span
              className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                item.status === "ACCEPTED"
                  ? "bg-green-100 text-green-800"
                  : item.status === "DECLINED"
                  ? "bg-stone-100 text-charcoal/60"
                  : "bg-amber-50 text-amber-800"
              }`}
            >
              {item.status}
            </span>
          </p>
          {isPending && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => respond("accept")}
                disabled={responding}
                className="rounded bg-maroon px-4 py-2 text-sm font-medium text-white hover:bg-maroon-hover disabled:opacity-50"
              >
                Accept (share contact for coffee chat)
              </button>
              <button
                onClick={() => respond("decline")}
                disabled={responding}
                className="rounded border border-charcoal/20 bg-white px-4 py-2 text-sm font-medium text-charcoal hover:bg-charcoal/5 disabled:opacity-50"
              >
                Decline
              </button>
            </div>
          )}
          {item.status === "ACCEPTED" && (
            <p className="mt-4 text-sm text-charcoal/70">
              The student will see your contact email and can reach out to schedule the coffee chat.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
