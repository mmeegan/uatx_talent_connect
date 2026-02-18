import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rankMentorsForRequest } from "@/lib/matching";

const MAX_MENTORS_AUTO_SEND = 3;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true },
  });
  if (!user?.studentProfile) {
    return NextResponse.json({ error: "Student profile required" }, { status: 403 });
  }

  const list = await prisma.helpRequest.findMany({
    where: { studentId: user.studentProfile.id },
    orderBy: { createdAt: "desc" },
    include: {
      mentorRequests: {
        include: {
          mentor: true,
        },
      },
    },
  });

  return NextResponse.json(
    list.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      tags: JSON.parse(r.tags || "[]"),
      createdAt: r.createdAt,
      mentorRequests: r.mentorRequests.map((mr) => ({
        id: mr.id,
        status: mr.status,
        mentorName: mr.mentor.name,
        mentorHeadline: mr.mentor.headline,
        contactEmail: mr.status === "ACCEPTED" ? mr.mentor.contactEmail : undefined,
      })),
    }))
  );
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true },
  });
  if (!user?.studentProfile) {
    return NextResponse.json({ error: "Student profile required" }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, tags } = body;
  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const helpRequest = await prisma.helpRequest.create({
    data: {
      studentId: user.studentProfile.id,
      title: title.trim(),
      description: (description ?? "").trim(),
      tags: JSON.stringify(Array.isArray(tags) ? tags : []),
    },
  });

  const requestTags = Array.isArray(tags) ? tags : [];
  const ranked = await rankMentorsForRequest(helpRequest.id, requestTags);
  const topMentors = ranked.slice(0, MAX_MENTORS_AUTO_SEND);
  if (topMentors.length > 0) {
    await prisma.mentorRequest.createMany({
      data: topMentors.map((m) => ({
        helpRequestId: helpRequest.id,
        mentorId: m.mentorId,
        status: "PENDING",
      })),
    });
  }

  return NextResponse.json({
    id: helpRequest.id,
    title: helpRequest.title,
    description: helpRequest.description,
    tags: JSON.parse(helpRequest.tags || "[]"),
    createdAt: helpRequest.createdAt,
  });
}
