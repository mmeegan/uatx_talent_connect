import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: { role: { in: ["STUDENT", "MENTOR"] } },
    include: {
      studentProfile: true,
      mentorProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const students = users
    .filter((u) => u.role === "STUDENT" && u.studentProfile)
    .map((u) => ({
      id: u.id,
      email: u.email,
      createdAt: u.createdAt,
      name: (u.studentProfile as { name: string })?.name ?? "—",
    }));

  const mentors = users
    .filter((u) => u.role === "MENTOR" && u.mentorProfile)
    .map((u) => ({
      id: u.id,
      email: u.email,
      createdAt: u.createdAt,
      name: (u.mentorProfile as { name: string })?.name ?? "—",
      headline: (u.mentorProfile as { headline: string })?.headline ?? "—",
    }));

  return NextResponse.json({ students, mentors });
}
