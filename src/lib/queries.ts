import { prisma } from "@/lib/prisma";
import { cache } from "react";

/** Fetch the singleton profile (with social links). Cached per request. */
export const getProfile = cache(async () => {
  return prisma.profile.findFirst({
    include: { socialLinks: { orderBy: { order: "asc" } } },
  });
});

export const getPublishedProjects = cache(async () => {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    include: { images: { orderBy: { order: "asc" } } },
  });
});

export const getFeaturedProjects = cache(async () => {
  return prisma.project.findMany({
    where: { published: true, featured: true },
    orderBy: { order: "asc" },
    take: 3,
    include: { images: { orderBy: { order: "asc" } } },
  });
});

export const getProjectBySlug = cache(async (slug: string) => {
  return prisma.project.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } } },
  });
});

export const getExperience = cache(async () => {
  return prisma.experience.findMany({
    where: { published: true },
    orderBy: [{ current: "desc" }, { startDate: "desc" }],
  });
});

export const getSkills = cache(async () => {
  return prisma.skill.findMany({
    where: { published: true },
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
});

export const getEducation = cache(async () => {
  return prisma.education.findMany({
    where: { published: true },
    orderBy: { startDate: "desc" },
  });
});

export const getCertifications = cache(async () => {
  return prisma.certification.findMany({
    where: { published: true },
    orderBy: { issueDate: "desc" },
  });
});

export const getTestimonials = cache(async () => {
  return prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
});
