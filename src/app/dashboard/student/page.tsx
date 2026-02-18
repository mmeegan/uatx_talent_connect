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
    <div className="min-h-screen bg-cream">
      <header className="border-b border-stone-200/80 bg-cream">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/dashboard/student" className="font-serif text-xl text-charcoal">
            Bridge
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/api/auth/signout"
              className="text-sm text-charcoal/70 hover:text-charcoal"
            >
              Sign out
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Section A: Your requests */}
        <section>
          <h2 className="font-serif text-xl text-charcoal">Your requests</h2>
          <p className="mt-1 text-sm text-charcoal/70">
            Pending requests are with mentors; we’ll notify you when someone accepts.
          </p>
          {requests.length === 0 ? (
            <p className="mt-6 text-charcoal/60">No requests yet. Submit one below.</p>
          ) : (
            <ul className="mt-6 space-y-3">
              {requests.map(
                (r: {
                  id: string;
                  title: string;
                  status: string;
                  mentorRequests: { status: string; mentorName: string; contactEmail?: string }[];
                }) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between rounded border border-stone-200/80 bg-white py-3 px-4"
                  >
                    <Link
                      href={`/dashboard/student/requests/${r.id}`}
                      className="font-medium text-charcoal hover:text-maroon"
                    >
                      {r.title}
                    </Link>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        r.status === "ACCEPTED"
                          ? "bg-green-100 text-green-800"
                          : r.status === "PENDING"
                          ? "bg-amber-50 text-amber-800"
                          : "bg-stone-100 text-charcoal/70"
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

        {/* Section B: New request form */}
        <section className="mt-16">
          <h2 className="font-serif text-xl text-charcoal">New request</h2>
          <p className="mt-1 text-sm text-charcoal/70">
            Describe what you want help with. We’ll match you with up to three mentors automatically.
          </p>
          <div className="mt-6 rounded border border-stone-200/80 bg-white p-6">
            <NewRequestForm />
          </div>
        </section>

        {/* Section C: How it works */}
        <section className="mt-20 border-t border-stone-200/80 pt-12">
          <h3 className="font-serif text-sm font-medium uppercase tracking-wider text-charcoal/60">
            How it works
          </h3>
          <ol className="mt-4 space-y-4 text-sm text-charcoal/80">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maroon/10 font-serif text-xs text-maroon">
                1
              </span>
              <span>Submit your request above. We match it to relevant mentors and send it to up to three of them.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maroon/10 font-serif text-xs text-maroon">
                2
              </span>
              <span>Mentors can accept or decline. You’ll see the status here; no need to pick anyone yourself.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maroon/10 font-serif text-xs text-maroon">
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
