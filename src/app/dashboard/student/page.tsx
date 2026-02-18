import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentHelpRequests } from "@/lib/server-data";
import Link from "next/link";
import NewRequestForm from "@/components/NewRequestForm";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if ((session.user as { role?: string }).role !== "STUDENT") redirect("/dashboard/mentor");

  const requests = await getStudentHelpRequests(session);

  return (
    <div className="min-h-screen w-full bg-uatx-cream">
      <header className="bg-uatx-ink border-b border-uatx-gold/20">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/dashboard/student" className="font-display text-xl uppercase tracking-widest text-uatx-ivory">
            Bridge
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/api/auth/signout"
              className="text-small text-uatx-ivory/80 hover:text-uatx-gold transition-colors"
            >
              Sign out
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          {/* Left: Your requests */}
          <section>
            <h2 className="font-display text-display-md uppercase tracking-tight text-uatx-ink">
              Your requests
            </h2>
            <p className="mt-1 text-small text-uatx-sand">
              Pending requests are with mentors; we’ll notify you when someone accepts.
            </p>
            {requests.length === 0 ? (
              <p className="mt-6 text-body text-uatx-sand">No requests yet. Submit one on the right.</p>
            ) : (
              <ul className="mt-5 space-y-2">
                {requests.map(
                  (r: {
                    id: string;
                    title: string;
                    status: string;
                    mentorRequests: { status: string; mentorName: string; contactEmail?: string }[];
                  }) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between border border-uatx-ink/10 bg-uatx-cream py-3 px-4"
                    >
                      <Link
                        href={`/dashboard/student/requests/${r.id}`}
                        className="font-medium text-body text-uatx-ink hover:text-uatx-gold transition-colors"
                      >
                        {r.title}
                      </Link>
                      <span
                        className={`rounded border px-2 py-0.5 text-small font-semibold uppercase tracking-wide ${
                          r.status === "ACCEPTED"
                            ? "border-uatx-gold/50 bg-uatx-gold/10 text-uatx-ink"
                            : r.status === "PENDING"
                            ? "border-uatx-gold/40 bg-uatx-gold/5 text-uatx-sand"
                            : "border-uatx-ink/15 bg-uatx-ink/5 text-uatx-sand"
                        }`}
                      >
                        {r.status}
                      </span>
                    </li>
                  )
                )}
              </ul>
            )}
          </section>

          {/* Right: New request form */}
          <section>
            <h2 className="font-display text-display-md uppercase tracking-tight text-uatx-ink">
              New request
            </h2>
            <p className="mt-1 text-small text-uatx-sand">
              Describe what you want help with. We’ll match you with up to three mentors automatically.
            </p>
            <div className="mt-5 border border-uatx-ink/10 bg-uatx-cream p-6">
              <NewRequestForm />
            </div>
          </section>
        </div>

        {/* Section C: How it works */}
        <section className="mt-16 border-t border-uatx-ink/10 pt-10">
          <h3 className="font-display text-small font-semibold uppercase tracking-wider text-uatx-sand">
            How it works
          </h3>
          <ol className="mt-4 space-y-3 text-body text-uatx-sand">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-uatx-gold/50 bg-uatx-gold/10 font-display text-small font-semibold text-uatx-ink">
                1
              </span>
              <span>Submit your request above. We match it to relevant mentors and send it to up to three of them.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-uatx-gold/50 bg-uatx-gold/10 font-display text-small font-semibold text-uatx-ink">
                2
              </span>
              <span>Mentors can accept or decline. You’ll see the status here; no need to pick anyone yourself.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-uatx-gold/50 bg-uatx-gold/10 font-display text-small font-semibold text-uatx-ink">
                3
              </span>
              <span>When a mentor accepts, we’ll show their contact and a prefilled email so you can schedule a 30-minute coffee chat.</span>
            </li>
          </ol>
        </section>
      </main>
    </div>
  );
}
