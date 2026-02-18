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
    <div className="min-h-screen bg-uatx-cream">
      <header className="bg-uatx-ink border-b border-uatx-gold/20">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="font-display text-section uppercase tracking-wide text-uatx-ivory">
            Bridge
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard/mentor" className="text-small font-medium text-uatx-ivory">
              Incoming requests
            </Link>
            <Link
              href="/api/auth/signout"
              className="text-small text-uatx-ivory/80 hover:text-uatx-gold transition-colors"
            >
              Sign out
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-display text-display-md uppercase tracking-tight text-uatx-ink">Incoming requests</h1>
        <p className="mt-1 text-small text-uatx-sand">
          Students have been matched to you. Accept or decline each request.
        </p>

        {requests.length === 0 ? (
          <div className="mt-8 border border-uatx-ink/10 bg-uatx-cream p-8 text-center text-body text-uatx-sand">
            <p>No requests yet. When a student’s request is matched to you, it will appear here.</p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
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
                <li key={r.id} className="border border-uatx-ink/10 bg-uatx-cream p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-body text-uatx-ink">{r.helpRequest.title}</p>
                      <p className="text-small text-uatx-sand">From {r.helpRequest.studentName}</p>
                      <p className="mt-2 text-small text-uatx-sand">{r.helpRequest.description}</p>
                      <span
                        className={`mt-2 inline-block rounded border px-2 py-0.5 text-small font-semibold uppercase tracking-wide ${
                          r.status === "ACCEPTED"
                            ? "border-uatx-gold/50 bg-uatx-gold/10 text-uatx-ink"
                            : r.status === "DECLINED"
                            ? "border-uatx-ink/15 bg-uatx-ink/5 text-uatx-sand"
                            : "border-uatx-gold/40 bg-uatx-gold/5 text-uatx-sand"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    {r.status === "PENDING" && (
                      <Link
                        href={`/dashboard/mentor/requests/${r.id}`}
                        className="shrink-0 rounded border border-uatx-gold bg-uatx-gold px-3 py-1.5 text-small font-semibold uppercase tracking-wide text-uatx-ink hover:bg-uatx-gold/90 transition-colors"
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
          <p className="mt-4 text-small text-uatx-sand">
            {pending.length} pending — open each to accept or decline.
          </p>
        )}
      </main>
    </div>
  );
}
