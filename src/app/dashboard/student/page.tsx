import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStudentHelpRequests } from "@/lib/server-data";
import Link from "next/link";
import NewRequestForm from "@/components/NewRequestForm";
import DashboardNav from "@/components/DashboardNav";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";

const MAX_WIDTH_CLASS = "max-w-[880px]";

type RequestItem = {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: Date;
  mentorRequests: { status: string; mentorName: string; contactEmail?: string }[];
};

function badgeVariant(status: string): "success" | "warning" | "muted" {
  if (status === "ACCEPTED") return "success";
  if (status === "PENDING") return "warning";
  return "muted";
}

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if ((session.user as { role?: string }).role !== "STUDENT") redirect("/dashboard/mentor");

  const requests = await getStudentHelpRequests(session);

  return (
    <div className="min-h-screen w-full bg-[#0B0F14]">
      <DashboardNav mainHref="/dashboard/student" mainLabel="Requests" />

      <main className="mx-auto w-full px-6 py-10 lg:px-8">
        <div className={`mx-auto ${MAX_WIDTH_CLASS}`}>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            Start a mentorship request
          </h1>
          <div className="mt-2 h-px w-16 bg-zinc-700" />
          <p className="mt-4 text-zinc-400">
            Describe what you need help with and we’ll match you with up to three mentors. You’ll see updates here when they respond.
          </p>

          <div className="mt-10 space-y-8">
            <Card aria-labelledby="requests-heading">
              <Section title="Active requests" id="requests">
                {requests.length === 0 ? (
                  <p className="py-8 text-center text-sm text-zinc-500">
                    No requests yet. Begin by submitting one below.
                  </p>
                ) : (
                  <ul className="space-y-3" role="list">
                    {(requests as RequestItem[]).map((r) => (
                      <li key={r.id}>
                        <Link
                          href={`/dashboard/student/requests/${r.id}`}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 transition-colors duration-200 hover:border-zinc-700 hover:bg-zinc-800/50"
                        >
                          <span className="font-medium text-zinc-100">{r.title}</span>
                          <Badge variant={badgeVariant(r.status)}>{r.status}</Badge>
                          {r.createdAt && (
                            <span className="w-full text-xs text-zinc-500 sm:w-auto">
                              {new Date(r.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            </Card>

            <Card aria-labelledby="new-request-heading">
              <h2 id="new-request-heading" className="text-lg font-semibold text-zinc-100">
                New request
              </h2>
              <div className="mt-2 h-px bg-zinc-800" />
              <p className="mt-4 text-sm text-zinc-400">
                Fill in what you need help with and relevant topics so we can match you with mentors.
              </p>
              <div className="mt-6">
                <NewRequestForm />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
