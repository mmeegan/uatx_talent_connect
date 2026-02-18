import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getHelpRequestById } from "@/lib/server-data";
import Link from "next/link";
import { getCoffeeChatEmailTemplate } from "@/lib/email-template";

export default async function StudentRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;
  const request = await getHelpRequestById(id, session);
  if (!request) redirect("/dashboard/student");

  return (
    <div className="min-h-screen bg-uatx-cream">
      <header className="bg-uatx-ink border-b border-uatx-gold/20">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/dashboard/student" className="font-display text-xl uppercase tracking-widest text-uatx-ivory">
            Bridge
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard/student" className="text-small text-uatx-ivory/80 hover:text-uatx-gold transition-colors">
              Your requests
            </Link>
            <Link href="/api/auth/signout" className="text-small text-uatx-ivory/80 hover:text-uatx-gold transition-colors">
              Sign out
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <Link href="/dashboard/student" className="text-small text-uatx-sand hover:text-uatx-gold transition-colors">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 font-display text-display-md uppercase tracking-tight text-uatx-ink">{request.title}</h1>
        <p className="mt-2 text-body text-uatx-sand">{request.description}</p>
        {request.tags?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {request.tags.map((t: string) => (
              <span key={t} className="rounded border border-uatx-gold/30 bg-uatx-gold/10 px-2 py-0.5 text-small text-uatx-ink">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10">
          <h2 className="font-display text-section uppercase tracking-wide text-uatx-ink">Mentor responses</h2>
          <ul className="mt-4 space-y-3">
            {request.mentorRequests?.map(
              (mr: {
                id: string;
                status: string;
                mentor: { name: string; headline: string; contactEmail?: string };
              }) => (
                <li
                  key={mr.id}
                  className="flex items-start justify-between border border-uatx-ink/10 bg-uatx-cream p-4"
                >
                  <div>
                    <p className="font-medium text-body text-uatx-ink">{mr.mentor.name}</p>
                    <p className="text-small text-uatx-sand">{mr.mentor.headline}</p>
                    <span
                      className={`mt-2 inline-block rounded border px-2 py-0.5 text-small font-semibold uppercase tracking-wide ${
                        mr.status === "ACCEPTED"
                          ? "border-uatx-gold/50 bg-uatx-gold/10 text-uatx-ink"
                          : mr.status === "DECLINED"
                          ? "border-uatx-ink/15 bg-uatx-ink/5 text-uatx-sand"
                          : "border-uatx-gold/40 bg-uatx-gold/5 text-uatx-sand"
                      }`}
                    >
                      {mr.status}
                    </span>
                  </div>
                  {mr.status === "ACCEPTED" && mr.mentor.contactEmail && (
                    <a
                      href={getCoffeeChatEmailTemplate(
                        mr.mentor.name,
                        mr.mentor.contactEmail,
                        request.title
                      )}
                      className="shrink-0 rounded border border-uatx-gold bg-uatx-gold px-3 py-1.5 text-small font-semibold uppercase tracking-wide text-uatx-ink hover:bg-uatx-gold/90 transition-colors"
                    >
                      Email to schedule
                    </a>
                  )}
                </li>
              )
            )}
          </ul>
          {(!request.mentorRequests || request.mentorRequests.length === 0) && (
            <p className="mt-4 text-small text-uatx-sand">
              Your request has been sent to mentors. Status will update here when they respond.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
