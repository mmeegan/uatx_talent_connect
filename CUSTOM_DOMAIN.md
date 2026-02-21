# Connecting Your GoDaddy Domain to Railway

After your app is live on Railway, you can point your GoDaddy domain so people visit `https://yourdomain.com` instead of the Railway URL.

---

## Part 1: Add the domain in Railway

1. In [Railway](https://railway.app), open your project and click your **uatx_talent_connect** app service.
2. Go to **Settings** (or look for **Networking** / **Domains**).
3. Find **Custom Domains** or **Domains** and click **Add domain** (or **+ Domain**).
4. Enter the domain you want:
   - For **www**: `www.yourdomain.com`
   - For **root (no www)**: `yourdomain.com`
   You can add both; do one at a time.
5. Railway will show the **DNS records** you need. You might see:
   - **CNAME** with a target like `uatxtalentconnect-production.up.railway.app`
   - Or for root domain, an **A record** with an IP address
6. **Copy the exact Value/Target** Railway shows — you’ll paste it into GoDaddy.

---

## Part 2: Point the domain in GoDaddy

1. Log in at [GoDaddy](https://www.godaddy.com).
2. Go to **My Products** → find your domain → click **DNS** (or **Manage DNS**).
3. Click **Add** (or **Add record**).
4. Enter the record using what Railway gave you:

   **If Railway gave you a CNAME (most common for www):**
   - **Type:** CNAME
   - **Name:** `www` (for www.yourdomain.com) — or whatever Railway says (sometimes they use `@` for root).
   - **Value / Points to:** paste the exact target from Railway (e.g. `uatxtalentconnect-production.up.railway.app`). No `https://`, no trailing slash.
   - **TTL:** 600 or 1 hour is fine.

   **If Railway gave you an A record (for root domain):**
   - **Type:** A
   - **Name:** `@`
   - **Value:** the IP address Railway showed you.
   - **TTL:** 600 or 1 hour.

5. Save. DNS can take from a few minutes up to 24–48 hours; often it’s 15–30 minutes.

**Tip:** Using **www** (CNAME to Railway’s URL) is usually the most reliable. Root domain (`@`) can be trickier on some hosts.

---

## Part 3: Update NEXTAUTH_URL in Railway

So sign-in and redirects use your real domain:

1. In Railway → your **uatx_talent_connect** service → **Variables**.
2. Find **NEXTAUTH_URL** and set it to your custom URL:
   - If using www: `https://www.yourdomain.com`
   - If using root only: `https://yourdomain.com`
   Use the same URL you added as a custom domain.
3. Save. Railway will redeploy with the new value.

---

## Part 4: Verify

1. Wait until Railway’s dashboard shows the domain as **Verified** or **Active** (Railway checks DNS automatically).
2. Visit `https://yourdomain.com` or `https://www.yourdomain.com` in your browser. You should see your app.
3. Try signing in to confirm redirects work correctly.

If the domain doesn’t verify, double-check in GoDaddy that the **Name** and **Value** match exactly what Railway shows (no extra spaces, no typos).
