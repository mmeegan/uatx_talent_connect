import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentHelpRequests } from "@/lib/server-data";
import Link from "next/link";
import NewRequestForm from "@/components/NewRequestForm";
import DashboardNav from "@/components/DashboardNav";

const MAX_WIDTH_CLASS = "max-w-[720px]";

type RequestItem = {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: Date;
  mentorRequests: { status: string; mentorName: string; contactEmail?: string }[];
};

function DashboardHeader() {
  return (
    <header className="mb-8">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-uatx-ink sm:text-3xl">
        Start a Mentorship Request
      </h1>
      <p className="mt-2 text-base text-uatx-sand">
        Describe what you need help with and we’ll match you with up to three mentors. You’ll see updates here when they respond.
      </p>
    </header>
  );
}

function RequestsCard({ requests }: { requests: RequestItem[] }) {
  return (
    <section
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      aria-labelledby="requests-heading"
    >
      <h2 id="requests-heading" className="text-lg font-semibold text-uatx-ink">
        Your requests
      </h2>
      {requests.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-gray-200 bg-gray-50/50 py-10 text-center">
          <p className="text-sm text-uatx-sand">
            No requests yet. Submit one below and it will appear here with its status.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4" role="list">
          {requests.map((r) => (
            <li key={r.id}>
              <Link
                href={`/dashboard/student/requests/${r.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-uatx-gold/40 hover:bg-uatx-gold/5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="font-medium text-uatx-ink">{r.title}</span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                      r.status === "ACCEPTED"
                        ? "bg-uatx-gold/15 text-uatx-ink border border-uatx-gold/40"
                        : r.status === "PENDING"
                        ? "bg-uatx-gold/5 text-uatx-sand border border-uatx-gold/30"
                        : "bg-gray-100 text-uatx-sand border border-gray-200"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                {r.createdAt && (
                  <p className="mt-1 text-xs text-uatx-sand">
                    {new Date(r.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function NewRequestCard() {
  return (
    <section
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      aria-labelledby="new-request-heading"
    >
      <h2 id="new-request-heading" className="text-lg font-semibold text-uatx-ink">
        New request
      </h2>
      <p className="mt-1 text-sm text-uatx-sand">
        Fill in what you need help with and relevant topics so we can match you with mentors.
      </p>
      <div className="mt-6">
        <NewRequestForm />
      </div>
    </section>
  );
}

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if ((session.user as { role?: string }).role !== "STUDENT") redirect("/dashboard/mentor");

  const requests = await getStudentHelpRequests(session);

  return (
    <div className="min-h-screen w-full bg-uatx-cream">
      <DashboardNav mainHref="/dashboard/student" mainLabel="Your requests" />

      <main className="mx-auto w-full px-6 py-10 lg:px-8">
        <div className={`mx-auto ${MAX_WIDTH_CLASS}`}>
          <DashboardHeader />
          <div className="space-y-8">
            <RequestsCard requests={requests as RequestItem[]} />
            <NewRequestCard />
          </div>
        </div>
      </main>
    </div>
  );
}
