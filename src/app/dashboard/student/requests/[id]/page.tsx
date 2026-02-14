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

  const accepted = request.mentorRequests?.filter((m: { status: string }) => m.status === "ACCEPTED") ?? [];

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
        <h1 className="mt-4 text-2xl font-semibold text-stone-900">{request.title}</h1>
        <p className="mt-2 text-stone-700">{request.description}</p>
        {request.tags?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {request.tags.map((t: string) => (
              <span key={t} className="rounded bg-stone-200 px-2 py-0.5 text-xs text-stone-700">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-lg font-medium text-stone-900">Mentor requests</h2>
          <ul className="mt-4 space-y-4">
            {request.mentorRequests?.map((mr: { id: string; status: string; mentor: { name: string; headline: string; contactEmail?: string } }) => (
              <li key={mr.id} className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-stone-900">{mr.mentor.name}</p>
                    <p className="text-sm text-stone-600">{mr.mentor.headline}</p>
                    <span
                      className={`mt-2 inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        mr.status === "ACCEPTED"
                          ? "bg-green-100 text-green-800"
                          : mr.status === "DECLINED"
                          ? "bg-stone-100 text-stone-600"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {mr.status}
                    </span>
                  </div>
                  {mr.status === "ACCEPTED" && mr.mentor.contactEmail && (
                    <a
                      href={getCoffeeChatEmailTemplate(mr.mentor.name, mr.mentor.contactEmail, request.title)}
                      className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
                    >
                      Email to schedule
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {(!request.mentorRequests || request.mentorRequests.length === 0) && (
            <p className="mt-4 text-stone-500">No mentor requests yet. Send to matches from the Matches page.</p>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <Link
            href={`/dashboard/student/requests/${id}/matches`}
            className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            View matches
          </Link>
        </div>
      </main>
    </div>
  );
}
