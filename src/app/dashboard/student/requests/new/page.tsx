"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewHelpRequestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const tags = tagsStr.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean);
    const res = await fetch("/api/help-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), description: description.trim(), tags }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to create request.");
      return;
    }
    router.push(`/dashboard/student/requests/${data.id}/matches`);
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

      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/dashboard/student" className="text-sm text-stone-600 hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-stone-900">New help request</h1>
        <p className="mt-1 text-stone-600">
          Describe what you need help with. We’ll match you with relevant mentors.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
          )}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-stone-700">
              Title *
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Career switch from engineering to product"
              className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-stone-700">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A few sentences about what you’re looking for..."
              className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-stone-700">
              Tags (optional, comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="e.g. product management, career, tech"
              className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create and view matches"}
          </button>
        </form>
      </main>
    </div>
  );
}
