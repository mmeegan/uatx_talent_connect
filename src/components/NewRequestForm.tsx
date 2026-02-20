"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TOPIC_OPTIONS, INDUSTRY_OPTIONS } from "@/lib/constants";
import PillMultiSelect from "@/components/PillMultiSelect";

export default function NewRequestForm() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [industryTags, setIndustryTags] = useState<string[]>([]);
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
    const title = trimmed.slice(0, 80) + (trimmed.length > 80 ? "…" : "");
    const res = await fetch("/api/help-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: trimmed,
        tags,
        industryTags,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }
    setDescription("");
    setTags([]);
    setIndustryTags([]);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div
          className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4 text-sm text-zinc-200"
          role="alert"
        >
          {error}
        </div>
      )}

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-zinc-100">
          Describe what you need help with
        </h3>
        <p className="text-sm text-zinc-400">
          A few sentences about your question or what you’d like to learn. We’ll match you with up to three relevant mentors.
        </p>
        <textarea
          id="description"
          name="description"
          rows={5}
          placeholder="e.g. I’m exploring a move from engineering into product. I’d love to hear how others made the switch and what skills to build."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          aria-describedby="description-hint"
          required
        />
        <p id="description-hint" className="text-xs text-zinc-500">
          Required. Your request is sent to mentors whose expertise matches your topics.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-zinc-100">Topics</h3>
        <p className="text-sm text-zinc-400">
          Select any that apply. This helps us match you with the right mentors.
        </p>
        <PillMultiSelect
          id="topics"
          label="What do you need help with?"
          options={TOPIC_OPTIONS}
          selected={tags}
          onChange={setTags}
        />
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-zinc-100">Industries / fields</h3>
        <p className="text-sm text-zinc-400">
          Optional. Narrows matching to mentors in these areas.
        </p>
        <PillMultiSelect
          id="industries"
          label="Industries or fields"
          options={INDUSTRY_OPTIONS}
          selected={industryTags}
          onChange={setIndustryTags}
          optional
        />
      </section>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg border border-zinc-200 bg-zinc-100 py-3.5 text-base font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-[#0B0F14] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? "Submitting…" : "Submit request"}
        </button>
      </div>
    </form>
  );
}
