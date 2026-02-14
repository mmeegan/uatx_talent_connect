import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMentorIncomingRequests } from "@/lib/server-data";
import Link from "next/link";

export default async function MentorDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if ((session.user as { role?: string }).role !== "MENTOR") redirect("/dashboard/student");

  const requests = await getMentorIncomingRequests(session);
  const pending = requests.filter((r: { status: string }) => r.status === "PENDING");

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-semibold text-stone-800">
            Bridge
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard/mentor" className="text-sm font-medium text-stone-900">
              Incoming requests
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
        <h1 className="text-2xl font-semibold text-stone-900">Incoming requests</h1>
        <p className="mt-1 text-stone-600">
          Students have sent you coffee chat requests. Accept or decline each one.
        </p>

        {requests.length === 0 ? (
          <div className="mt-8 rounded-lg border border-stone-200 bg-white p-8 text-center text-stone-600">
            <p>No requests yet. When a student sends you a request, it will appear here.</p>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {requests.map(
              (r: {
                id: string;
                status: string;
                createdAt: string;
                helpRequest: {
                  id: string;
                  title: string;
                  description: string;
                  studentName: string;
                };
              }) => (
                <li key={r.id} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-stone-900">{r.helpRequest.title}</p>
                      <p className="text-sm text-stone-600">From {r.helpRequest.studentName}</p>
                      <p className="mt-2 text-sm text-stone-700">{r.helpRequest.description}</p>
                      <span
                        className={`mt-2 inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          r.status === "ACCEPTED"
                            ? "bg-green-100 text-green-800"
                            : r.status === "DECLINED"
                            ? "bg-stone-100 text-stone-600"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    {r.status === "PENDING" && (
                      <Link
                        href={`/dashboard/mentor/requests/${r.id}`}
                        className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
                      >
                        Respond
                      </Link>
                    )}
                  </div>
                </li>
              )
            )}
          </ul>
        )}

        {pending.length > 0 && (
          <p className="mt-4 text-sm text-stone-500">
            {pending.length} pending request(s) — open each to accept or decline.
          </p>
        )}
      </main>
    </div>
  );
}
