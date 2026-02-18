"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewRequestForm() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = description.trim();
    if (!trimmed) {
      setError("Please describe what you want help with.");
      return;
    }
    setError("");
    setLoading(true);
    const tags = tagsStr.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean);
    const title = trimmed.slice(0, 80) + (trimmed.length > 80 ? "…" : "");
    const res = await fetch("/api/help-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: trimmed,
        tags,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }
    setDescription("");
    setTagsStr("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      )}
      <div>
        <label htmlFor="description" className="sr-only">
          What do you want help with?
        </label>
        <textarea
          id="description"
          rows={5}
          placeholder="What do you want help with? Describe your question or what you’d like to learn in a few sentences."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border border-stone-200 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
        />
      </div>
      <div>
        <label htmlFor="tags" className="block text-sm text-charcoal/70">
          Optional tags (comma-separated)
        </label>
        <input
          id="tags"
          type="text"
          placeholder="e.g. product management, career, tech"
          value={tagsStr}
          onChange={(e) => setTagsStr(e.target.value)}
          className="mt-1 w-full rounded border border-stone-200 bg-white px-4 py-2 text-charcoal placeholder:text-charcoal/40 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-maroon px-5 py-2.5 text-sm font-medium text-white hover:bg-maroon-hover disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit request"}
      </button>
    </form>
  );
}
