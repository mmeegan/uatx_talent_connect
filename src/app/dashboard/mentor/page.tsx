import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMentorConnections, getMentorIncomingRequests } from "@/lib/server-data";
import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const MAX_WIDTH_CLASS = "max-w-[1100px]";

type RequestRow = {
  id: string;
  status: string;
  createdAt: Date;
  helpRequest: {
    id: string;
    title: string;
    description: string;
    tags?: string[];
    studentName: string;
  };
};

type ConnectionRow = {
  id: string;
  helpRequestTitle: string;
  studentName: string;
  studentEmail: string;
};

export default async function MentorDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if ((session.user as { role?: string }).role !== "MENTOR") redirect("/dashboard/student");

  const requests = await getMentorIncomingRequests(session);
  const connections = await getMentorConnections(session);
  const pending = requests.filter((r: { status: string }) => r.status === "PENDING");

  return (
    <div className="min-h-screen w-full bg-[#0B0F14]">
      <DashboardNav mainHref="/dashboard/mentor" mainLabel="Requests" />

      <main className="mx-auto w-full px-6 py-10 lg:px-8">
        <div className={`mx-auto ${MAX_WIDTH_CLASS}`}>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
                Incoming requests
              </h1>
              <div className="mt-2 h-px w-16 bg-zinc-700" />
              <p className="mt-4 text-zinc-400">
                Students have been matched to you. Accept or decline each request.
              </p>

              {requests.length === 0 ? (
                <Card className="mt-8">
                  <p className="py-8 text-center text-sm text-zinc-500">
                    No requests yet. When a student’s request is matched to you, it will appear here.
                  </p>
                </Card>
              ) : (
                <ul className="mt-6 space-y-4" role="list">
                  {(requests as RequestRow[]).map((r) => (
                    <li key={r.id}>
                      <Card className="border-zinc-800">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-zinc-100">{r.helpRequest.title}</p>
                            <p className="mt-1 text-sm text-zinc-500">From {r.helpRequest.studentName}</p>
                            <p className="mt-3 text-sm text-zinc-400 line-clamp-2">{r.helpRequest.description}</p>
                            {r.helpRequest.tags?.length ? (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {r.helpRequest.tags.map((t: string) => (
                                  <span
                                    key={t}
                                    className="rounded-full border border-zinc-700 bg-zinc-800/50 px-2.5 py-0.5 text-xs text-zinc-400"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                            <p className="mt-2 text-xs text-zinc-500">
                              {new Date(r.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            <Badge
                              variant={
                                r.status === "ACCEPTED"
                                  ? "success"
                                  : r.status === "DECLINED"
                                  ? "muted"
                                  : "warning"
                              }
                              className="mt-2"
                            >
                              {r.status}
                            </Badge>
                          </div>
                          {r.status === "PENDING" && (
                            <div className="flex shrink-0 gap-2 sm:flex-col">
                              <Link href={`/dashboard/mentor/requests/${r.id}`}>
                                <Button variant="primary" className="w-full sm:w-auto">
                                  Respond
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}

              {pending.length > 0 && (
                <p className="mt-4 text-sm text-zinc-500">
                  {pending.length} pending — open each to accept or decline.
                </p>
              )}
            </div>

            <aside>
              <Section title="Connections">
                <p className="text-sm text-zinc-400">
                  Students whose requests you’ve accepted.
                </p>
                {connections.length === 0 ? (
                  <p className="mt-6 py-6 text-center text-sm text-zinc-500">
                    No connections yet.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3" role="list">
                    {(connections as ConnectionRow[]).map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/dashboard/mentor/requests/${c.id}`}
                          className="block rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 transition-colors duration-200 hover:border-zinc-700 hover:bg-zinc-800/50"
                        >
                          <span className="font-medium text-zinc-100">{c.helpRequestTitle}</span>
                          <p className="mt-1 text-sm text-zinc-500">{c.studentName}</p>
                          <a
                            href={`mailto:${encodeURIComponent(c.studentEmail)}`}
                            className="mt-1 inline-block text-sm text-zinc-400 hover:text-zinc-300 transition-colors duration-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {c.studentEmail}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
