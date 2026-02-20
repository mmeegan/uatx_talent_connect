import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const codes = await prisma.inviteCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    codes.map((c) => ({
      id: c.id,
      code: c.code,
      used: c.used,
      usedAt: c.usedAt,
      createdAt: c.createdAt,
    }))
  );
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const code = (body.code as string)?.trim()?.toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  const existing = await prisma.inviteCode.findUnique({ where: { code } });
  if (existing) {
    return NextResponse.json({ error: "That invite code already exists" }, { status: 400 });
  }

  const created = await prisma.inviteCode.create({
    data: { code },
  });

  return NextResponse.json({
    id: created.id,
    code: created.code,
    used: created.used,
    usedAt: created.usedAt,
    createdAt: created.createdAt,
  });
}
