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
    <div className="min-h-screen bg-cream">
      <header className="border-b border-stone-200/80 bg-cream">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="font-serif text-xl text-charcoal">
            Bridge
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard/mentor" className="text-sm font-medium text-charcoal">
              Incoming requests
            </Link>
            <Link
              href="/api/auth/signout"
              className="text-sm text-charcoal/70 hover:text-charcoal"
            >
              Sign out
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="font-serif text-2xl text-charcoal">Incoming requests</h1>
        <p className="mt-1 text-charcoal/70">
          Students have been matched to you. Accept or decline each request.
        </p>

        {requests.length === 0 ? (
          <div className="mt-8 rounded border border-stone-200/80 bg-white p-8 text-center text-charcoal/60">
            <p>No requests yet. When a student’s request is matched to you, it will appear here.</p>
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
                <li key={r.id} className="rounded border border-stone-200/80 bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-charcoal">{r.helpRequest.title}</p>
                      <p className="text-sm text-charcoal/70">From {r.helpRequest.studentName}</p>
                      <p className="mt-2 text-sm text-charcoal/80">{r.helpRequest.description}</p>
                      <span
                        className={`mt-2 inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          r.status === "ACCEPTED"
                            ? "bg-green-100 text-green-800"
                            : r.status === "DECLINED"
                            ? "bg-stone-100 text-charcoal/60"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    {r.status === "PENDING" && (
                      <Link
                        href={`/dashboard/mentor/requests/${r.id}`}
                        className="shrink-0 rounded bg-maroon px-3 py-1.5 text-sm font-medium text-white hover:bg-maroon-hover"
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
          <p className="mt-4 text-sm text-charcoal/60">
            {pending.length} pending — open each to accept or decline.
          </p>
        )}
      </main>
    </div>
  );
}
