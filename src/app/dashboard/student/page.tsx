import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentHelpRequests } from "@/lib/server-data";
import Link from "next/link";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if ((session.user as { role?: string }).role !== "STUDENT") redirect("/dashboard/mentor");

  const requests = await getStudentHelpRequests(session);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-semibold text-stone-800">
            Bridge
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard/student" className="text-sm font-medium text-stone-900">
              My requests
            </Link>
            <Link
              href="/api/auth/signout"
              className="text-sm text-stone-600 hover:text-stone-900"
            >
              Sign out
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-stone-900">My help requests</h1>
          <Link
            href="/dashboard/student/requests/new"
            className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            New request
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="mt-8 rounded-lg border border-stone-200 bg-white p-8 text-center text-stone-600">
            <p>You haven’t created any help requests yet.</p>
            <Link
              href="/dashboard/student/requests/new"
              className="mt-2 inline-block font-medium text-stone-900 hover:underline"
            >
              Create your first request
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {requests.map((r: { id: string; title: string; mentorRequests: { status: string; mentorName: string; contactEmail?: string }[]; createdAt: string }) => (
              <li key={r.id} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/dashboard/student/requests/${r.id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {r.title}
                    </Link>
                    <p className="mt-1 text-sm text-stone-500">
                      {r.mentorRequests.length} mentor(s) requested ·{" "}
                      {r.mentorRequests.filter((m: { status: string }) => m.status === "ACCEPTED").length} accepted
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/student/requests/${r.id}/matches`}
                      className="rounded border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      Matches
                    </Link>
                    <Link
                      href={`/dashboard/student/requests/${r.id}`}
                      className="rounded bg-stone-100 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-200"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
