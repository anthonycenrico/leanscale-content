# LeanScale Ghostwriter

A LinkedIn ghostwriting system for the LeanScale leadership team. Drop a podcast transcript in → get 25 publish-ready posts (5 per team member) + branded infographics → team grabs them from a private URL.

---

## How it works

```
            Anthony drops a transcript
                       │
                       ▼
        ┌──────────────────────────────┐
        │  leanscale-ghostwriter skill │  (Anthropic skill — runs in
        │   (skill/SKILL.md)           │   Claude.ai OR Claude Code)
        └──────────────────────────────┘
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
   Topic mining            Post generation
   (prompts/                (prompts/
    topic-mining.md)         post-generation.md,
                             ×5 in parallel)
            └──────────┬──────────┘
                       ▼
        output/[YYYY-MM-DD]/posts.json
                       │
                  git commit
                       │
                       ▼
                  Netlify auto-deploys
                       │
                       ▼
        posts.leanscale.team (Next.js app)
                       │
                       ▼
        Team grabs posts → copies → posts to LinkedIn
```

## Repo structure

```
leanscale-ghostwriter/
├── skill/
│   └── SKILL.md              # The Anthropic skill — works in Claude.ai + Claude Code
├── voices/                   # Canonical voice profiles — edit these to tune output
│   ├── jake.md
│   ├── joe.md
│   ├── cameron.md
│   ├── yasin.md
│   └── anthony.md
├── content-types.md          # The 8 canonical LinkedIn content types
├── prompts/                  # Reusable prompt templates the skill loads
│   ├── topic-mining.md
│   └── post-generation.md
├── templates/                # React components for Satori PNG rendering
│   └── (populated from Claude Design exports — see roadmap below)
├── app/                      # Next.js 15 app (the team-facing UI)
│   ├── layout.tsx
│   ├── page.tsx              # Home — list of recent batches
│   ├── [author]/page.tsx     # Per-person queue
│   ├── api/og/route.ts       # Satori PNG renderer endpoint
│   └── globals.css           # LeanScale design tokens
├── output/                   # Generated batches — committed to git
│   └── [YYYY-MM-DD]/
│       ├── posts.json
│       └── assets/           # Rendered PNGs (regenerable, gitignored)
├── netlify.toml
├── package.json
└── README.md
```

## Running the skill

### From Claude Code

```
/leanscale-ghostwriter [path/to/transcript.txt]
```

Skill reads voice profiles + content types + transcript → mines topics → generates 25 posts → writes to `output/[today]/posts.json` → commits and pushes → Netlify deploys.

### From Claude.ai

Paste the transcript into the conversation, invoke the skill, and the same flow runs. Visual previews of each post render inline as Artifacts.

## Running the app locally

```bash
cd leanscale-ghostwriter
npm install
npm run dev
# Open http://localhost:3000
```

## Deploying to Netlify

The repo is pre-configured for Netlify (`netlify.toml` uses `@netlify/plugin-nextjs`).

### First-time deploy

```bash
# From repo root (after git init + push to GitHub)
netlify init       # Connect this repo to a new Netlify site
netlify deploy --prod
```

Or via the Netlify UI: connect the GitHub repo → it auto-detects Next.js → deploy.

### Custom domain

In Netlify UI: Site settings → Domain management → Add custom domain → `posts.leanscale.team`.

### Password protection

Site settings → Build & deploy → Password protection → enable → set shared team password.

### Environment variables

| Variable | Required? | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | Optional | Powers the per-post "Regenerate / Generate visual" buttons. Without it, those buttons return a clear error but everything else (batch export, Satori rendering, designed PNGs) works. Server-only — never prefix with `NEXT_PUBLIC_`. |
| `ANTHROPIC_MODEL` | Optional | Overrides the model used for visual generation. Defaults to `claude-sonnet-4-5`. |

Set these in Netlify → Site configuration → Environment variables, then trigger a redeploy (env changes only apply on a fresh build).

## Editing voice profiles

Each `voices/*.md` is the canonical source of truth for that person's voice. To refine a profile:

1. Edit the markdown directly
2. Update the `confidence` field in the YAML frontmatter if you're adding observed signal
3. Commit and push — the next batch run uses the updated profile

**Jake's profile is currently MEDIUM-LOW confidence** — needs 5-10 actual LinkedIn posts to firm up. Until then, post output for Jake should be reviewed more carefully.

## Adding a new content type

1. Append the new type to `content-types.md` with structure, length, when-to-use, and hook examples
2. Update `skill/SKILL.md` to mention the new type if needed
3. Update each `voices/*.md` `contentTypeFit` field if the new type fits that author's voice

## Adding a new infographic template

1. Build/export the template as a React component from Claude Design (Claude.ai)
2. Drop the component into `templates/[template-name].tsx`
3. Import the new template into `app/api/og/route.ts` and add a case for it
4. Document the template's expected props in `templates/README.md`

## Roadmap

### MVP (current)
- [x] Voice profiles for 5 team members
- [x] Content type taxonomy
- [x] Skill (SKILL.md) with topic mining + post generation prompts
- [x] Sample batch from initial system bring-up
- [x] Netlify config, package.json, .gitignore, README
- [ ] Next.js app scaffold (in progress)
- [ ] Satori PNG renderer endpoint
- [ ] 5 LeanScale brand templates ported from Claude Design

### Phase 2
- [ ] Status workflow (Draft → Approved → Posted)
- [ ] Per-post scheduling field + Slack reminder before scheduled time
- [ ] "Compose on LinkedIn" deep links
- [ ] Slack webhook notification on new batch
- [ ] Optional: rich-text editor for in-app post tweaks (writes back to JSON via PR)

### Phase 3
- [ ] LinkedIn analytics scraping or manual entry → which voice characteristics + content types correlate to engagement
- [ ] Voice profile auto-tuning based on engagement feedback
- [ ] Multi-tenant support (productize for other agencies)

## Known limitations

- Posting to LinkedIn is still manual (LinkedIn down-ranks automation-flagged posts on personal accounts — this is intentional, not a gap)
- Visual templates are placeholders until Claude Design exports are ported in
- No auth currently — relies on Netlify password protection
