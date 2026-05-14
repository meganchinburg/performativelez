# 🏳️‍🌈 Bellingham Performative Lesbian Contest

Official scoring app — Elder Council Edition.

Judges score contestants on their phones. Scores combine into a live leaderboard. Top 3 get crowned.

## How It Works

- **Judges** go to `/judge`, pick their judge number, and score contestants one at a time across 6 categories (1–10 each, 60 max per judge)
- **Leaderboard** at `/results` auto-refreshes every 10 seconds, shows rankings by average score, and highlights the top 3
- Judges can re-score a contestant (overwrites previous score)
- Tap any contestant on the leaderboard to see per-judge breakdowns

## Setup & Deploy (15 minutes)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "let's find bellingham's most performative lesbian"
# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (free account works)
2. Click **"Add New Project"** → Import your GitHub repo
3. Framework will auto-detect as **Next.js** — accept defaults
4. Click **Deploy** (it'll fail the first time — that's fine, you need KV next)

### 3. Add Vercel KV (free Redis store)

1. In your Vercel project dashboard, go to **Storage** tab
2. Click **Create** → **KV (Redis)**
3. Pick a name (e.g., `contest-scores`) and region → **Create**
4. It will automatically add the `KV_*` environment variables to your project
5. Go to **Deployments** tab → click the three dots on the latest → **Redeploy**

That's it. Your app is live.

### 4. Share with Judges

Each judge opens the app URL on their phone:
- `https://your-app.vercel.app/judge`

The leaderboard (great for projecting on a screen):
- `https://your-app.vercel.app/results`

## Local Development

```bash
npm install
# Copy env vars from Vercel dashboard (Storage → KV → .env.local tab)
cp .env.local.example .env.local
# Fill in the KV_* values
npm run dev
```

## Admin: Reset All Scores

To clear all scores (e.g., after testing), run this in your browser console or via curl:

```bash
curl -X DELETE https://your-app.vercel.app/api/scores
```

## Categories

1. 👟 **The Fit** — Outfit cohesion & aesthetic commitment
2. 🔑 **Accessory Game** — The details (carabiners, crystals, tote bags...)
3. 📚 **Stereotype Depth** — Surface-level or deep lore?
4. 🔥 **Commitment to the Bit** — Concept, props, narrative
5. 💅 **Swagger & Presentation** — Walk, confidence, energy
6. 🔮 **Elder Council Wildcard** — The intangible. Use your years wisely.

---

*"We walked so you could cuff your jeans."*
