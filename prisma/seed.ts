import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("password123", 12);

  // Admin user (no student/mentor profile)
  await prisma.user.upsert({
    where: { email: "admin@demo.bridge" },
    create: {
      email: "admin@demo.bridge",
      password: hashed,
      role: "ADMIN",
    },
    update: {},
  });

  // Invite codes for mentors
  await prisma.inviteCode.upsert({
    where: { code: "MENTOR2024" },
    create: { code: "MENTOR2024" },
    update: {},
  });
  await prisma.inviteCode.upsert({
    where: { code: "TALENT-BRIDGE" },
    create: { code: "TALENT-BRIDGE" },
    update: {},
  });

  // Demo student
  const studentUser = await prisma.user.upsert({
    where: { email: "student@demo.bridge" },
    create: {
      email: "student@demo.bridge",
      password: hashed,
      role: "STUDENT",
    },
    update: {},
  });
  await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    create: {
      userId: studentUser.id,
      name: "Alex Student",
      tags: JSON.stringify(["Career direction", "Starting a company"]),
      industryTags: JSON.stringify(["Technology", "Entrepreneurship"]),
    },
    update: {},
  });

  // Demo mentors
  const m1User = await prisma.user.upsert({
    where: { email: "mentor1@demo.bridge" },
    create: {
      email: "mentor1@demo.bridge",
      password: hashed,
      role: "MENTOR",
    },
    update: {},
  });
  const mentor1 = await prisma.mentorProfile.upsert({
    where: { userId: m1User.id },
    create: {
      userId: m1User.id,
      name: "Jordan Lee",
      headline: "Product Lead at a growth-stage startup",
      bio: "I've led product at two Series B companies and love helping people break into PM or level up their craft.",
      topics: JSON.stringify(["Career direction", "Leadership & management", "Starting a company"]),
      industryTags: JSON.stringify(["Technology", "Entrepreneurship"]),
      availability: "HIGH",
      contactEmail: "jordan.lee@example.com",
    },
    update: {},
  });

  const m2User = await prisma.user.upsert({
    where: { email: "mentor2@demo.bridge" },
    create: {
      email: "mentor2@demo.bridge",
      password: hashed,
      role: "MENTOR",
    },
    update: {},
  });
  await prisma.mentorProfile.upsert({
    where: { userId: m2User.id },
    create: {
      userId: m2User.id,
      name: "Sam Chen",
      headline: "Engineering manager, ex-FAANG",
      bio: "10+ years in software. Happy to chat about engineering leadership, system design, or switching into tech.",
      topics: JSON.stringify(["Technical & engineering", "Leadership & management", "Career direction"]),
      industryTags: JSON.stringify(["Technology", "Engineering & science"]),
      availability: "MEDIUM",
      contactEmail: "sam.chen@example.com",
    },
    update: {},
  });

  const m3User = await prisma.user.upsert({
    where: { email: "mentor3@demo.bridge" },
    create: {
      email: "mentor3@demo.bridge",
      password: hashed,
      role: "MENTOR",
    },
    update: {},
  });
  await prisma.mentorProfile.upsert({
    where: { userId: m3User.id },
    create: {
      userId: m3User.id,
      name: "Riley Morgan",
      headline: "Design lead & career coach",
      bio: "Product design and design systems. I mentor folks transitioning into design or exploring leadership.",
      topics: JSON.stringify(["Career direction", "Leadership & management", "Writing & rhetoric"]),
      industryTags: JSON.stringify(["Technology", "Media & journalism"]),
      availability: "LOW",
      contactEmail: "riley@example.com",
    },
    update: {},
  });

  // One demo help request from the student (so there's something to see)
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: studentUser.id },
  });
  if (studentProfile) {
    const existing = await prisma.helpRequest.findFirst({
      where: { studentId: studentProfile.id, title: "Breaking into product management from engineering" },
    });
    if (!existing) {
      const helpRequest = await prisma.helpRequest.create({
        data: {
          studentId: studentProfile.id,
          title: "Breaking into product management from engineering",
          description: "I'm a software engineer with 3 years of experience. I'd like to transition into a PM role and would love to hear how others made the switch.",
          tags: JSON.stringify(["Career direction", "Starting a company"]),
          industryTags: JSON.stringify(["Technology"]),
        },
      });
      await prisma.mentorRequest.create({
        data: {
          helpRequestId: helpRequest.id,
          mentorId: mentor1.id,
          status: "PENDING",
        },
      });
    }
  }

  console.log("Seed complete.");
  console.log("Demo accounts (password: password123):");
  console.log("  Student: student@demo.bridge");
  console.log("  Mentors: mentor1@demo.bridge, mentor2@demo.bridge, mentor3@demo.bridge");
  console.log("  Admin: admin@demo.bridge");
  console.log("  Mentor invite codes: MENTOR2024, TALENT-BRIDGE");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
