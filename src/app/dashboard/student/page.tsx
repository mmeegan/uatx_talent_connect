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
    <div className="relative min-h-screen w-full bg-[#0B0F14]">
      <div className="radial-bg absolute inset-0 pointer-events-none" aria-hidden />
      <DashboardNav mainHref="/dashboard/student" mainLabel="Requests" />

      <main className="relative mx-auto w-full px-6 py-16 lg:px-8">
        <div className={`mx-auto ${MAX_WIDTH_CLASS}`}>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#F4F4F2] sm:text-5xl leading-tight">
            Start a mentorship request
          </h1>
          <div className="mt-4 h-px w-16 bg-[#C6A75E]" />
          <p className="mt-6 text-[rgba(244,244,242,0.6)] leading-relaxed">
            Describe what you need help with and we&apos;ll match you with up to three mentors. You&apos;ll see updates here when they respond.
          </p>

          <div className="mt-20 space-y-20">
            <Card aria-labelledby="requests-heading" className="transition-transform duration-200 hover:-translate-y-0.5">
              <Section title="Active requests" id="requests">
                {requests.length === 0 ? (
                  <p className="py-8 text-center text-sm text-[rgba(244,244,242,0.4)]">
                    No requests yet. Begin by submitting one below.
                  </p>
                ) : (
                  <ul className="space-y-4" role="list">
                    {(requests as RequestItem[]).map((r) => (
                      <li key={r.id}>
                        <Link
                          href={`/dashboard/student/requests/${r.id}`}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.12)]"
                        >
                          <span className="font-medium text-[#F4F4F2]">{r.title}</span>
                          <Badge variant={badgeVariant(r.status)}>{r.status}</Badge>
                          {r.createdAt && (
                            <span className="w-full text-xs text-[rgba(244,244,242,0.4)] sm:w-auto">
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

            <Card aria-labelledby="new-request-heading" className="transition-transform duration-200 hover:-translate-y-0.5">
              <h2 id="new-request-heading" className="text-xl font-medium text-[#F4F4F2]">
                New request
              </h2>
              <div className="mt-3 h-px bg-[rgba(255,255,255,0.08)]" />
              <p className="mt-5 text-sm text-[rgba(244,244,242,0.6)] leading-relaxed">
                Fill in what you need help with and relevant topics so we can match you with mentors.
              </p>
              <div className="mt-8">
                <NewRequestForm />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
