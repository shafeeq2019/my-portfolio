import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(100),
  email: z.string().email("Enter a valid email address.").max(200),
  subject: z.string().min(3, "Subject is too short.").max(150),
  message: z.string().min(10, "Message must be at least 10 characters.").max(5000),
  // Honeypot — must stay empty. Bots tend to fill every field.
  company: z.string().max(0).optional().or(z.literal("")),
  // Cloudflare Turnstile token (optional).
  token: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

const listString = z
  .array(z.string().min(1))
  .transform((arr) => JSON.stringify(arr));

export const projectSchema = z.object({
  title: z.string().min(2).max(160),
  slug: z.string().min(2).max(160).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only."),
  summary: z.string().min(5).max(300),
  description: z.string().min(10),
  category: z.string().min(2).max(60),
  technologies: listString,
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  outcome: z.string().max(2000).optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
});

export const experienceSchema = z.object({
  company: z.string().min(2).max(160),
  role: z.string().min(2).max(160),
  location: z.string().max(160).optional().or(z.literal("")),
  employmentType: z.string().max(60).optional().or(z.literal("")),
  startDate: z.string().min(1),
  endDate: z.string().optional().or(z.literal("")),
  current: z.boolean().default(false),
  description: z.string().min(5),
  highlights: z.array(z.string()).transform((a) => JSON.stringify(a)).optional(),
  companyUrl: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export const skillSchema = z.object({
  name: z.string().min(1).max(80),
  category: z.string().min(1).max(60),
  level: z.coerce.number().int().min(1).max(5).default(3),
  icon: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export const educationSchema = z.object({
  institution: z.string().min(2).max(160),
  degree: z.string().min(2).max(160),
  field: z.string().max(160).optional().or(z.literal("")),
  startDate: z.string().min(1),
  endDate: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export const certificationSchema = z.object({
  name: z.string().min(2).max(160),
  issuer: z.string().min(2).max(160),
  issueDate: z.string().min(1),
  expiryDate: z.string().optional().or(z.literal("")),
  credentialId: z.string().max(160).optional().or(z.literal("")),
  credentialUrl: z.string().url().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export const profileSchema = z.object({
  fullName: z.string().min(2).max(160),
  headline: z.string().min(2).max(200),
  tagline: z.string().max(300).optional().or(z.literal("")),
  bio: z.string().min(10),
  location: z.string().max(160).optional().or(z.literal("")),
  email: z.string().email(),
  phone: z.string().max(60).optional().or(z.literal("")),
  avatarUrl: z.string().optional().or(z.literal("")),
  resumeUrl: z.string().optional().or(z.literal("")),
  availableForWork: z.boolean().default(true),
});

export const socialLinkSchema = z.object({
  label: z.string().min(1).max(80),
  url: z.string().url(),
  icon: z.string().min(1).max(40),
  order: z.coerce.number().int().default(0),
});
