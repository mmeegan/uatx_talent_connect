import { prisma } from "./prisma";
import { parseJsonArray } from "@/types";
import type { Availability } from "@prisma/client";

const AVAILABILITY_WEIGHT: Record<Availability, number> = {
  NONE: 0,
  LOW: 0.5,
  MEDIUM: 1,
  HIGH: 1.2,
};

/** Tag-based compatibility score (0–1). Overlap of request tags + mentor topics/industry. */
function tagScore(
  requestTags: string[],
  mentorTopics: string[],
  mentorIndustry: string[]
): number {
  const reqSet = new Set(requestTags.map((t) => t.toLowerCase().trim()));
  const topicSet = new Set(mentorTopics.map((t) => t.toLowerCase().trim()));
  const industrySet = new Set(mentorIndustry.map((t) => t.toLowerCase().trim()));
  if (reqSet.size === 0 && topicSet.size === 0 && industrySet.size === 0) return 0.5;
  let matches = 0;
  for (const t of reqSet) {
    if (topicSet.has(t) || industrySet.has(t)) matches++;
  }
  for (const t of topicSet) {
    if (reqSet.has(t)) matches++;
  }
  const total = reqSet.size + topicSet.size + industrySet.size;
  return total === 0 ? 0.5 : Math.min(1, (matches * 0.5) / Math.max(1, total * 0.3));
}

/** Rank mentors for a help request. Uses tag overlap; availability and load adjust score. */
export async function rankMentorsForRequest(
  requestId: string,
  requestTags: string[]
): Promise<
  Array<{
    mentorId: string;
    name: string;
    headline: string;
    bio: string;
    topics: string[];
    industryTags: string[];
    availability: Availability;
    contactEmail: string;
    score: number;
    activeConnections: number;
  }>
> {
  const alreadySent = await prisma.mentorRequest.findMany({
    where: { helpRequestId: requestId },
    select: { mentorId: true },
  });
  const excludedMentorIds = new Set(alreadySent.map((r) => r.mentorId));

  const mentors = await prisma.mentorProfile.findMany({
    where: { availability: { not: "NONE" } },
    include: {
      _count: { select: { requests: true } },
    },
  });

  const scored = mentors
    .filter((m) => !excludedMentorIds.has(m.id))
    .map((m) => {
      const topics = parseJsonArray(m.topics);
      const industryTags = parseJsonArray(m.industryTags);
      const base = tagScore(requestTags, topics, industryTags);
      const avail = AVAILABILITY_WEIGHT[m.availability] ?? 1;
      const activeConnections = m._count.requests;
      const loadPenalty = Math.max(0.7, 1 - activeConnections * 0.05);
      const score = base * avail * loadPenalty;
      return {
        mentorId: m.id,
        name: m.name,
        headline: m.headline,
        bio: m.bio,
        topics,
        industryTags,
        availability: m.availability,
        contactEmail: m.contactEmail,
        score,
        activeConnections,
      };
    })
    .sort((a, b) => b.score - a.score);

  return scored;
}
