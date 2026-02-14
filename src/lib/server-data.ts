import { prisma } from "./prisma";
import type { Session } from "next-auth";

export async function getStudentHelpRequests(session: Session | null) {
  if (!session?.user?.id) return [];
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true },
  });
  if (!user?.studentProfile) return [];
  const list = await prisma.helpRequest.findMany({
    where: { studentId: user.studentProfile.id },
    orderBy: { createdAt: "desc" },
    include: { mentorRequests: { include: { mentor: true } } },
  });
  return list.map((r) => ({
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
  }));
}

export async function getMentorIncomingRequests(session: Session | null) {
  if (!session?.user?.id) return [];
  const mentor = await prisma.mentorProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!mentor) return [];
  const list = await prisma.mentorRequest.findMany({
    where: { mentorId: mentor.id },
    orderBy: { createdAt: "desc" },
    include: {
      helpRequest: { include: { student: true } },
    },
  });
  return list.map((r) => ({
    id: r.id,
    status: r.status,
    createdAt: r.createdAt,
    helpRequest: {
      id: r.helpRequest.id,
      title: r.helpRequest.title,
      description: r.helpRequest.description,
      tags: JSON.parse(r.helpRequest.tags || "[]"),
      studentName: r.helpRequest.student.name,
    },
  }));
}

export async function getHelpRequestById(id: string, session: Session | null) {
  if (!session?.user?.id) return null;
  const helpRequest = await prisma.helpRequest.findUnique({
    where: { id },
    include: {
      student: true,
      mentorRequests: { include: { mentor: true } },
    },
  });
  if (!helpRequest) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true },
  });
  const isOwner =
    user?.studentProfile?.id === helpRequest.studentId ||
    helpRequest.mentorRequests.some((mr) => mr.mentor.userId === session.user?.id);
  if (!isOwner) return null;
  return {
    id: helpRequest.id,
    title: helpRequest.title,
    description: helpRequest.description,
    tags: JSON.parse(helpRequest.tags || "[]"),
    createdAt: helpRequest.createdAt,
    studentName: helpRequest.student.name,
    mentorRequests: helpRequest.mentorRequests.map((mr) => ({
      id: mr.id,
      status: mr.status,
      mentor: {
        id: mr.mentor.id,
        name: mr.mentor.name,
        headline: mr.mentor.headline,
        contactEmail: mr.status === "ACCEPTED" ? mr.mentor.contactEmail : undefined,
      },
    })),
  };
}
