import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const helpRequest = await prisma.helpRequest.findUnique({
    where: { id },
    include: {
      student: true,
      mentorRequests: { include: { mentor: true } },
    },
  });
  if (!helpRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true, mentorProfile: true },
  });
  const isOwner =
    user?.studentProfile?.id === helpRequest.studentId ||
    helpRequest.mentorRequests.some((mr) => mr.mentor.userId === session.user?.id);
  if (!isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    id: helpRequest.id,
    title: helpRequest.title,
    description: helpRequest.description,
    tags: JSON.parse(helpRequest.tags || "[]"),
    industryTags: JSON.parse(helpRequest.industryTags || "[]"),
    createdAt: helpRequest.createdAt,
    studentName: helpRequest.student.name,
    mentorRequests: helpRequest.mentorRequests.map((mr) => ({
      id: mr.id,
      status: mr.status,
      mentor: {
        id: mr.mentor.id,
        name: mr.mentor.name,
        headline: mr.mentor.headline,
        contactEmail: mr.status === "ACCEPTED" ? mr.mentor.contactEmail : undefined,
      },
    })),
  });
}
