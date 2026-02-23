# Constellate — University of Austin Talent Network

A full-stack web app for the **University of Austin (UATX) Talent Network**: structured mentorship connecting UATX students with professionals across industries. Students submit help requests, get matched to relevant mentors by topic and field, and can be connected with up to 3 mentors per request. Mentors accept or decline; on accept, the student receives the mentor’s contact details and can schedule a focused, time-bound conversation.

**Live app:** [https://www.uatxconstellate.com/](https://www.uatxconstellate.com/)

## Tech stack

- **Frontend & API:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite (Prisma ORM)
- **Auth:** NextAuth.js (credentials, JWT)

## Setup

### Prerequisites

- Node.js 18+
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

Copy the example env and set a secret for production:

```bash
cp .env.example .env
```

Edit `.env` if needed:

- `DATABASE_URL` — SQLite file path (default `file:./dev.db` is fine for local)
- `NEXTAUTH_SECRET` — use a random string in production (e.g. `openssl rand -base64 32`)
- `NEXTAUTH_URL` — app URL (e.g. `http://localhost:3000` for dev; production: `https://www.uatxconstellate.com`)

### 3. Database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

- `db:generate` — generates Prisma client  
- `db:push` — creates/updates the SQLite schema  
- `db:seed` — adds demo users and data  

To reset DB and re-seed:

```bash
npm run db:reset
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The production site runs at [https://www.uatxconstellate.com/](https://www.uatxconstellate.com/).

## Demo accounts (after seed)

Password for all: **password123**

| Role    | Email                 |
|---------|------------------------|
| Admin   | admin@demo.bridge     |
| Student | student@demo.bridge   |
| Mentor  | mentor1@demo.bridge   |
| Mentor  | mentor2@demo.bridge   |
| Mentor  | mentor3@demo.bridge   |

**Mentor invite codes (for new signups):** `MENTOR2024`, `TALENT-BRIDGE` — or create more from the **Admin** page at `/admin`.

## Features

- **Landing** — Constellate / UATX Talent Network value prop, “Find your orientation,” and sign up / log in
- **Auth** — sign up (students open; mentors require invite code), log in, sign out (custom signout page)
- **Admin** — at `/admin`: view and create mentor invite codes; view all mentors and students in the network (admin account required)
- **Student**
  - Dashboard: list of help requests
  - Create help request (description, topics, industries/fields from shared tag list, optional notes)
  - UATX center(s) and expertise tags on profile
  - Request detail: status per mentor; “Email to schedule” (mailto + template) when accepted
- **Mentor**
  - Dashboard: incoming requests (with student name, centers, and request details)
  - Request detail: accept or decline; on accept, student sees contact email and template
  - Connections: list of accepted students (with centers)
- **Matching** — tag overlap (request topics/fields vs mentor topics/industries), availability weight, light deprioritization of mentors with more requests

Topic and field options are defined in a single source of truth (`src/lib/tags.ts`) and used everywhere (student requests, mentor profile, signup).

## Project structure

- `src/app/` — App Router pages and API routes
- `src/app/api/` — Auth (signup, NextAuth), profiles, help-requests, mentor requests, admin
- `src/components/` — Nav, forms, UI (Card, Button, PillMultiSelect, etc.), brand (NavBrand)
- `src/lib/` — Prisma client, auth config, matching logic, tags (TOPIC_TAGS, FIELD_TAGS), design tokens, server data helpers
- `prisma/` — schema and seed

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run db:generate` — generate Prisma client
- `npm run db:push` — push schema to DB
- `npm run db:seed` — run seed
- `npm run db:reset` — reset DB and seed
