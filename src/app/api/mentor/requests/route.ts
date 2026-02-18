import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mentor = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!mentor) {
    return NextResponse.json({ error: "Mentor profile required" }, { status: 403 });
  }

  const list = await prisma.mentorRequest.findMany({
    where: { mentorId: mentor.id },
    orderBy: { createdAt: "desc" },
    include: {
      helpRequest: {
        include: { student: { include: { user: { select: { email: true } } } } },
      },
    },
  });

  return NextResponse.json(
    list.map((r) => ({
      id: r.id,
      status: r.status,
      createdAt: r.createdAt,
      helpRequest: {
        id: r.helpRequest.id,
        title: r.helpRequest.title,
        description: r.helpRequest.description,
        tags: JSON.parse(r.helpRequest.tags || "[]"),
        studentName: r.helpRequest.student.name,
        studentEmail: r.helpRequest.student.user.email,
      },
    }))
  );
}
