import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { MentorProfilePayload, StudentProfilePayload } from "@/types";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true, mentorProfile: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.role === "STUDENT" && user.studentProfile) {
    const p = body as Partial<StudentProfilePayload>;
    await prisma.studentProfile.update({
      where: { id: user.studentProfile.id },
      data: {
        ...(p.name != null && { name: p.name }),
        ...(p.tags != null && { tags: JSON.stringify(p.tags) }),
      },
    });
  } else if (user.role === "MENTOR" && user.mentorProfile) {
    const p = body as Partial<MentorProfilePayload>;
    await prisma.mentorProfile.update({
      where: { id: user.mentorProfile.id },
      data: {
        ...(p.name != null && { name: p.name }),
        ...(p.headline != null && { headline: p.headline }),
        ...(p.bio != null && { bio: p.bio }),
        ...(p.topics != null && { topics: JSON.stringify(p.topics) }),
        ...(p.industryTags != null && { industryTags: JSON.stringify(p.industryTags) }),
        ...(p.availability != null && { availability: p.availability }),
        ...(p.contactEmail != null && { contactEmail: p.contactEmail }),
      },
    });
  }

  return NextResponse.json({ ok: true });
}
