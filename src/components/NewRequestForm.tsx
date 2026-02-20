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
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div
          className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 text-sm text-[rgba(244,244,242,0.9)]"
          role="alert"
        >
          {error}
        </div>
      )}

      <section className="space-y-4">
        <h3 className="text-lg font-medium text-[#F4F4F2]">
          Describe what you need help with
        </h3>
        <p className="text-sm text-[rgba(244,244,242,0.6)] leading-relaxed">
          A few sentences about your question or what you&apos;d like to learn. We&apos;ll match you with up to three relevant mentors.
        </p>
        <textarea
          id="description"
          name="description"
          rows={6}
          placeholder="e.g. I'm exploring a move from engineering into product. I'd love to hear how others made the switch and what skills to build."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-constellate w-full rounded-lg px-4 py-3 text-[#F4F4F2] leading-relaxed"
          aria-describedby="description-hint"
          required
        />
        <p id="description-hint" className="text-xs text-[rgba(244,244,242,0.4)]">
          Required. Your request is sent to mentors whose expertise matches your topics.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-medium text-[#F4F4F2]">Topics</h3>
        <p className="text-sm text-[rgba(244,244,242,0.6)] leading-relaxed">
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

      <section className="space-y-4">
        <h3 className="text-lg font-medium text-[#F4F4F2]">Industries / fields</h3>
        <p className="text-sm text-[rgba(244,244,242,0.6)] leading-relaxed">
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
          className="w-full rounded-lg border border-[rgba(244,244,242,0.4)] bg-transparent py-3.5 text-base font-medium text-[#F4F4F2] transition-colors hover:border-[#C6A75E] hover:text-[#C6A75E] focus:outline-none focus:ring-2 focus:ring-[#C6A75E] focus:ring-offset-2 focus:ring-offset-[#0B0F14] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? "Submitting…" : "Submit request"}
        </button>
      </div>
    </form>
  );
}
