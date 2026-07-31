import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");

  // --- Admin user ---
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email,
      name: process.env.ADMIN_NAME ?? "Site Admin",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`👤 Admin user ready: ${email}`);

  // --- Profile (singleton) ---
  await prisma.profile.deleteMany();
  const profile = await prisma.profile.create({
    data: {
      fullName: "Jordan Rivera",
      headline: "Senior Software Engineer",
      tagline:
        "I build fast, accessible, and maintainable products — from clean APIs to polished front-ends.",
      bio: `I'm a software engineer with 8+ years of experience building web applications and distributed systems.\nI care deeply about developer experience, performance, and shipping products that people love to use.\nMost recently I've focused on TypeScript, Next.js, and cloud-native architectures — but I enjoy picking the right tool for the job.\nOutside of work you'll find me contributing to open source, mentoring, and writing about engineering.`,
      location: "Berlin, Germany",
      email: "hello@jordanrivera.dev",
      phone: "",
      availableForWork: true,
      resumeUrl: "",
      avatarUrl: "",
      socialLinks: {
        create: [
          { label: "GitHub", url: "https://github.com", icon: "github", order: 0 },
          { label: "LinkedIn", url: "https://linkedin.com", icon: "linkedin", order: 1 },
          { label: "X / Twitter", url: "https://x.com", icon: "twitter", order: 2 },
          { label: "Email", url: "mailto:hello@jordanrivera.dev", icon: "email", order: 3 },
        ],
      },
    },
  });
  console.log(`🪪 Profile: ${profile.fullName}`);

  // --- Experience ---
  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        company: "Nimbus Cloud",
        role: "Senior Software Engineer",
        location: "Berlin (Hybrid)",
        employmentType: "Full-time",
        startDate: new Date("2022-03-01"),
        current: true,
        description:
          "Lead engineer on the platform team building developer tooling and internal APIs used by 200+ engineers.",
        highlights: JSON.stringify([
          "Cut CI pipeline times by 45% by introducing incremental builds and caching.",
          "Designed a multi-tenant billing service handling €10M+ ARR.",
          "Mentored 4 engineers; ran the team's technical interview process.",
        ]),
        companyUrl: "https://example.com",
        order: 0,
      },
      {
        company: "Bright Labs",
        role: "Software Engineer",
        location: "Remote",
        employmentType: "Full-time",
        startDate: new Date("2019-06-01"),
        endDate: new Date("2022-02-01"),
        description:
          "Built customer-facing features for a SaaS analytics product using React, Node.js, and PostgreSQL.",
        highlights: JSON.stringify([
          "Shipped a real-time dashboard used by 30k+ daily users.",
          "Introduced end-to-end testing, reducing production incidents by 60%.",
        ]),
        order: 1,
      },
      {
        company: "Pixel & Co.",
        role: "Junior Developer",
        location: "Munich",
        employmentType: "Full-time",
        startDate: new Date("2017-01-01"),
        endDate: new Date("2019-05-01"),
        description:
          "Developed and maintained client websites and e-commerce platforms.",
        highlights: JSON.stringify([
          "Delivered 20+ client projects on time.",
          "Improved average Lighthouse scores from 60 to 95.",
        ]),
        order: 2,
      },
    ],
  });
  console.log("💼 Experience seeded");

  // --- Projects ---
  await prisma.project.deleteMany();
  const projects = [
    {
      slug: "devflow-ci",
      title: "DevFlow CI",
      summary: "A self-hosted CI/CD platform with incremental builds and smart caching.",
      description:
        "DevFlow CI is a continuous integration platform designed for monorepos.\nIt uses a dependency graph to only rebuild what changed, and a distributed cache to share artifacts across runs.\nThe result is dramatically faster pipelines and lower compute costs.",
      category: "DevOps",
      technologies: JSON.stringify(["TypeScript", "Node.js", "Go", "Redis", "Docker", "Kubernetes"]),
      liveUrl: "https://example.com",
      repoUrl: "https://github.com",
      outcome: "Reduced average build times by 45% across 200+ repositories and saved ~€120k/year in CI compute.",
      featured: true,
      published: true,
      order: 0,
    },
    {
      slug: "atlas-design-system",
      title: "Atlas Design System",
      summary: "An accessible, themeable React component library with 60+ components.",
      description:
        "Atlas is a design system built with React, TypeScript and Tailwind.\nEvery component is fully accessible (WCAG 2.1 AA), tree-shakeable, and documented with live examples.\nIt powers the entire product suite at Nimbus Cloud.",
      category: "Web",
      technologies: JSON.stringify(["React", "TypeScript", "Tailwind CSS", "Storybook", "Radix UI"]),
      repoUrl: "https://github.com",
      outcome: "Adopted by 12 product teams; reduced UI bug reports by 40%.",
      featured: true,
      published: true,
      order: 1,
    },
    {
      slug: "quantum-notes",
      title: "Quantum Notes",
      summary: "A local-first, end-to-end encrypted note-taking app.",
      description:
        "Quantum Notes is a local-first note app with CRDT-based sync and end-to-end encryption.\nNotes are stored offline and sync seamlessly across devices without a central server ever seeing plaintext.",
      category: "Web",
      technologies: JSON.stringify(["Next.js", "TypeScript", "IndexedDB", "CRDT", "WebCrypto"]),
      liveUrl: "https://example.com",
      repoUrl: "https://github.com",
      outcome: "Featured on a popular developer newsletter; 3k+ GitHub stars.",
      featured: true,
      published: true,
      order: 2,
    },
    {
      slug: "openapi-forge",
      title: "OpenAPI Forge",
      summary: "Generate type-safe API clients from OpenAPI specs.",
      description:
        "A CLI and library that generates fully type-safe TypeScript clients from OpenAPI 3 specifications, with runtime validation via Zod.",
      category: "Open Source",
      technologies: JSON.stringify(["TypeScript", "Zod", "Node.js"]),
      repoUrl: "https://github.com",
      outcome: "1.2k weekly npm downloads.",
      featured: false,
      published: true,
      order: 3,
    },
  ];
  for (const p of projects) {
    await prisma.project.create({ data: p });
  }
  console.log("🚀 Projects seeded");

  // --- Skills ---
  await prisma.skill.deleteMany();
  const skills: [string, string, number][] = [
    ["TypeScript", "Languages", 5],
    ["JavaScript", "Languages", 5],
    ["Go", "Languages", 3],
    ["Python", "Languages", 4],
    ["SQL", "Languages", 4],
    ["React", "Frameworks", 5],
    ["Next.js", "Frameworks", 5],
    ["Node.js", "Frameworks", 5],
    ["Express", "Frameworks", 4],
    ["Tailwind CSS", "Frameworks", 5],
    ["PostgreSQL", "Databases", 4],
    ["Redis", "Databases", 4],
    ["MongoDB", "Databases", 3],
    ["Prisma", "Databases", 5],
    ["Docker", "Cloud & DevOps", 4],
    ["Kubernetes", "Cloud & DevOps", 3],
    ["AWS", "Cloud & DevOps", 4],
    ["GitHub Actions", "Cloud & DevOps", 4],
    ["Jest", "Tools", 4],
    ["Playwright", "Tools", 4],
    ["Figma", "Tools", 3],
  ];
  await prisma.skill.createMany({
    data: skills.map(([name, category, level], i) => ({ name, category, level, order: i })),
  });
  console.log("🛠️  Skills seeded");

  // --- Education ---
  await prisma.education.deleteMany();
  await prisma.education.create({
    data: {
      institution: "Technical University of Munich",
      degree: "B.Sc.",
      field: "Computer Science",
      startDate: new Date("2013-10-01"),
      endDate: new Date("2016-09-01"),
      description: "Focus on distributed systems and human–computer interaction. Graduated with honors.",
      order: 0,
    },
  });
  console.log("🎓 Education seeded");

  // --- Certifications ---
  await prisma.certification.deleteMany();
  await prisma.certification.createMany({
    data: [
      {
        name: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        issueDate: new Date("2023-04-01"),
        credentialUrl: "https://example.com",
        order: 0,
      },
      {
        name: "Certified Kubernetes Application Developer (CKAD)",
        issuer: "Cloud Native Computing Foundation",
        issueDate: new Date("2022-08-01"),
        credentialUrl: "https://example.com",
        order: 1,
      },
    ],
  });
  console.log("📜 Certifications seeded");

  // --- Testimonials ---
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        author: "Sam Chen",
        role: "Engineering Manager",
        company: "Nimbus Cloud",
        quote:
          "Jordan is the engineer you want on your hardest problems. Thoughtful, fast, and a fantastic mentor to the team.",
        published: true,
        order: 0,
      },
      {
        author: "Priya Nair",
        role: "Product Designer",
        company: "Bright Labs",
        quote:
          "A rare engineer who truly cares about UX. Our collaboration shipped features users genuinely loved.",
        published: true,
        order: 1,
      },
    ],
  });
  console.log("💬 Testimonials seeded");

  // --- Sample contact message ---
  await prisma.contactMessage.deleteMany();
  await prisma.contactMessage.create({
    data: {
      name: "Alex Morgan",
      email: "alex@example.com",
      subject: "Freelance opportunity",
      message: "Hi Jordan, we're building a new product and would love your help. Do you have availability next month?",
      status: "UNREAD",
    },
  });
  console.log("✉️  Sample message seeded");

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
