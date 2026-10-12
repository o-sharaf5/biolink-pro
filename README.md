# BioLink Pro

**A link-in-bio SaaS** — Linktree-style profile pages with Stripe tips and first-party analytics. Sign up, claim a username, and your page is live at `/yourname`.

**Live demo: https://biolink-pro-ten.vercel.app**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square) ![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square)

## Features

- **Public profile pages** (`/[username]`) — bio, avatar, themed link list with ordering and active toggles
- **Tips via Stripe Checkout** — visitors "buy you a coffee" ($1–$999, optional name + message); webhook records the transaction
- **First-party analytics** — page views and per-link click events tracked server-side, with a dashboard of stats (no third-party trackers)
- **Clerk auth** — sign-in/sign-up, protected dashboard routes via middleware, user sync through webhooks
- **Zod-validated API** — every route input validated; graceful Stripe fallback when unconfigured

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript |
| Auth | Clerk (`@clerk/nextjs` v7) + webhook sync |
| Database | PostgreSQL (Supabase) + Prisma 6 |
| Payments | Stripe Checkout + webhooks (`svix` verification) |
| Styling | Tailwind CSS v4 + shadcn-style UI |
| Deploy | Vercel |

## Getting started

```bash
cp .env.example .env   # fill in Clerk, Stripe, and Postgres credentials
npm install
npx prisma db push
npm run dev            # http://localhost:3000
```

## Architecture notes

- `prisma/schema.prisma` — four models: `User` (Clerk-linked), `Link`, `AnalyticsEvent`, `Transaction`; cascade deletes keep user teardown clean.
- `src/app/api/` — REST routes for links/profile CRUD, Stripe checkout session creation, and Stripe + Clerk webhooks. `api/track/click` powers analytics.
- `src/app/[username]/page.tsx` — server-rendered public profile (SEO-friendly, per-user metadata).
- `src/proxy.ts` — Clerk middleware route matcher protecting `/dashboard` while leaving public pages open.
- Stripe degrades gracefully: tips are hidden when keys are absent, so the app runs with only Clerk + Postgres configured.

## License

MIT
