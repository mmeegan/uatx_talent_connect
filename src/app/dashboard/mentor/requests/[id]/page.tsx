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
      <div className="min-h-screen bg-uatx-cream flex items-center justify-center">
        <p className="text-uatx-sand">Loading…</p>
      </div>
    );
  }
  if (!item) {
    return (
      <div className="min-h-screen bg-uatx-cream flex flex-col items-center justify-center px-4">
        <p className="text-uatx-sand">Request not found.</p>
        <Link href="/dashboard/mentor" className="mt-2 text-uatx-gold hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const isPending = item.status === "PENDING";

  return (
    <div className="min-h-screen bg-uatx-cream">
      <header className="bg-uatx-ink border-b border-uatx-gold/20">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link href="/dashboard/mentor" className="font-display text-section uppercase tracking-wide text-uatx-ivory">
            Bridge
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard/mentor" className="text-small text-uatx-ivory/80 hover:text-uatx-gold transition-colors">
              Incoming requests
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <Link href="/dashboard/mentor" className="text-small text-uatx-sand hover:text-uatx-gold transition-colors">
          ← Back to dashboard
        </Link>
        <div className="mt-6 border border-uatx-ink/10 bg-uatx-cream p-6">
          <h1 className="font-display text-display-md uppercase tracking-tight text-uatx-ink">{item.helpRequest.title}</h1>
          <p className="mt-1 text-small text-uatx-sand">From {item.helpRequest.studentName}</p>
          <p className="mt-4 text-body text-uatx-sand">{item.helpRequest.description}</p>
          {item.helpRequest.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.helpRequest.tags.map((t) => (
                <span key={t} className="rounded border border-uatx-gold/30 bg-uatx-gold/10 px-2 py-0.5 text-small text-uatx-ink">
                  {t}
                </span>
              ))}
            </div>
          )}
          <p className="mt-4">
            <span
              className={`inline-block rounded border px-2 py-0.5 text-small font-semibold uppercase tracking-wide ${
                item.status === "ACCEPTED"
                  ? "border-uatx-gold/50 bg-uatx-gold/10 text-uatx-ink"
                  : item.status === "DECLINED"
                  ? "border-uatx-ink/15 bg-uatx-ink/5 text-uatx-sand"
                  : "border-uatx-gold/40 bg-uatx-gold/5 text-uatx-sand"
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
                className="rounded border border-uatx-gold bg-uatx-gold px-4 py-2 text-small font-semibold uppercase tracking-wide text-uatx-ink hover:bg-uatx-gold/90 disabled:opacity-50 transition-colors"
              >
                Accept (share contact for coffee chat)
              </button>
              <button
                onClick={() => respond("decline")}
                disabled={responding}
                className="rounded border border-uatx-ink/20 bg-white px-4 py-2 text-small font-medium text-uatx-ink hover:border-uatx-gold hover:text-uatx-gold disabled:opacity-50 transition-colors"
              >
                Decline
              </button>
            </div>
          )}
          {item.status === "ACCEPTED" && (
            <p className="mt-4 text-small text-uatx-sand">
              The student will see your contact email and can reach out to schedule the coffee chat.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
