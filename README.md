# Bridge

A full-stack web app that connects students with mentors for 30-minute coffee chats. Students submit help requests, get matched to relevant mentors by topic and availability, and can send requests to up to 3 mentors. Mentors accept or decline; on accept, the student receives the mentor’s contact email and a pre-filled email template to start the conversation.

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
- `NEXTAUTH_URL` — app URL (e.g. `http://localhost:3000` for dev)

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

Open [http://localhost:3000](http://localhost:3000).

## Demo accounts (after seed)

Password for all: **password123**

| Role    | Email                 |
|---------|------------------------|
| Student | student@demo.bridge   |
| Mentor  | mentor1@demo.bridge   |
| Mentor  | mentor2@demo.bridge   |
| Mentor  | mentor3@demo.bridge   |

**Mentor invite codes (for new signups):** `MENTOR2024`, `TALENT-BRIDGE`

## Features

- **Landing** — value prop and sign up / log in
- **Auth** — sign up (students open; mentors require invite code), log in, sign out
- **Student**
  - Dashboard: list of help requests
  - Create help request (title, description, optional tags)
  - Matches: ranked mentors per request; select up to 3 and send request
  - Request detail: status per mentor; “Email to schedule” (mailto + template) when accepted
- **Mentor**
  - Dashboard: incoming requests
  - Request detail: accept or decline; on accept, student sees contact email and template
- **Matching** — tag overlap (request tags vs mentor topics/industry), availability weight, light deprioritization of mentors with more requests

## Project structure

- `src/app/` — App Router pages and API routes
- `src/app/api/` — Auth (signup, NextAuth), profiles, help-requests, mentor requests
- `src/components/` — e.g. SessionProvider
- `src/lib/` — Prisma client, auth config, matching logic, email template, server data helpers
- `prisma/` — schema and seed

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run db:generate` — generate Prisma client
- `npm run db:push` — push schema to DB
- `npm run db:seed` — run seed
- `npm run db:reset` — reset DB and seed
