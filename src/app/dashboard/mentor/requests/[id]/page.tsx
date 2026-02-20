"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

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
      <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center">
        <p className="text-[rgba(244,244,242,0.5)]">Loading…</p>
      </div>
    );
  }
  if (!item) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center px-4">
        <p className="text-[rgba(244,244,242,0.5)]">Request not found.</p>
        <Link href="/dashboard/mentor" className="mt-3 text-sm text-[rgba(244,244,242,0.6)] hover:text-[#C6A75E] transition-colors">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const isPending = item.status === "PENDING";

  return (
    <div className="relative min-h-screen bg-[#0B0F14]">
      <div className="radial-bg absolute inset-0 pointer-events-none" aria-hidden />
      <DashboardNav mainHref="/dashboard/mentor" mainLabel="Requests" />

      <main className="relative mx-auto w-full max-w-[1100px] px-6 py-16 lg:px-8">
        <Link href="/dashboard/mentor" className="text-sm text-[rgba(244,244,242,0.6)] hover:text-[#C6A75E] transition-colors">
          ← Back to dashboard
        </Link>
        <Card className="mt-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#F4F4F2]">
            {item.helpRequest.title}
          </h1>
          <p className="mt-2 text-sm text-[rgba(244,244,242,0.5)]">From {item.helpRequest.studentName}</p>
          <p className="mt-5 text-[rgba(244,244,242,0.6)] leading-relaxed">{item.helpRequest.description}</p>
          {item.helpRequest.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {item.helpRequest.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[rgba(255,255,255,0.12)] px-2.5 py-0.5 text-xs text-[rgba(244,244,242,0.6)]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="mt-5">
            <Badge
              variant={
                item.status === "ACCEPTED"
                  ? "success"
                  : item.status === "DECLINED"
                  ? "muted"
                  : "warning"
              }
            >
              {item.status}
            </Badge>
          </div>
          {isPending && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={() => respond("accept")}
                disabled={responding}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                onClick={() => respond("decline")}
                disabled={responding}
              >
                Decline
              </Button>
            </div>
          )}
          {item.status === "ACCEPTED" && (
            <p className="mt-6 text-sm text-[rgba(244,244,242,0.5)] leading-relaxed">
              The student will see your contact email and can reach out to schedule the coffee chat.
            </p>
          )}
        </Card>
      </main>
    </div>
  );
}
