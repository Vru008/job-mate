# Deploying JobMate for Free

Three free services, all with no credit card required for the free tiers:

| Part | Service | Cost |
|------|---------|------|
| Database | MongoDB Atlas | Free (already set up) |
| Backend (`server/`) | Render | Free |
| Frontend (repo root) | Vercel | Free |

> Note: everything here is free, including the AI features — they run on Google
> Gemini's free tier (no credit card). Get a key at https://aistudio.google.com/.

---

## Step 0 — Push your code to GitHub

Both Render and Vercel deploy from a GitHub repo.

```bash
git add .
git commit -m "Prepare for deployment"
git push
```

Make sure `server/.env` is NOT committed (it's already in .gitignore).

---

## Step 1 — MongoDB Atlas (allow access from anywhere)

Your DB already exists. Just make sure the host servers can reach it:

1. Go to https://cloud.mongodb.com → your cluster → **Network Access**
2. **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) → Confirm

(Render's servers don't have a fixed IP, so this is required.)

---

## Step 2 — Deploy the backend on Render

1. Go to https://render.com → sign up with GitHub
2. **New +** → **Web Service** → connect your JobMate repo
3. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Under **Environment**, add three variables:
   - `MONGO_URI` = your MongoDB connection string
   - `GEMINI_API_KEY` = your free Gemini key (aistudio.google.com)
   - `JWT_SECRET` = any long random string (signs login tokens)
5. **Create Web Service**. After it deploys you'll get a URL like
   `https://jobmate-backend.onrender.com` — copy it.

> Optional: to get the demo accounts + sample jobs on the live DB, run
> `node seed.js` once locally (it points at the same `MONGO_URI`).

> Free Render services sleep after 15 min idle and take ~50s to wake on the
> first request. Fine for a portfolio. (Or keep it warm with a free cron pinger
> like https://cron-job.org hitting your backend URL every 10 min.)

---

## Step 3 — Deploy the frontend on Vercel

1. Go to https://vercel.com → sign up with GitHub
2. **Add New** → **Project** → import your JobMate repo
3. Vercel auto-detects Create React App. Leave the defaults.
4. Add an **Environment Variable**:
   - `REACT_APP_API_URL` = your Render backend URL from Step 2
     (e.g. `https://jobmate-backend.onrender.com` — no trailing slash)
5. **Deploy**. You'll get a public URL like `https://job-mate.vercel.app`.

That URL is what you share with employers. 🎉

---

## Updating later

Just `git push` — both Render and Vercel auto-redeploy on every push to your
main branch.

---

## Troubleshooting

- **AI buttons say "API key not set"** → add `GEMINI_API_KEY` in Render env vars and redeploy.
- **Jobs don't load / network error** → check `REACT_APP_API_URL` in Vercel matches your Render URL exactly, and that MongoDB Network Access allows `0.0.0.0/0`.
- **First load is slow** → the free Render backend was asleep; it wakes in ~50s.
