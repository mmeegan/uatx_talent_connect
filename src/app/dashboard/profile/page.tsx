"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";
import { TOPIC_OPTIONS, INDUSTRY_OPTIONS, UATX_CENTERS } from "@/lib/constants";
import PillMultiSelect from "@/components/PillMultiSelect";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

type StudentProfile = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  center?: string[] | string | null;
  tags?: string[];
  industryTags?: string[];
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

function parseCenter(center: string[] | string | null | undefined): string[] {
  if (!center) return [];
  if (Array.isArray(center)) return center;
  try {
    const parsed = JSON.parse(center);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return center ? [center] : [];
  }
}

const AVAILABILITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"] as const;

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500";
const labelClass = "block text-sm font-medium text-zinc-300";

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
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }
  if (status === "unauthenticated" || !data) return null;

  const profile = data.profile;
  if (!profile) {
    return (
      <div className="min-h-screen w-full bg-[#0B0F14]">
        <DashboardNav mainHref={mainHref} mainLabel={mainLabel} />
        <main className="mx-auto w-full max-w-[880px] px-6 py-10 lg:px-8">
          <p className="text-zinc-500">No profile found.</p>
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
            prev ? { ...prev, profile: { ...(prev.profile as MentorProfile), ...payload } } : null
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
          prev ? { ...prev, profile: { ...(prev.profile as StudentProfile), ...payload } } : null
        );
      }}
      error={error}
      success={success}
      saving={saving}
    />
  );
}

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
  onSave: (p: Partial<StudentProfile> & { tags?: string[]; industryTags?: string[]; center?: string[] }) => void;
  error: string;
  success: boolean;
  saving: boolean;
}) {
  const [name, setName] = useState(profile.name);
  const [description, setDescription] = useState(profile.description ?? "");
  const [imageUrl, setImageUrl] = useState(profile.imageUrl ?? "");
  const [centers, setCenters] = useState<string[]>(() => parseCenter(profile.center));
  const [tags, setTags] = useState<string[]>(() => profile.tags ?? []);
  const [industryTags, setIndustryTags] = useState<string[]>(() => profile.industryTags ?? []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name: name.trim() || "Student",
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      center: centers,
      tags,
      industryTags,
    });
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0F14]">
      <DashboardNav mainHref={mainHref} mainLabel={mainLabel} />
      <main className="mx-auto w-full max-w-[880px] px-6 py-10 lg:px-8">
        <Link href={mainHref} className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-200">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-100">{profile.name}</h1>
        <div className="mt-2 h-px w-16 bg-zinc-700" />
        <p className="mt-4 text-zinc-400">Your public profile.</p>

        <Card className="mt-8">
          {error && (
            <p className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 mb-4" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 mb-4">
              Profile updated.
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Section title="About">
              <div className="space-y-4">
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
                  <input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" className={inputClass} />
                </div>
                {(imageUrl || profile.imageUrl) && (
                  <div className="shrink-0">
                    <img
                      src={imageUrl || profile.imageUrl || ""}
                      alt=""
                      className="h-24 w-24 rounded-full border border-zinc-700 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
              </div>
            </Section>
            <Section title="UATX center(s)">
              <PillMultiSelect id="centers" label="Centers" options={UATX_CENTERS} selected={centers} onChange={setCenters} />
            </Section>
            <Section title="Expertise">
              <div className="space-y-4">
                <PillMultiSelect id="topics" label="Topics" options={TOPIC_OPTIONS} selected={tags} onChange={setTags} />
                <PillMultiSelect id="industries" label="Industries / fields" options={INDUSTRY_OPTIONS} selected={industryTags} onChange={setIndustryTags} optional />
              </div>
            </Section>
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-[#0B0F14] disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save profile"}
              </button>
            </div>
          </form>
        </Card>
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
  const [topics, setTopics] = useState<string[]>(() => profile.topics ?? []);
  const [industryTags, setIndustryTags] = useState<string[]>(() => profile.industryTags ?? []);
  const [availability, setAvailability] = useState(profile.availability ?? "MEDIUM");
  const [contactEmail, setContactEmail] = useState(profile.contactEmail ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name: name.trim() || "Mentor",
      headline: headline.trim(),
      bio: bio.trim(),
      imageUrl: imageUrl.trim() || undefined,
      topics,
      industryTags,
      availability,
      contactEmail: contactEmail.trim(),
    });
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0F14]">
      <DashboardNav mainHref={mainHref} mainLabel={mainLabel} />
      <main className="mx-auto w-full max-w-[880px] px-6 py-10 lg:px-8">
        <Link href={mainHref} className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-200">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-100">{profile.name}</h1>
        <p className="mt-1 text-zinc-500">{profile.headline || "Mentor"}</p>
        <div className="mt-2 h-px w-16 bg-zinc-700" />
        <p className="mt-4 text-zinc-400">Your mentor profile.</p>

        <Card className="mt-8">
          {error && (
            <p className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 mb-4" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 mb-4">
              Profile updated.
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Section title="About">
              <div className="space-y-4">
                <div>
                  <label htmlFor="m-name" className={labelClass}>Name</label>
                  <input id="m-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="headline" className={labelClass}>Headline</label>
                  <input id="headline" type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Product Lead at …" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="bio" className={labelClass}>Description / Bio</label>
                  <textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short bio and what you can help with" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="m-imageUrl" className={labelClass}>Profile picture (URL)</label>
                  <input id="m-imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" className={inputClass} />
                </div>
                {(imageUrl || profile.imageUrl) && (
                  <div className="shrink-0">
                    <img
                      src={imageUrl || profile.imageUrl || ""}
                      alt=""
                      className="h-24 w-24 rounded-full border border-zinc-700 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="contactEmail" className={labelClass}>Contact email</label>
                  <input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputClass} />
                </div>
              </div>
            </Section>
            <Section title="Expertise">
              <div className="space-y-4">
                <PillMultiSelect id="m-topics" label="Topics you mentor on" options={TOPIC_OPTIONS} selected={topics} onChange={setTopics} />
                <PillMultiSelect id="m-industries" label="Industries / fields" options={INDUSTRY_OPTIONS} selected={industryTags} onChange={setIndustryTags} />
              </div>
            </Section>
            <Section title="Availability">
              <span id="av-label" className="block text-sm font-medium text-zinc-300">Capacity for new conversations</span>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="av-label">
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAvailability(opt)}
                    className={
                      "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-[#0B0F14] " +
                      (availability === opt
                        ? "border-zinc-400 bg-zinc-100 text-zinc-900"
                        : "border-zinc-700 bg-transparent text-zinc-400 hover:bg-zinc-800")
                    }
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </Section>
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-[#0B0F14] disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save profile"}
              </button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
