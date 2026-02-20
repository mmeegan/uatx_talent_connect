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
    <div className="min-h-screen bg-[#0B0F14]">
      <DashboardNav mainHref="/dashboard/student" mainLabel="Requests" />

      <main className="mx-auto w-full max-w-[1100px] px-6 py-8 lg:px-8">
        <Link href="/dashboard/student" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-200">
          ← Back to dashboard
        </Link>
        <Card className="mt-6">
          <h1 className="font-display text-xl font-semibold tracking-tight text-zinc-100">
            {request.title}
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">{request.description}</p>
          {request.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {request.tags.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full border border-zinc-700 bg-zinc-800/50 px-2.5 py-0.5 text-xs text-zinc-400"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </Card>

        <Section title="Mentor responses" className="mt-10">
          {!request.mentorRequests?.length ? (
            <p className="py-6 text-center text-sm text-zinc-500">
              Your request has been sent to mentors. Status will update here when they respond.
            </p>
          ) : (
            <ul className="space-y-3" role="list">
              {request.mentorRequests.map(
                (mr: {
                  id: string;
                  status: string;
                  mentor: { name: string; headline: string; contactEmail?: string };
                }) => (
                  <li
                    key={mr.id}
                    className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4"
                  >
                    <div>
                      <p className="font-medium text-zinc-100">{mr.mentor.name}</p>
                      <p className="text-sm text-zinc-500">{mr.mentor.headline}</p>
                      <Badge
                        variant={
                          mr.status === "ACCEPTED"
                            ? "success"
                            : mr.status === "DECLINED"
                            ? "muted"
                            : "warning"
                        }
                        className="mt-2"
                      >
                        {mr.status}
                      </Badge>
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
