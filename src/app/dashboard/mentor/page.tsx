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
import ConnectionListItem from "@/components/ConnectionListItem";

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
    studentImageUrl?: string;
    studentCenters?: string[];
  };
};

type ConnectionRow = {
  id: string;
  helpRequestTitle: string;
  studentName: string;
  studentEmail: string;
  studentImageUrl?: string;
  studentCenters?: string[];
};

export default async function MentorDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const role = (session.user as { role?: string }).role;
  if (role === "ADMIN") redirect("/admin");
  if (role !== "MENTOR") redirect("/dashboard/student");

  const requests = await getMentorIncomingRequests(session);
  const connections = await getMentorConnections(session);

  return (
    <div className="relative min-h-screen w-full bg-[#0B0F14]">
      <div className="radial-bg absolute inset-0 pointer-events-none" aria-hidden />
      <DashboardNav mainHref="/dashboard/mentor" mainLabel="Requests" />

      <main className="relative mx-auto w-full px-6 py-16 lg:px-8">
        <div className={`mx-auto ${MAX_WIDTH_CLASS}`}>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h1 className="font-display text-4xl font-bold tracking-tight text-[#F4F4F2] sm:text-5xl leading-tight">
                Incoming requests
              </h1>
              <div className="mt-4 h-px w-16 bg-[#C6A75E]" />
              <p className="mt-6 text-[rgba(244,244,242,0.6)] leading-relaxed">
                Students have been matched to you. Accept or decline each request.
              </p>

              {requests.length === 0 ? (
                <Card className="mt-10 transition-transform duration-200 hover:-translate-y-0.5">
                  <p className="py-8 text-center text-sm text-[rgba(244,244,242,0.4)]">
                    No requests yet. When a student&apos;s request is matched to you, it will appear here.
                  </p>
                </Card>
              ) : (
                <ul className="mt-10 space-y-6" role="list">
                  {(requests as RequestRow[]).map((r) => {
                    const req = r.helpRequest as RequestRow["helpRequest"];
                    const centerLabel = req.studentCenters?.length ? ` · ${req.studentCenters.join(", ")}` : "";
                    return (
                    <li key={r.id}>
                      <Card className="border-[rgba(255,255,255,0.08)] transition-transform duration-200 hover:-translate-y-0.5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1 flex gap-4">
                            {req.studentImageUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={req.studentImageUrl}
                                alt=""
                                className="h-12 w-12 shrink-0 rounded-full border border-[rgba(255,255,255,0.12)] object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 shrink-0 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[rgba(244,244,242,0.4)] text-sm font-medium">
                                {(r.helpRequest.studentName || "S").charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                            <p className="font-medium text-[#F4F4F2]">{r.helpRequest.title}</p>
                            <p className="mt-1 text-sm text-[rgba(244,244,242,0.5)]">From {r.helpRequest.studentName}{centerLabel}</p>
                            <p className="mt-3 text-sm text-[rgba(244,244,242,0.6)] line-clamp-2 leading-relaxed">{r.helpRequest.description}</p>
                            {r.helpRequest.tags?.length ? (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {r.helpRequest.tags.map((t: string) => (
                                  <span
                                    key={t}
                                    className="rounded-full border border-[rgba(255,255,255,0.12)] px-2.5 py-0.5 text-xs text-[rgba(244,244,242,0.6)]"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                            <p className="mt-2 text-xs text-[rgba(244,244,242,0.4)]">
                              {new Date(r.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            <Badge variant="warning" className="mt-2">
                              Pending
                            </Badge>
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-2 sm:flex-col">
                            <Link href={`/dashboard/mentor/requests/${r.id}`}>
                              <Button variant="primary" className="w-full sm:w-auto">
                                Respond
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </li>
                  ); })}
                </ul>
              )}

              {requests.length > 0 && (
                <p className="mt-6 text-sm text-[rgba(244,244,242,0.5)]">
                  Open each to accept or decline.
                </p>
              )}
            </div>

            <aside>
              <Section title="Connections">
                <p className="text-sm text-[rgba(244,244,242,0.6)] leading-relaxed">
                  Students whose requests you&apos;ve accepted.
                </p>
                {connections.length === 0 ? (
                  <p className="mt-6 py-6 text-center text-sm text-[rgba(244,244,242,0.4)]">
                    No connections yet.
                  </p>
                ) : (
                  <ul className="mt-6 space-y-4" role="list">
                    {(connections as ConnectionRow[]).map((c) => (
                      <ConnectionListItem key={c.id} connection={c} />
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
