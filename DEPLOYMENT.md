# How to Push This App to Production (Step-by-Step)

**Constellate** (University of Austin Talent Network) uses: **Next.js 14**, **React**, **TypeScript**, **Tailwind CSS**, **SQLite** (via Prisma), and **NextAuth**.  
The easiest host for this stack is **Railway** — it supports Next.js and SQLite with minimal setup. The live app is at **[https://www.uatxconstellate.com/](https://www.uatxconstellate.com/)**.

---

## Before You Start

1. **Put your project on GitHub** (if it isn’t already):
   - Go to [github.com](https://github.com) and sign in.
   - Click the **+** (top right) → **New repository**.
   - Name it (e.g. `uatx-talent-connect`), leave other options default, click **Create repository**.
   - On your computer, open Terminal, go to your project folder, and run:
     ```bash
     cd /Users/madeleinemeegan/Desktop/uatx_talent_connect
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
     git push -u origin main
     ```
     (Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.)

2. **Generate a secret for production** (you’ll need it in Step 4):
   - In Terminal run: `openssl rand -base64 32`
   - Copy the long string it prints and keep it somewhere safe (e.g. Notes).

---

## Deploy on Railway (Step-by-Step)

### Step 1: Sign up and create a project

1. Go to [railway.app](https://railway.app).
2. Click **Login** and sign in with **GitHub**.
3. Click **New Project**.

### Step 2: Deploy from GitHub

1. Choose **Deploy from GitHub repo**.
2. If asked, approve Railway’s access to your GitHub.
3. Select the repository that contains this app (e.g. `uatx-talent-connect`).
4. Railway will detect Next.js and start building. Wait until the build finishes (a few minutes).

### Step 3: Add a database (SQLite) and storage

Your app uses SQLite, which needs a place to store the database file.

1. In your Railway project, click **+ New** (or **Add service**).
2. Click **Database** → choose **SQLite** (or **Empty** if SQLite isn’t listed; see note below).
   - If there’s no SQLite option: add a **Volume** instead (see Railway’s “Volumes” docs). Then set `DATABASE_URL` in variables (Step 4) to a path on that volume, e.g. `file:/data/dev.db`.
3. If you added a database, Railway will give you a `DATABASE_URL`. Copy it (you’ll use it in Step 4).

**If Railway doesn’t offer SQLite:**  
Add a **Volume** to your app service, mount it (e.g. at `/data`), then in Step 4 set:
`DATABASE_URL=file:/data/prisma.db`

### Step 4: Set environment variables

1. In Railway, click your **app service** (the one that’s not the database).
2. Open the **Variables** tab.
3. Add these (use **+ New Variable** or **Raw Editor**):

   | Name             | Value |
   |------------------|--------|
   | `DATABASE_URL`   | The URL Railway gave you for SQLite, or `file:/data/prisma.db` if you used a volume |
   | `NEXTAUTH_SECRET`| The long random string you generated with `openssl rand -base64 32` |
   | `NEXTAUTH_URL`   | Your app’s public URL (see Step 5). For custom domain use `https://www.uatxconstellate.com` |

4. Save. Railway will redeploy with the new variables.

### Step 5: Get your live URL and set NEXTAUTH_URL

1. Click your **app service**.
2. Open the **Settings** tab.
3. Under **Networking** / **Public Networking**, click **Generate Domain** (or **Add domain**).
4. Copy the URL Railway gives you (e.g. `https://uatx-talent-connect-production.up.railway.app`).
5. Go back to **Variables** and set:
   - `NEXTAUTH_URL` = that URL (e.g. `https://uatx-talent-connect-production.up.railway.app`). Once your custom domain is connected (see **CUSTOM_DOMAIN.md**), set it to `https://www.uatxconstellate.com` instead.
6. Save again so the app redeploys with the correct `NEXTAUTH_URL`.

### Step 6: Run database setup on Railway (one time)

Your app needs the database tables and (optionally) seed data. Railway can run commands when it builds.

1. In your **app service** → **Settings** (or **Build**), find **Build Command** and **Start Command**.
2. Set **Build Command** to:
   ```bash
   npm install && npx prisma generate && npm run build
   ```
3. Set **Start Command** to:
   ```bash
   npx prisma db push && npm run db:seed && npm run start
   ```
   (The first deploy will run `db:push` and `db:seed`; after that you can change Start Command to just `npm run start` if you prefer.)

   Alternatively, run the commands once via Railway’s **Shell** (if available):
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. Trigger a redeploy (e.g. push a small commit to GitHub or click **Redeploy** in Railway).

### Step 7: Open your app

1. Visit the URL from Step 5 (e.g. `https://uatx-talent-connect-production.up.railway.app`).
2. You should see your app. Try signing in with the demo account (see README for demo emails and password).

---

## Summary

- **Stack:** Next.js 14, React, TypeScript, Tailwind, SQLite (Prisma), NextAuth.
- **Host:** Railway — good fit because it can run Next.js and SQLite (or a volume for the DB file).
- **Steps:** GitHub repo → Railway “New Project” from GitHub → add SQLite or Volume → set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` → generate domain (or use custom domain [www.uatxconstellate.com](https://www.uatxconstellate.com/)) → run `prisma db push` (and optionally `db:seed`) → open the app URL.

You can connect your GoDaddy domain later by adding it in Railway’s **Settings** → **Networking** / **Custom domain** and then pointing the domain at Railway in GoDaddy (we can do that in a follow-up when you’re ready).
