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
    <div className="min-h-screen bg-cream">
      <header className="border-b border-stone-200/80 bg-cream">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/dashboard/student" className="font-serif text-xl text-charcoal">
            Bridge
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard/student" className="text-sm text-charcoal/70 hover:text-charcoal">
              Your requests
            </Link>
            <Link href="/api/auth/signout" className="text-sm text-charcoal/70 hover:text-charcoal">
              Sign out
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <Link href="/dashboard/student" className="text-sm text-charcoal/70 hover:text-charcoal">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 font-serif text-2xl text-charcoal">{request.title}</h1>
        <p className="mt-2 text-charcoal/80">{request.description}</p>
        {request.tags?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {request.tags.map((t: string) => (
              <span key={t} className="rounded bg-stone-200/80 px-2 py-0.5 text-xs text-charcoal/80">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10">
          <h2 className="font-serif text-lg text-charcoal">Mentor responses</h2>
          <ul className="mt-4 space-y-4">
            {request.mentorRequests?.map(
              (mr: {
                id: string;
                status: string;
                mentor: { name: string; headline: string; contactEmail?: string };
              }) => (
                <li
                  key={mr.id}
                  className="flex items-start justify-between rounded border border-stone-200/80 bg-white p-4"
                >
                  <div>
                    <p className="font-medium text-charcoal">{mr.mentor.name}</p>
                    <p className="text-sm text-charcoal/70">{mr.mentor.headline}</p>
                    <span
                      className={`mt-2 inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        mr.status === "ACCEPTED"
                          ? "bg-green-100 text-green-800"
                          : mr.status === "DECLINED"
                          ? "bg-stone-100 text-charcoal/60"
                          : "bg-amber-50 text-amber-800"
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
                      className="shrink-0 rounded bg-maroon px-3 py-1.5 text-sm font-medium text-white hover:bg-maroon-hover"
                    >
                      Email to schedule
                    </a>
                  )}
                </li>
              )
            )}
          </ul>
          {(!request.mentorRequests || request.mentorRequests.length === 0) && (
            <p className="mt-4 text-sm text-charcoal/60">
              Your request has been sent to mentors. Status will update here when they respond.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
