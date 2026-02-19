import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_MENTORS_PER_REQUEST = 3;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: helpRequestId } = await params;
  const body = await request.json();
  const { mentorIds } = body as { mentorIds: string[] };
  if (!Array.isArray(mentorIds) || mentorIds.length === 0 || mentorIds.length > MAX_MENTORS_PER_REQUEST) {
    return NextResponse.json(
      { error: `Send to 1–${MAX_MENTORS_PER_REQUEST} mentors` },
      { status: 400 }
    );
  }

  const helpRequest = await prisma.helpRequest.findUnique({
    where: { id: helpRequestId },
    include: { student: { include: { user: true } } },
  });
  if (!helpRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (helpRequest.student.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.mentorRequest.findMany({
    where: { helpRequestId },
    select: { mentorId: true },
  });
  const existingSet = new Set(existing.map((r) => r.mentorId));
  const toAdd = mentorIds.filter((mid) => !existingSet.has(mid));
  if (toAdd.length + existing.length > MAX_MENTORS_PER_REQUEST) {
    return NextResponse.json(
      { error: `You may send this request to at most ${MAX_MENTORS_PER_REQUEST} mentors total` },
      { status: 400 }
    );
  }

  const mentors = await prisma.mentorProfile.findMany({
    where: { id: { in: toAdd } },
  });
  if (mentors.length !== toAdd.length) {
    return NextResponse.json({ error: "One or more mentor IDs invalid" }, { status: 400 });
  }

  await prisma.mentorRequest.createMany({
    data: toAdd.map((mentorId) => ({
      helpRequestId,
      mentorId,
      status: "PENDING",
    })),
  });

  return NextResponse.json({ ok: true });
}
