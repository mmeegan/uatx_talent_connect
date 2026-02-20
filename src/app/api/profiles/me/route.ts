import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true, mentorProfile: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const profile = user.role === "STUDENT" ? user.studentProfile : user.mentorProfile;
  if (!profile) return NextResponse.json({ id: user.id, email: user.email, role: user.role, profile: null });

  const base: Record<string, unknown> = { ...profile };
  if ("tags" in profile) {
    base.tags = JSON.parse((profile as { tags: string }).tags || "[]");
  }
  if ("industryTags" in profile) {
    const raw = (profile as { industryTags?: string | null }).industryTags;
    base.industryTags = raw ? JSON.parse(raw) : [];
  }
  if ("topics" in profile) {
    base.topics = JSON.parse((profile as { topics: string }).topics || "[]");
  }
  if ("center" in profile) {
    const raw = (profile as { center?: string | null }).center;
    base.center = raw ? JSON.parse(raw) : [];
  }
  return NextResponse.json({ id: user.id, email: user.email, role: user.role, profile: base });
}
