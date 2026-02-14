import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id: requestId } = await params;
  const body = await request.json();
  const { action } = body as { action: "accept" | "decline" };
  if (action !== "accept" && action !== "decline") {
    return NextResponse.json({ error: "Action must be accept or decline" }, { status: 400 });
  }

  const mentorRequest = await prisma.mentorRequest.findFirst({
    where: { id: requestId, mentorId: mentor.id, status: "PENDING" },
    include: { helpRequest: true },
  });
  if (!mentorRequest) {
    return NextResponse.json({ error: "Request not found or already responded" }, { status: 404 });
  }

  await prisma.mentorRequest.update({
    where: { id: requestId },
    data: { status: action === "accept" ? "ACCEPTED" : "DECLINED" },
  });

  return NextResponse.json({
    ok: true,
    status: action === "accept" ? "ACCEPTED" : "DECLINED",
  });
}
