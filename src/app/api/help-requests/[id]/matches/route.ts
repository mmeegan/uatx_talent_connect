import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rankMentorsForRequest } from "@/lib/matching";

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
    include: { student: { include: { user: true } } },
  });
  if (!helpRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (helpRequest.student.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const requestTags = JSON.parse(helpRequest.tags || "[]") as string[];
  const requestIndustryTags = JSON.parse(helpRequest.industryTags || "[]") as string[];
  const ranked = await rankMentorsForRequest(id, requestTags, requestIndustryTags);
  return NextResponse.json(ranked);
}
