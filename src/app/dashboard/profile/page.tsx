"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";

type StudentProfile = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  center?: string | null;
  tags?: string[];
};

type MentorProfile = {
  id: string;
  name: string;
  headline: string;
  bio: string;
  imageUrl?: string | null;
  topics?: string[];
  industryTags?: string[];
  availability: string;
  contactEmail: string;
};

type MeResponse = {
  id: string;
  email: string;
  role: string;
  profile: StudentProfile | MentorProfile | null;
};

const UATX_CENTERS = [
  "Austin",
  "Bay Area",
  "Boston",
  "London",
  "New York",
  "Other",
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const role = (session?.user as { role?: string })?.role;
  const isMentor = role === "MENTOR";
  const mainHref = isMentor ? "/dashboard/mentor" : "/dashboard/student";
  const mainLabel = isMentor ? "Incoming requests" : "Your requests";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status !== "authenticated") return;
    (async () => {
      const res = await fetch("/api/profiles/me");
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json);
      setLoading(false);
    })();
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-uatx-cream flex items-center justify-center">
        <p className="text-uatx-sand">Loading…</p>
      </div>
    );
  }
  if (status === "unauthenticated" || !data) return null;

  const profile = data.profile;
  if (!profile) {
    return (
      <div className="min-h-screen w-full bg-uatx-cream">
        <DashboardNav mainHref={mainHref} mainLabel={mainLabel} />
        <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
          <p className="text-uatx-sand">No profile found.</p>
        </main>
      </div>
    );
  }

  if (isMentor) {
    return (
      <MentorProfileForm
        profile={profile as MentorProfile}
        mainHref={mainHref}
        mainLabel={mainLabel}
        onSave={async (payload) => {
          setError("");
          setSuccess(false);
          setSaving(true);
          const res = await fetch("/api/profiles/me/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const result = await res.json().catch(() => ({}));
          setSaving(false);
          if (!res.ok) {
            setError(result.error || "Failed to update profile.");
            return;
          }
          setSuccess(true);
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  profile: { ...(prev.profile as MentorProfile), ...payload },
                }
              : null
          );
        }}
        error={error}
        success={success}
        saving={saving}
      />
    );
  }

  return (
    <StudentProfileForm
      profile={profile as StudentProfile}
      mainHref={mainHref}
      mainLabel={mainLabel}
      onSave={async (payload) => {
        setError("");
        setSuccess(false);
        setSaving(true);
        const res = await fetch("/api/profiles/me/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json().catch(() => ({}));
        setSaving(false);
        if (!res.ok) {
          setError(result.error || "Failed to update profile.");
          return;
        }
        setSuccess(true);
        setData((prev) =>
          prev
            ? {
                ...prev,
                profile: { ...(prev.profile as StudentProfile), ...payload },
              }
            : null
        );
      }}
      error={error}
      success={success}
      saving={saving}
    />
  );
}

const inputClass =
  "mt-1 block w-full rounded border border-uatx-ink/15 bg-white px-3 py-2 text-body text-uatx-ink placeholder:text-uatx-sand focus:border-uatx-gold focus:outline-none focus:ring-1 focus:ring-uatx-gold";
const labelClass = "block text-small font-medium text-uatx-ink";

function StudentProfileForm({
  profile,
  mainHref,
  mainLabel,
  onSave,
  error,
  success,
  saving,
}: {
  profile: StudentProfile;
  mainHref: string;
  mainLabel: string;
  onSave: (p: Partial<StudentProfile> & { tags?: string[] }) => void;
  error: string;
  success: boolean;
  saving: boolean;
}) {
  const [name, setName] = useState(profile.name);
  const [description, setDescription] = useState(profile.description ?? "");
  const [imageUrl, setImageUrl] = useState(profile.imageUrl ?? "");
  const [center, setCenter] = useState(profile.center ?? "");
  const [tagsStr, setTagsStr] = useState((profile.tags ?? []).join(", "));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name: name.trim() || "Student",
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      center: center.trim() || undefined,
      tags: tagsStr.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean),
    });
  }

  return (
    <div className="min-h-screen w-full bg-uatx-cream">
      <DashboardNav mainHref={mainHref} mainLabel={mainLabel} />
      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
        <Link href={mainHref} className="text-small text-uatx-sand hover:text-uatx-gold transition-colors">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 font-display text-display-md uppercase tracking-tight text-uatx-ink">
          Profile
        </h1>
        <p className="mt-1 text-small text-uatx-sand">
          Your public profile for the talent network.
        </p>

        <div className="mt-8 flex flex-col gap-8 md:flex-row">
          {(imageUrl || profile.imageUrl) && (
            <div className="shrink-0">
              <img
                src={imageUrl || profile.imageUrl || ""}
                alt=""
                className="h-32 w-32 rounded-full border-2 border-uatx-gold/30 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
          <section className="max-w-lg flex-1 border border-uatx-ink/10 bg-white p-6">
            <h2 className="font-display text-small font-semibold uppercase tracking-wider text-uatx-ink">
              Edit profile
            </h2>
            {error && (
              <p className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-small text-red-800">
                {error}
              </p>
            )}
            {success && (
              <p className="mt-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-small text-green-800">
                Profile updated.
              </p>
            )}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className={labelClass}>Name</label>
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short bio or what you’re looking for"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="imageUrl" className={labelClass}>Profile picture (URL)</label>
                <input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://…"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="center" className={labelClass}>UATX center</label>
                <select
                  id="center"
                  value={center || ""}
                  onChange={(e) => setCenter(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select your center</option>
                  {UATX_CENTERS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="tags" className={labelClass}>Interest tags (comma-separated)</label>
                <input
                  id="tags"
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="e.g. product, design, engineering"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded border border-uatx-gold bg-uatx-gold px-4 py-2 text-small font-semibold uppercase tracking-wide text-uatx-ink hover:bg-uatx-gold/90 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving…" : "Save profile"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

function MentorProfileForm({
  profile,
  mainHref,
  mainLabel,
  onSave,
  error,
  success,
  saving,
}: {
  profile: MentorProfile;
  mainHref: string;
  mainLabel: string;
  onSave: (p: Partial<MentorProfile>) => void;
  error: string;
  success: boolean;
  saving: boolean;
}) {
  const [name, setName] = useState(profile.name);
  const [headline, setHeadline] = useState(profile.headline ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [imageUrl, setImageUrl] = useState(profile.imageUrl ?? "");
  const [topicsStr, setTopicsStr] = useState((profile.topics ?? []).join(", "));
  const [industryTagsStr, setIndustryTagsStr] = useState((profile.industryTags ?? []).join(", "));
  const [contactEmail, setContactEmail] = useState(profile.contactEmail ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name: name.trim() || "Mentor",
      headline: headline.trim(),
      bio: bio.trim(),
      imageUrl: imageUrl.trim() || undefined,
      topics: topicsStr.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean),
      industryTags: industryTagsStr.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean),
      contactEmail: contactEmail.trim(),
    });
  }

  return (
    <div className="min-h-screen w-full bg-uatx-cream">
      <DashboardNav mainHref={mainHref} mainLabel={mainLabel} />
      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
        <Link href={mainHref} className="text-small text-uatx-sand hover:text-uatx-gold transition-colors">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 font-display text-display-md uppercase tracking-tight text-uatx-ink">
          Profile
        </h1>
        <p className="mt-1 text-small text-uatx-sand">
          Your mentor profile: description, picture, and expertise.
        </p>

        <div className="mt-8 flex flex-col gap-8 md:flex-row">
          {(imageUrl || profile.imageUrl) && (
            <div className="shrink-0">
              <img
                src={imageUrl || profile.imageUrl || ""}
                alt=""
                className="h-32 w-32 rounded-full border-2 border-uatx-gold/30 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
          <section className="max-w-lg flex-1 border border-uatx-ink/10 bg-white p-6">
            <h2 className="font-display text-small font-semibold uppercase tracking-wider text-uatx-ink">
              Edit profile
            </h2>
            {error && (
              <p className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-small text-red-800">
                {error}
              </p>
            )}
            {success && (
              <p className="mt-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-small text-green-800">
                Profile updated.
              </p>
            )}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="m-name" className={labelClass}>Name</label>
                <input id="m-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="headline" className={labelClass}>Headline</label>
                <input
                  id="headline"
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Product Lead at …"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="bio" className={labelClass}>Description / Bio</label>
                <textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short bio and what you can help with"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="m-imageUrl" className={labelClass}>Profile picture (URL)</label>
                <input
                  id="m-imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://…"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="topics" className={labelClass}>Expertise / topics (comma-separated)</label>
                <input
                  id="topics"
                  type="text"
                  value={topicsStr}
                  onChange={(e) => setTopicsStr(e.target.value)}
                  placeholder="e.g. product strategy, career transitions"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="industryTags" className={labelClass}>Fields / industries (comma-separated)</label>
                <input
                  id="industryTags"
                  type="text"
                  value={industryTagsStr}
                  onChange={(e) => setIndustryTagsStr(e.target.value)}
                  placeholder="e.g. tech, healthcare, design"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className={labelClass}>Contact email</label>
                <input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded border border-uatx-gold bg-uatx-gold px-4 py-2 text-small font-semibold uppercase tracking-wide text-uatx-ink hover:bg-uatx-gold/90 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving…" : "Save profile"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
