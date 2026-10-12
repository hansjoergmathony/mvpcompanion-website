# MVPCompanion Website

Public website for the MVPCompanion ecosystem.

## Brand

> Turn Ideas into Meaningful Products.

MVPCompanion is a systematic method for turning app ideas into valuable, viable and buildable MVPs.

The website is the public discovery and communication layer of the MVPCompanion ecosystem.

## Private Neon draft storage

Private, cross-browser draft storage is available only to the signed-in Google
admin. Public visitors continue to use browser-local drafts only.

1. Create a Neon Postgres project, or connect Neon through the Vercel
   Marketplace integration for this project.
2. In the Neon SQL Editor, run
   [`db/migrations/001_admin_draft_storage.sql`](db/migrations/001_admin_draft_storage.sql).
3. Add the Neon connection string as the **Production** server-side Vercel
   variable `DATABASE_URL`. Do not prefix it with `NEXT_PUBLIC_` and never put
   it in a client-side file.
4. Trigger a new Vercel deployment. Environment-variable changes apply only to
   new deployments.
5. Sign in through `/admin`. Under **My Ideas**, choose **Upload local drafts**
   once to create the initial private cloud copy.

The application stores one private idea library for `MVP_ADMIN_EMAIL` and keeps
the latest 20 server-side revisions. If a browser and cloud version differ on
first use, MVPCompanion asks which version to retain; it never overwrites one
silently. Browser-local recovery copies and JSON export remain available.

---

## Ecosystem

MVPCompanion consists of three primary public experiences:

| Experience | Role |
|---|---|
| Method | The underlying way of thinking |
| Book | Understand |
| Website | Explore |
| App | Do |

The website and future app are separate applications but share the same underlying method and brand language.

---

## Current Version

**Website v0.1**

The current objective is a clean, minimal homepage that:

1. explains MVPCompanion,
2. introduces the methodology,
3. presents the framework,
4. explains the process,
5. introduces the ecosystem,
6. provides a clear first CTA.

---

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Vercel

Keep dependencies minimal.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Private AI-feedback pilot

The public site presents an AI-feedback beta survey. Real OpenAI feedback is
available only after private Google sign-in and only to the email address in
`MVP_ADMIN_EMAIL`. Configure these **Vercel server-side environment variables**
before activating the pilot:

```text
OPENAI_API_KEY
MVP_ADMIN_EMAIL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
MVP_ADMIN_OAUTH_REDIRECT_URI=https://www.mvpcompanion.com/api/admin/auth/callback
MVP_ADMIN_SESSION_SECRET
MVP_ADMIN_AI_REQUESTS_PER_MINUTE=6
```

Create a Google OAuth web client with the same redirect URI. The private sign-in
entry point is `/admin`; a successful sign-in creates an eight-hour, HTTP-only
session. Until every required variable is configured, real AI feedback stays
disabled for everyone.

---

## Folder Structure

```text
app/                  App Router entry (layout, homepage, styles)
components/
  layout/             Header, Footer
  sections/           Homepage sections
  ui/                 Shared layout and UI primitives
content/              Site copy and MVPCompanion process data
public/               Static assets
```
