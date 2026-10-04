# Software Engineer Portfolio

A polished, modern, responsive portfolio website for a software engineer, built with
**Next.js (App Router) + TypeScript**. It ships with a public marketing site, a
spam-protected contact form with email notifications, and a secure, code-free admin
dashboard to manage every piece of content.

---

## ✨ Features

**Public site**
- Hero / landing page with strong intro, availability badge and CTAs
- About page (bio, personal brand, education, certifications & awards)
- Experience timeline
- Projects portfolio with **filtering by category and technology**
- Project detail pages (screenshots, tech, links, outcomes)
- Skills page grouped by category with proficiency bars
- Résumé page (inline + downloadable PDF)
- Contact page with a validated, spam-protected form
- Optional testimonials section
- Dark mode, mobile-first, accessible, SEO-friendly

**Contact flow**
- Server-side validation (Zod)
- Honeypot + IP rate limiting + optional Cloudflare Turnstile CAPTCHA
- Stored in the database (PII minimised — IPs are hashed)
- Email notification via Resend (falls back to console logging in dev)
- Clear success / error states

**Admin dashboard** (`/admin`)
- Secure credentials login (Auth.js v5) with role-based access
- Projects: create, edit, publish/unpublish, reorder, delete, upload cover image
- Experience, Skills, Education, Certifications: full CRUD
- Profile: bio, brand, photo & résumé uploads, social links
- Messages: search, filter, mark read/unread, archive, reply (mailto), delete
- Draft/published states, sensible empty states

**Engineering**
- Prisma ORM (SQLite in dev, Postgres in prod)
- Secure server actions for every mutation
- SEO metadata, Open Graph, dynamic OG image, `sitemap.xml`, `robots.txt`
- Optional Plausible analytics
- Image optimization via `next/image`

---

## 🧱 Tech Stack

| Concern         | Choice                                   |
| --------------- | ---------------------------------------- |
| Framework       | Next.js 16 (App Router) + TypeScript     |
| Styling         | Tailwind CSS v4 + custom design tokens   |
| Database / ORM  | Prisma (SQLite dev / Postgres prod)      |
| Auth            | Auth.js (NextAuth v5), credentials + JWT |
| Validation      | Zod (shared client + server)             |
| Email           | Resend                                   |
| Spam protection | Honeypot + rate limiting + Turnstile     |
| Analytics       | Plausible (optional)                     |

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Then edit `.env` (see the variable reference below). At minimum set a strong
`AUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Set up the database & seed sample content
```bash
npm run db:push   # create tables from the Prisma schema
npm run db:seed   # seed profile, projects, skills, admin user, etc.
```

### 4. Run the dev server
```bash
npm run dev
```
Visit http://localhost:3000. Admin dashboard at http://localhost:3000/admin.

**Default admin login** (from `.env`):
- Email: `admin@example.com`
- Password: `ChangeMe123!`

> Change these before deploying — re-run `npm run db:seed` after editing
> `ADMIN_EMAIL` / `ADMIN_PASSWORD`, or update the password from the DB.

---

## 🔐 Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Prisma connection string. Dev: `file:./dev.db`. Prod: Postgres URL. |
| `AUTH_SECRET` | ✅ | Secret for signing sessions. Generate with `openssl rand -base64 32`. |
| `AUTH_URL` | prod | Canonical site URL used for auth callbacks. |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public site URL for metadata, sitemap & OG tags. |
| `ADMIN_EMAIL` | seed | Admin email created by the seed script. |
| `ADMIN_PASSWORD` | seed | Admin password created by the seed script. |
| `ADMIN_NAME` | seed | Admin display name. |
| `RESEND_API_KEY` | optional | Resend API key. If unset, emails are logged to the console. |
| `CONTACT_NOTIFY_EMAIL` | optional | Where new contact-message notifications are sent. |
| `CONTACT_FROM_EMAIL` | optional | Verified sender, e.g. `Portfolio <hello@yourdomain.com>`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | optional | Cloudflare Turnstile site key (enables CAPTCHA). |
| `TURNSTILE_SECRET_KEY` | optional | Cloudflare Turnstile secret key. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | optional | Plausible domain to enable analytics. |

All optional integrations degrade gracefully — the app runs fully without Resend,
Turnstile or Plausible configured.

---

## 📜 Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (runs `prisma generate`) |
| `npm run start` | Start the production server |
| `npm run db:push` | Sync schema to the database |
| `npm run db:migrate` | Create a migration (dev) |
| `npm run db:seed` | Seed sample content + admin user |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset the database and re-seed |
| `npm run lint` | Lint |

---

## 🗂️ Project Structure

```
prisma/
  schema.prisma        # data model
  seed.ts              # sample content + admin user
src/
  auth.ts              # Auth.js configuration
  middleware.ts        # protects /admin routes
  app/
    (site)/            # public pages (hero, about, projects, contact, …)
    admin/
      login/           # login page (outside the dashboard shell)
      (dashboard)/     # protected admin CRUD pages
    api/
      auth/            # Auth.js route handler
      admin/upload/    # authenticated file upload endpoint
    sitemap.ts, robots.ts, opengraph-image.tsx
  components/
    ui/                # design-system primitives (button, card, input, badge)
    admin/             # admin forms, tables, uploaders
    ...                # navbar, footer, project card, contact form, …
  lib/
    prisma.ts, auth helpers, validations (zod), email, rate-limit,
    turnstile, upload, queries, utils
```

---

## 🛡️ Contact Message Flow

1. Visitor submits the form → client-side `useActionState`.
2. **Server action** (`submitContact`) validates with Zod.
3. **Honeypot** field checked (bots that fill it are silently accepted).
4. **Rate limit**: max 5 messages / 10 min per hashed IP.
5. **Turnstile** verified server-side (skipped if not configured).
6. Message persisted to `ContactMessage` (IP is **hashed**, never stored raw).
7. **Email notification** sent via Resend (best-effort; failures don't block).
8. Success / error state rendered inline.

**Privacy:** only name, email, subject and message are stored, plus a hashed IP and
truncated user-agent for abuse mitigation. No third-party trackers touch message content.

---

## 🚢 Deployment

### Recommended: Vercel + hosted Postgres

1. Push the repo to GitHub.
2. Change the Prisma datasource provider to `postgresql` in `prisma/schema.prisma`.
3. Provision Postgres (Vercel Postgres, Neon, Supabase, …) and set `DATABASE_URL`.
4. Set all required env vars in the Vercel dashboard.
5. Run migrations against prod: `npx prisma migrate deploy` (or `db push`).
6. Seed once: `npm run db:seed` (or create your admin user manually).
7. Deploy. `npm run build` runs `prisma generate` automatically.

> **File uploads:** local disk (`/public/uploads`) works on a VPS/long-running
> server but **not** on serverless (Vercel) where the filesystem is ephemeral.
> For serverless, swap `src/lib/upload.ts` for Vercel Blob, S3, or UploadThing —
> the `saveUpload()` signature can stay the same.

### Alternative: any Node host (Railway, Render, Fly, a VPS)
Local disk uploads work out of the box. Set env vars, run `db:push`/`db:seed`,
then `npm run build && npm run start`.

---

## ♿ Accessibility & Performance
- Semantic HTML, labelled form fields, visible focus rings, ARIA live regions
- Keyboard-navigable nav, admin and forms
- `next/image` optimization, system-font stack, minimal JS on public pages
- Dark mode respects system preference (`next-themes`)

---

## 📝 Customising Content
Everything is editable from the admin dashboard — no code changes needed:
- **Profile** → your name, headline, bio, photo, résumé, social links
- **Projects / Experience / Skills / Education / Certifications** → full CRUD
- **Messages** → manage incoming contact submissions

Start by signing in at `/admin`, updating your **Profile**, then replacing the seeded
sample projects and experience with your own.
"# my-portfolio" 
