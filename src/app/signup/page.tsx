"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Role = "STUDENT" | "MENTOR";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [topics, setTopics] = useState("");
  const [industryTags, setIndustryTags] = useState("");
  const [availability, setAvailability] = useState("MEDIUM");
  const [contactEmail, setContactEmail] = useState("");
  const [interestTags, setInterestTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload: Record<string, unknown> = {
      email: email.trim(),
      password,
      role,
      profile:
        role === "STUDENT"
          ? {
              name: name.trim() || "Student",
              tags: interestTags
                .split(/[\s,]+/)
                .map((t) => t.trim())
                .filter(Boolean),
            }
          : {
              name: name.trim() || "Mentor",
              headline: headline.trim(),
              bio: bio.trim(),
              topics: topics.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean),
              industryTags: industryTags.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean),
              availability,
              contactEmail: contactEmail.trim() || email.trim(),
            },
    };
    if (role === "MENTOR") payload.inviteCode = inviteCode.trim();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Signup failed.");
      return;
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="font-serif text-xl text-charcoal">
            Bridge
          </Link>
          <h2 className="mt-6 font-serif text-2xl text-charcoal">Sign up</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-charcoal/80">I am a</label>
            <div className="mt-1 flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  checked={role === "STUDENT"}
                  onChange={() => setRole("STUDENT")}
                  className="rounded border-stone-200"
                />
                Student
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  checked={role === "MENTOR"}
                  onChange={() => setRole("MENTOR")}
                  className="rounded border-stone-200"
                />
                Mentor
              </label>
            </div>
          </div>
          {role === "MENTOR" && (
            <div>
              <label htmlFor="inviteCode" className="block text-sm font-medium text-charcoal/80">
                Invite code *
              </label>
              <input
                id="inviteCode"
                type="text"
                required={role === "MENTOR"}
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="mt-1 block w-full rounded border border-stone-200 bg-white px-3 py-2 text-charcoal focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal/80">Email *</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded border border-stone-200 bg-white px-3 py-2 text-charcoal focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-charcoal/80">Password *</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded border border-stone-200 bg-white px-3 py-2 text-charcoal focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-charcoal/80">Name *</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded border border-stone-200 bg-white px-3 py-2 text-charcoal focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
            />
          </div>
          {role === "STUDENT" && (
            <div>
              <label htmlFor="interestTags" className="block text-sm font-medium text-charcoal/80">
                Interest tags (optional, comma-separated)
              </label>
              <input
                id="interestTags"
                type="text"
                placeholder="e.g. product, design, engineering"
                value={interestTags}
                onChange={(e) => setInterestTags(e.target.value)}
                className="mt-1 block w-full rounded border border-stone-200 bg-white px-3 py-2 text-charcoal focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
              />
            </div>
          )}
          {role === "MENTOR" && (
            <>
              <div>
                <label htmlFor="headline" className="block text-sm font-medium text-charcoal/80">Headline *</label>
                <input
                  id="headline"
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="mt-1 block w-full rounded border border-stone-200 bg-white px-3 py-2 text-charcoal focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-charcoal/80">Bio *</label>
                <textarea
                  id="bio"
                  rows={3}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 block w-full rounded border border-stone-200 bg-white px-3 py-2 text-charcoal focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
                />
              </div>
              <div>
                <label htmlFor="topics" className="block text-sm font-medium text-charcoal/80">Topics you mentor on (comma-separated) *</label>
                <input
                  id="topics"
                  type="text"
                  placeholder="e.g. product management, career transition"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  className="mt-1 block w-full rounded border border-stone-200 bg-white px-3 py-2 text-charcoal focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
                />
              </div>
              <div>
                <label htmlFor="industryTags" className="block text-sm font-medium text-charcoal/80">Industry tags (comma-separated)</label>
                <input
                  id="industryTags"
                  type="text"
                  placeholder="e.g. tech, healthcare"
                  value={industryTags}
                  onChange={(e) => setIndustryTags(e.target.value)}
                  className="mt-1 block w-full rounded border border-stone-200 bg-white px-3 py-2 text-charcoal focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
                />
              </div>
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-charcoal/80">Availability</label>
                <select
                  id="availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="mt-1 block w-full rounded border border-stone-200 bg-white px-3 py-2 text-charcoal focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
                >
                  <option value="NONE">None</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-charcoal/80">Contact email (for coffee chat) *</label>
                <input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder={email}
                  className="mt-1 block w-full rounded border border-stone-200 bg-white px-3 py-2 text-charcoal focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-maroon px-4 py-2.5 text-sm font-medium text-white hover:bg-maroon-hover disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>
        <p className="text-center text-sm text-charcoal/70">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-maroon hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
