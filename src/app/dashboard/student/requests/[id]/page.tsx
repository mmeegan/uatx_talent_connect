import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getHelpRequestById } from "@/lib/server-data";
import Link from "next/link";
import { getCoffeeChatEmailTemplate } from "@/lib/email-template";
import DashboardNav from "@/components/DashboardNav";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default async function StudentRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;
  const request = await getHelpRequestById(id, session);
  if (!request) redirect("/dashboard/student");

  return (
    <div className="relative min-h-screen bg-[#0B0F14]">
      <div className="radial-bg absolute inset-0 pointer-events-none" aria-hidden />
      <DashboardNav mainHref="/dashboard/student" mainLabel="Requests" />

      <main className="relative mx-auto w-full max-w-[1100px] px-6 py-16 lg:px-8">
        <Link href="/dashboard/student" className="text-sm text-[rgba(244,244,242,0.6)] hover:text-[#C6A75E] transition-colors">
          ← Back to dashboard
        </Link>
        <Card className="mt-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#F4F4F2]">
            {request.title}
          </h1>
          <p className="mt-4 text-[rgba(244,244,242,0.6)] leading-relaxed">{request.description}</p>
          {request.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {request.tags.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full border border-[rgba(255,255,255,0.12)] px-2.5 py-0.5 text-xs text-[rgba(244,244,242,0.6)]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </Card>

        <Section title="Mentor responses" className="mt-16">
          {!request.mentorRequests?.length ? (
            <p className="py-8 text-center text-sm text-[rgba(244,244,242,0.4)]">
              Your request has been sent to mentors. Status will update here when they respond.
            </p>
          ) : (
            <ul className="space-y-4" role="list">
              {request.mentorRequests.map(
                (mr: {
                  id: string;
                  status: string;
                  mentor: { name: string; headline: string; contactEmail?: string };
                }) => (
                  <li
                    key={mr.id}
                    className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5 backdrop-blur-sm"
                  >
                    <div>
                      {mr.status === "ACCEPTED" ? (
                        <>
                          <p className="font-medium text-[#F4F4F2]">{mr.mentor.name}</p>
                          <p className="text-sm text-[rgba(244,244,242,0.5)]">{mr.mentor.headline}</p>
                          <Badge variant="success" className="mt-2">Accepted</Badge>
                        </>
                      ) : (
                        <Badge
                          variant={mr.status === "DECLINED" ? "muted" : "warning"}
                        >
                          {mr.status === "PENDING" ? "Pending" : "Declined"}
                        </Badge>
                      )}
                    </div>
                    {mr.status === "ACCEPTED" && mr.mentor.contactEmail && (
                      <a
                        href={getCoffeeChatEmailTemplate(
                          mr.mentor.name,
                          mr.mentor.contactEmail,
                          request.title
                        )}
                        className="shrink-0"
                      >
                        <Button variant="primary">Email to schedule</Button>
                      </a>
                    )}
                  </li>
                )
              )}
            </ul>
          )}
        </Section>
      </main>
    </div>
  );
}
