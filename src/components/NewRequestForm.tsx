"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TOPIC_OPTIONS, INDUSTRY_OPTIONS } from "@/lib/constants";

function MultiSelect({
  options,
  selected,
  onChange,
  label,
  id,
}: {
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
  id: string;
}) {
  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  }
  return (
    <div>
      <span className="block text-small font-medium text-uatx-ink" id={id}>
        {label}
      </span>
      <div
        className="mt-2 flex flex-wrap gap-x-4 gap-y-2"
        role="group"
        aria-labelledby={id}
      >
        {options.map((opt) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2 text-body text-uatx-ink"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="h-4 w-4 rounded border-uatx-ink/20 text-uatx-gold focus:ring-uatx-gold"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-small text-red-800">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="description" className="sr-only">
          What do you want help with?
        </label>
        <textarea
          id="description"
          rows={5}
          placeholder="What do you want help with? Describe your question or what you'd like to learn in a few sentences."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border border-uatx-ink/15 bg-white px-4 py-3 text-body text-uatx-ink placeholder:text-uatx-sand focus:border-uatx-gold focus:outline-none focus:ring-1 focus:ring-uatx-gold"
        />
      </div>
      <div>
        <MultiSelect
          id="topics"
          label="Topics (what you need help with)"
          options={TOPIC_OPTIONS}
          selected={tags}
          onChange={setTags}
        />
      </div>
      <div>
        <MultiSelect
          id="industries"
          label="Industries / fields (optional)"
          options={INDUSTRY_OPTIONS}
          selected={industryTags}
          onChange={setIndustryTags}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded border border-uatx-gold bg-uatx-gold px-5 py-2.5 text-small font-semibold uppercase tracking-wide text-uatx-ink hover:bg-uatx-gold/90 disabled:opacity-60 transition-colors"
      >
        {loading ? "Submitting…" : "Submit request"}
      </button>
    </form>
  );
}
