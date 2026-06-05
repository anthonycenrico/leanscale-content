# Handoff Notes — LeanScale Ghostwriter

Last updated: 2026-06-04

This doc captures what was built in the initial scaffold pass, what's left, and what Anthony / Jake need to do to take it the rest of the way.

---

## Live URLs

- **GitHub repo:** https://github.com/anthonycenrico/leanscale-content
- **Production app:** https://leanscale-content.netlify.app
- **Netlify admin:** https://app.netlify.com/projects/leanscale-content
- **Netlify project ID:** `974bfd84-c017-4cd2-844d-23fe3183f5dd`

Initial deploy was CLI-triggered (`netlify deploy --build --prod`). Future deploys will auto-trigger from git push once the Git integration is connected in the Netlify UI (see "What's left" below).

---

## What's built (MVP foundation)

### Skill layer — fully ready
- ✅ `skill/SKILL.md` — Anthropic skill (works in Claude.ai + Claude Code)
- ✅ `prompts/topic-mining.md` — reusable topic-extraction prompt
- ✅ `prompts/post-generation.md` — reusable per-author post-generation prompt
- ✅ `content-types.md` — the 8 canonical content types
- ✅ `voices/jake.md` (MEDIUM-LOW confidence — needs Jake's actual posts)
- ✅ `voices/joe.md` (MEDIUM confidence — 5 observed posts)
- ✅ `voices/cameron.md` (MEDIUM-HIGH confidence — 5+ observed posts)
- ✅ `voices/yasin.md` (MEDIUM-HIGH confidence — 3 observed posts)
- ✅ `voices/anthony.md` (MEDIUM-HIGH confidence — 6 observed posts)

### Data layer — fully ready
- ✅ `output/sample-2026-06-04/posts.json` — 25 sample posts + 22 topic kernels (real workflow output from initial bring-up)

### App layer — scaffold ready, design refinement pending
- ✅ Next.js 15 + React 19 (App Router)
- ✅ LeanScale brand-locked `globals.css` (dark mode, Plus Jakarta Sans, lime/purple, sharp corners)
- ✅ `app/page.tsx` — home page listing all 5 authors with post counts
- ✅ `app/[author]/page.tsx` — per-person queue with copy + "Compose on LinkedIn" buttons
- ✅ `app/api/og/route.tsx` — Satori PNG renderer with 3 placeholder templates (cover, quote, framework)
- ✅ Status workflow UI (draft / approved / posted chips — UI only, no write-back yet)
- ✅ Visual asset spec rendering for carousels (shows the spec, with "PNG pending" status)

### Deploy layer — config ready, repo setup pending
- ✅ `netlify.toml` (Next.js plugin configured, security headers)
- ✅ `.gitignore` (Node, Next.js, macOS, asset cache)
- ✅ `package.json` (deps locked)
- ✅ `tsconfig.json`, `next.config.js`

---

## What's left

### For Anthony

1. **Create the GitHub repo.**
   ```bash
   cd "/Users/anthonyenrico/Desktop/GitHub Repo/leanscale-ghostwriter"
   git init
   git add .
   git commit -m "Initial scaffold — voice profiles, skill, app, brand-locked UI"
   gh repo create leanscale/leanscale-ghostwriter --private --source=. --push
   ```
   (Or use the GitHub UI — connect a new repo to this folder.)

2. **Connect to Netlify.**
   - Option A (UI): netlify.com → New site from Git → pick the repo → it auto-detects Next.js → deploy
   - Option B (CLI):
     ```bash
     netlify init
     netlify deploy --prod
     ```
   - Set custom domain in Netlify UI: `posts.leanscale.team`
   - Enable password protection: Site settings → Build & deploy → Password protection

3. **Export your Claude Design templates.** Open the conversation(s) where you've built LeanScale-branded carousels / infographics. For each template you want to reuse, ask Claude to "convert this artifact to a self-contained React component using inline styles." Save each export as `templates/[template-name].tsx`. Tell Jake which ones you exported — he'll wire them into the renderer.

4. **Send Jake 5–10 of your actual LinkedIn posts** (or screenshots) so we can upgrade Jake's voice profile from MEDIUM-LOW to MEDIUM-HIGH. Until then, Jake's auto-generated posts should get an extra round of review.

### For Jake (Phase 2 build, ~3-5 days)

1. **Port Claude Design templates into the Satori renderer.**
   - Read `templates/README.md` for the pattern
   - For each export Anthony hands you: drop it into `templates/`, import it into `app/api/og/route.tsx`, add a `case` to the switch statement
   - Add Plus Jakarta Sans as an explicit font via `ImageResponse({ fonts: [...] })` — currently inherited
   - Update `prompts/post-generation.md` so the skill knows which template names to use in `visualAssetNeeded` specs

2. **Add structured visualSpec generation in the skill.**
   - Currently the skill writes `visualAssetNeeded` as free-text and leaves `visualSpec: null`
   - Phase 2: have the skill output structured spec like `{ template: "framework", slides: [{ num: 1, title: "...", body: "..." }] }`
   - The app then renders carousel slide images by calling `/api/og?template=framework&num=1&title=...&body=...` for each slide
   - Update `prompts/post-generation.md` schema to include `visualSpec`

3. **Skill → API write path (replaces direct file write).**
   - Currently the skill writes `output/[date]/posts.json` directly to disk and commits
   - Phase 2: add `POST /api/batch` endpoint that accepts the batch JSON, validates, writes to disk, returns the URL
   - Lets the skill work even if it's not running on the same machine as the repo
   - Add an API key check (env var)

4. **Status workflow write-back.**
   - The status chips are UI-only right now
   - Add `PATCH /api/post/:id` endpoint that updates the status in the JSON file and commits via a service account
   - Or: store status in a separate `status.json` per batch so post content stays immutable

5. **Slack webhook on new batch.**
   - When the skill commits a new batch, post a `#ghostwriter` Slack message: "New batch is live — 25 posts, X carousels. View at posts.leanscale.team"
   - Use the Slack incoming webhook URL stored as a Netlify env var

### For Yasin (when ready)

- **Spec 5 carousel templates in Figma** (or directly in Claude.ai Artifacts) to align with the LeanScale brand:
  - Carousel cover
  - Listicle quote card
  - Framework diagram (numbered)
  - Before/after comparison
  - Generic infographic

  Then hand to Jake for the Satori port.

---

## Open architectural decisions

1. **Authentication for the app.** Currently relies on Netlify password protection (one shared password for the team). Considered alternatives:
   - GitHub OAuth — heavier setup, but ties to actual team membership
   - Netlify Identity — per-user accounts, free for small teams
   - Magic link via Resend — simplest per-user auth

   Recommendation: stick with Netlify password protection for MVP. Revisit if the team grows past 10 people.

2. **Where does the skill run?**
   - Locally on Anthony's machine (current default — writes files, git push)
   - In Claude.ai (lighter — but how does it push to GitHub?)
   - As a serverless function triggered by a webhook (Phase 2 — most flexible)

   Recommendation: local-first for MVP. Phase 2 add the API endpoint so Claude.ai runs can also write.

3. **Carousel image storage.** PNGs are rendered on-demand by `/api/og` at request time. Pros: no asset committed to git, regenerable. Cons: every page view re-renders (Netlify Edge caches help). If we ever want offline access or LinkedIn-direct image hosting, we'd switch to writing PNGs to git on skill run and committing them.

4. **Voice profile evolution.** Currently the profiles are markdown files maintained by hand. Phase 3 idea: tie LinkedIn post engagement back into a feedback loop — which voice characteristics correlated with strong posts, which didn't — and auto-suggest profile edits.

---

## Where to find things

- **Skill / data / config**: this repo root
- **Brand guidelines**: `/Users/anthonyenrico/Desktop/GitHub Repo/leanscale-brand-guidelines.md` (the canonical reference)
- **Reference HTML implementation**: `~/.claude/skills/podcast-storyboard/templates/index.html`
- **LeanScale logo (white-on-dark only)**: `~/.claude/skills/podcast-storyboard/templates/assets/leanscale-logo-white.png`
- **Netlify deploy script for branded microsites**: `~/.claude/skills/podcast-storyboard/scripts/deploy.sh`

---

## Running it locally right now

```bash
cd "/Users/anthonyenrico/Desktop/GitHub Repo/leanscale-ghostwriter"
npm install
npm run dev
# Open http://localhost:3000
```

The home page will show the 5 authors and the sample batch (25 posts). Click any name to see that person's queue with copy buttons.
