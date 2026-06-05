import type { SlideSpec, Post, Batch, AuthorSlug } from "./types";
import { AUTHOR_META, AUTHOR_ORDER } from "./types";

/**
 * Builds a URL for the OG endpoint that renders a single slide as a PNG.
 * Used by the QueueView to show inline thumbnails and downloadable assets.
 *
 * Returns an absolute path (starts with /) so it works for both inline <img>
 * tags and direct downloads via an <a> link.
 */
export function buildSlideUrl(slide: SlideSpec): string {
  const params = new URLSearchParams();
  params.set("template", slide.template);
  if (slide.params.kicker) params.set("kicker", slide.params.kicker);
  if (slide.params.title) params.set("title", slide.params.title);
  if (slide.params.body) params.set("body", slide.params.body);
  if (slide.params.num) params.set("num", slide.params.num);
  if (slide.params.stat) params.set("stat", slide.params.stat);
  if (slide.params.statLabel) params.set("statLabel", slide.params.statLabel);
  if (slide.params.items && slide.params.items.length > 0) {
    params.set("items", slide.params.items.join("|"));
  }
  return `/api/og?${params.toString()}`;
}

/**
 * Stable slide ID for asset filenames and asset path resolution.
 * Format: {post-id}-slide-{NN}  (NN is zero-padded, 1-indexed)
 */
export function buildSlideId(postId: string, index: number): string {
  return `${postId}-slide-${String(index + 1).padStart(2, "0")}`;
}

/**
 * Public-served PNG path for a designed slide. The carousel block tries this
 * URL first; if the file doesn't exist (404), it falls back to the Satori URL.
 *
 * Drop designed PNGs at: public/assets/{slide-id}.png
 */
export function buildAssetPngUrl(postId: string, index: number): string {
  return `/assets/${buildSlideId(postId, index)}.png`;
}

export function buildSlideFilename(postId: string, index: number): string {
  return `${buildSlideId(postId, index)}.png`;
}

/* ============================================================
   Batch export — for the "Copy for Claude Design" workflow
   ============================================================ */

const CONDENSED_BRAND_SPEC = `LEANSCALE LIGHT MODE — DESIGN SYSTEM (CONDENSED)

Colors (use exact tokens, never improvise):
- Page bg: #FFFBFF (warm off-white — NEVER pure white)
- Dark inverse: #301934 (deep aubergine — for closing slides and dark accent surfaces)
- Light gray surface: #E9E9E7
- Primary accent: #642585 (strong purple — primary tag color, links, big numerals on light)
- Dark-section accent: #D9AFD0 (medium purple — accents on dark sections only)
- Callout: #E8FFCF (lime — ONLY for primary CTAs, badges, the occasional callout strip)
- Ink on light: #000000 (true black, warm bg makes it readable)
- Body muted: #595959
- Ink on lime panels: #1A2410 / #0B0B0B (NEVER off-white)
- Ink on dark sections: #FFFBFF

Typography (Plus Jakarta Sans only, system-ui fallback):
- Body default weight: 500 (medium) — NEVER 400 against this warm bg, looks thin
- Tags / eyebrows: 300 (light), UPPERCASE, 0.18em letter-spacing — the signature LeanScale detail
- Headings: 500 weight, -0.01em tracking — NEVER bold (700) and rarely 600
- Big numerals (project index, step numbers, hero stats): 300 weight (light) — architectural, not aggressive

Geometry:
- Slides: 1080×1080 (square — LinkedIn carousel format)
- Padding: 80-96px from edges
- Corner radius: 0px on heroes, 4-8px on cards, 999px ONLY on small chip badges
- Purple-tinted shadows: rgba(48, 25, 52, 0.08) to rgba(48, 25, 52, 0.14)

Hard rules:
- NO gradients
- NO glassmorphism (except sticky-nav backdrop, not relevant here)
- NO decorative shadows beyond the elevation tokens above
- NO emojis — use real ★ and → glyphs if you need a symbol
- NO rounded corners past 16px

Section / slide anatomy (every slide should follow):
[ TAG (eyebrow, 2-4 words) ]
[ HEADING (declarative, ≤10 words) ]
[ LEDE (1-2 sentences, optional) ]
[ MAIN CONTENT (the framework, list, stat, or framework) ]
[ FOOTER (just "www.leanscale.team", no second label) ]

Slide template repertoire (these are what the Satori renderer supports — designs should map back to these):
- cover: opening slide, big display headline, sometimes lede body
- framework: numbered step (big purple "01", title, body)
- listicle: 3-6 bulleted items with hairline dividers
- stat: huge purple number/value, big label below, body
- quote: lime-background pull-quote (dark text), title is the quote, body is attribution
- dark: deep aubergine closing slide, off-white type, medium-purple eyebrow

When designing freshly in Claude.ai, you can go further than the existing templates — invent new layouts (matrix, comparison, sequence diagram, etc.) — but keep them on-brand. We'll port new templates into the Satori renderer once you settle on a design.
`;

export function buildBatchExport(batch: Batch): string {
  const visualPosts = batch.posts.filter(
    (p) => p.visualSpec !== null && p.visualSpec.slides.length > 0
  );

  const totalSlides = visualPosts.reduce(
    (sum, p) => sum + (p.visualSpec?.slides.length ?? 0),
    0
  );

  const lines: string[] = [];

  lines.push(`# LeanScale Visual Batch — ${batch.batchId}`);
  lines.push("");
  lines.push(
    `This is a batch export of ${visualPosts.length} visual posts (${totalSlides} total slides) for the LeanScale team's LinkedIn content. Design each slide as a 1080×1080 PNG following the brand spec below, then export each as PNG using the named asset paths.`
  );
  lines.push("");

  lines.push("---");
  lines.push("");
  lines.push("## Brand Spec");
  lines.push("");
  lines.push(CONDENSED_BRAND_SPEC);
  lines.push("");

  lines.push("---");
  lines.push("");
  lines.push("## Asset Naming Convention");
  lines.push("");
  lines.push(
    "Each slide below has a unique slide ID shown in backticks (e.g. `jake-sample-5-slide-02`). When you export a designed slide as PNG, name the file `{slide-id}.png`. The slides will be wired into the app at `/assets/{slide-id}.png`."
  );
  lines.push("");

  lines.push("---");
  lines.push("");
  lines.push(`## Posts (${visualPosts.length} total)`);
  lines.push("");

  for (const authorSlug of AUTHOR_ORDER) {
    const authorPosts = visualPosts.filter((p) => p.authorSlug === authorSlug);
    if (authorPosts.length === 0) continue;

    const meta = AUTHOR_META[authorSlug];
    lines.push("");
    lines.push(`### ${meta.name} · ${meta.role}`);
    lines.push("");

    for (const post of authorPosts) {
      lines.push("---");
      lines.push("");
      lines.push(`#### POST \`${post.id}\` · ${post.contentType}`);
      lines.push("");
      lines.push(`**Topic:** ${post.topicTitle}`);
      lines.push("");
      lines.push("**LinkedIn post text:**");
      lines.push("");
      lines.push(
        post.postText
          .split("\n")
          .map((l) => `> ${l}`)
          .join("\n")
      );
      lines.push("");

      const slides = post.visualSpec?.slides ?? [];
      lines.push(`**Slides (${slides.length}):**`);
      lines.push("");

      slides.forEach((slide, idx) => {
        const slideId = buildSlideId(post.id, idx);
        lines.push(`- **\`${slideId}.png\`** — template: \`${slide.template}\``);
        for (const [k, v] of Object.entries(slide.params)) {
          if (v === undefined || v === null || v === "") continue;
          if (Array.isArray(v)) {
            if (v.length === 0) continue;
            lines.push(`  - ${k}:`);
            v.forEach((item) => lines.push(`    - ${item}`));
          } else {
            lines.push(`  - ${k}: ${v}`);
          }
        }
        lines.push("");
      });
    }
  }

  lines.push("---");
  lines.push("");
  lines.push("## How to Use This Export");
  lines.push("");
  lines.push(
    "1. Paste this entire document into Claude.ai with the prompt: \"Design each of these slides as a 1080×1080 HTML/CSS artifact following the LeanScale Light Mode design system above. Each slide should follow the slide template indicated. Output as a single artifact with each slide as a separate container.\""
  );
  lines.push("2. Iterate on the designs in Claude.ai until they look right.");
  lines.push(
    "3. Export each slide as a PNG using the `{slide-id}.png` naming convention above."
  );
  lines.push(
    "4. Hand the PNG files back — they get committed to `public/assets/` and the app will use them automatically (with a Satori fallback for any slide without a custom PNG)."
  );
  lines.push("");

  return lines.join("\n");
}
