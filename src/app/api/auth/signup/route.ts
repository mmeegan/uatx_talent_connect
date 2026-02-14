import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import type { MentorProfilePayload, StudentProfilePayload } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role, inviteCode, profile } = body as {
      email: string;
      password: string;
      role: "STUDENT" | "MENTOR";
      inviteCode?: string;
      profile: StudentProfilePayload | MentorProfilePayload;
    };

    if (!email?.trim() || !password || !role || !profile) {
      return NextResponse.json(
        { error: "Missing email, password, role, or profile" },
        { status: 400 }
      );
    }

    if (role === "MENTOR") {
      if (!inviteCode?.trim()) {
        return NextResponse.json(
          { error: "Mentors must provide an invite code" },
          { status: 400 }
        );
      }
      const code = await prisma.inviteCode.findUnique({
        where: { code: inviteCode.trim(), used: false },
      });
      if (!code) {
        return NextResponse.json(
          { error: "Invalid or already used invite code" },
          { status: 400 }
        );
      }
    }

    const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashed,
        role,
      },
    });

    if (role === "STUDENT") {
      const p = profile as StudentProfilePayload;
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          name: p.name?.trim() || "Student",
          tags: JSON.stringify(p.tags || []),
        },
      });
    } else {
      const p = profile as MentorProfilePayload;
      await prisma.mentorProfile.create({
        data: {
          userId: user.id,
          name: p.name?.trim() || "Mentor",
          headline: p.headline?.trim() || "",
          bio: p.bio?.trim() || "",
          topics: JSON.stringify(p.topics || []),
          industryTags: JSON.stringify(p.industryTags || []),
          availability: p.availability || "MEDIUM",
          contactEmail: p.contactEmail?.trim() || email,
        },
      });
      await prisma.inviteCode.update({
        where: { id: code.id },
        data: { used: true, usedAt: new Date() },
      });
    }

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
