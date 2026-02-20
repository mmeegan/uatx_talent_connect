export type Availability = "NONE" | "LOW" | "MEDIUM" | "HIGH";
export type RequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface MentorProfilePayload {
  name: string;
  headline: string;
  bio: string;
  imageUrl?: string;
  topics: string[];
  industryTags: string[];
  availability: Availability;
  contactEmail: string;
}

export interface StudentProfilePayload {
  name: string;
  description?: string;
  imageUrl?: string;
  center?: string;
  tags: string[];
}

export interface HelpRequestPayload {
  title: string;
  description: string;
  tags?: string[];
}

export interface RankedMentor {
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
}

export function parseJsonArray(s: string | null | undefined): string[] {
  if (!s) return [];
  try {
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
