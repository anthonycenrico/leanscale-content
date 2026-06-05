---
name: leanscale-ghostwriter
description: Generate 5 LinkedIn posts per LeanScale team member (25 total per run) from a podcast transcript, in each person's distinct voice, using the 8 canonical content types. Writes structured JSON output to a dated batch folder and triggers a Netlify deploy so the team can pull their posts from posts.leanscale.team. Use when Anthony asks for "ghostwriter posts," "team posts from this transcript," drops a transcript file path with a request to generate LinkedIn content, or asks to add a new batch.
---

# LeanScale Team Ghostwriter

Generates 25 publish-ready LinkedIn posts (5 per team member) from a podcast transcript or topic seed. Outputs structured JSON the LeanScale ghostwriter app reads.

## When to invoke

- User drops a path to a transcript file (`.txt`, `.md`, `.vtt`) and asks for posts
- User says "ghostwriter posts" or "team posts" or "LinkedIn batch"
- User pastes a transcript directly with a generation request

## Inputs

- **Required:** A transcript file path OR pasted transcript content
- **Optional:** A topic seed (a specific theme to emphasize from the transcript)
- **Optional:** A subset of authors to generate for (default: all 5)

## Step-by-step execution

### Step 1 — Load the canonical artifacts

Read these files from the repo root:

- `voices/jake.md`
- `voices/joe.md`
- `voices/cameron.md`
- `voices/yasin.md`
- `voices/anthony.md`
- `content-types.md`

These are the source of truth for author voice and content type definitions. Do not infer voice characteristics from your own model knowledge — use what's in the files.

### Step 2 — Read the transcript(s)

Read the transcript file(s) the user provided. Note the guest name, primary topic, and any obvious themes.

### Step 3 — Mine topic kernels

Use `prompts/topic-mining.md` as the prompt template. Extract 18-22 post-worthy topic kernels following the schema in that file.

A kernel is NOT a broad theme. It's a specific take, framework, contrarian POV, or story that could anchor a single post. Examples:
- Bad: "AI is changing RevOps"
- Good: "The CHRO is no longer the economic buyer for HR AI — IT is"

Aim for variety across:
- Content types (each kernel tags which types fit)
- Roles (each kernel tags which LeanScale team roles fit)
- Domains (RevOps, AI in GTM, sales methodology, leadership, etc.)

### Step 4 — Generate posts per author (in parallel)

For each of the 5 authors, use `prompts/post-generation.md` as the prompt template. Pass in:
- The author's voice profile (full content of their `voices/*.md` file)
- The content type taxonomy (full content of `content-types.md`)
- The mined topic kernels
- Hard constraint: 5 posts per author, no more than 2 of the same content type per author

Run all 5 author generations in parallel (e.g., via the Workflow tool's `parallel()` call) if available — this is 5x faster than serial.

### Step 5 — Assemble the batch JSON

Write a single batch file at:
```
output/[YYYY-MM-DD]/posts.json
```

Schema:
```json
{
  "batchId": "YYYY-MM-DD",
  "generatedAt": "ISO-8601 timestamp",
  "source": {
    "type": "podcast-transcripts",
    "transcripts": [
      { "guest": "...", "file": "...", "topic": "..." }
    ]
  },
  "topics": [ ... 18-22 kernels ... ],
  "posts": [
    {
      "id": "{authorSlug}-{batchId}-{index}",
      "batchId": "YYYY-MM-DD",
      "author": "Display Name",
      "authorSlug": "jake|joe|cameron|yasin|anthony",
      "contentType": "ONE OF THE 8 TYPES",
      "topicTitle": "...",
      "postText": "Full LinkedIn post with real line breaks",
      "voiceNotes": "Which voice characteristics this leans into",
      "visualAssetNeeded": "Free-text description, or empty string if not a carousel/infographic",
      "visualSpec": null,
      "status": "draft",
      "scheduledFor": null,
      "postedAt": null,
      "linkedInUrl": null,
      "createdAt": "ISO-8601 timestamp"
    }
  ]
}
```

For carousel/infographic posts, populate `visualAssetNeeded` with a slide-by-slide description. `visualSpec` stays null until template-bound rendering is wired in (see roadmap in repo README).

### Step 6 — Commit and push

Stage, commit, and push the new batch folder:
```
git add output/[YYYY-MM-DD]/
git commit -m "Add content batch [YYYY-MM-DD] — [N] posts from [transcript description]"
git push
```

Netlify auto-deploys on push. The team can access the new batch at the LeanScale Content site within ~60 seconds.

### Step 7 — Visual asset workflow (batch)

After the new batch lands, Anthony exports all visual posts in a single tagged document for Claude.ai-based design:

1. On the home page, hit "Export N visual posts for Claude design →" — this copies a markdown doc with all CAROUSEL + INFOGRAPHIC posts (≈10 per batch of 25), the LeanScale Light Mode design system, and the asset naming convention.
2. He pastes that into Claude.ai and iterates on the designs.
3. He hands me the PNG files; I commit them to `public/assets/{slide-id}.png`.
4. The carousel block prefers the designed PNG over the Satori-rendered fallback automatically.

The skill itself just needs to emit correct structured `visualSpec` — the rest of the workflow is human-driven.

### Step 7 — Report back

Tell the user:
- Batch ID and date
- Count of posts per author
- Topic kernel count
- Carousel/infographic count (these need visual rendering — call out if templates are still pending)
- Live URL once the deploy is confirmed

## Quality bar

- No corporate-speak ("in today's fast-paced world", "leverage synergies", "at the end of the day")
- No emoji unless the author's voice profile explicitly says they use them
- Hooks must earn the read — no clickbait that doesn't deliver
- Specifics over abstractions (numbers, named scenarios, concrete examples)
- Each post must be publish-ready, not a draft
- Front-load the hook in the first 2-3 lines (LinkedIn's "see more" cutoff)

## When something fails

- **Voice profile is too inferred (confidence MEDIUM-LOW)** — flag it in the report. Suggest the team member send 5-10 actual posts to refine.
- **A topic kernel doesn't fit any of the 5 roles** — drop it from the pool for post generation, but keep it in `topics` for reference.
- **An author has no good kernels** — note the gap in the report. Don't generate weak posts to hit the count.
- **The repo is not a git repo yet** — skip the commit/push step and tell the user to set up the repo.

## Notes

- Voice profiles are markdown files with YAML frontmatter — use a frontmatter parser or just read them as text and pass to the post-gen agent.
- The Anthropic Skill format means this `SKILL.md` can be invoked from either Claude.ai or Claude Code with the same behavior.
- All heavy work (topic mining, post generation) happens via subagent calls — keep the main thread focused on orchestration.
