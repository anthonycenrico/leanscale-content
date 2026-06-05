import type { SlideSpec, Post, Batch, AuthorSlug, VisualSpec } from "./types";
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
   Per-post design brief — for the "tweak it yourself" workflow
   ============================================================ */

const TEMPLATE_PURPOSE: Record<string, string> = {
  cover: "Cover / title slide — opens the set and frames the core idea.",
  framework: "Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.",
  listicle: "List slide — a short titled list, each item on its own row.",
  stat: "Stat slide — one big hero metric dominates, with a label beneath and a line of context.",
  quote: "Quote slide — a pulled quote treated as the hero, with attribution.",
  dark: "Closing slide — the final takeaway / sign-off.",
};

function padNum(n: number): string {
  return String(n + 1).padStart(2, "0");
}

function slideCopyLines(slide: SlideSpec): string[] {
  const pr = slide.params;
  const out: string[] = [];
  const add = (label: string, val?: string) => {
    if (val) out.push(`  - ${label}: ${val}`);
  };
  add("Step number", pr.num);
  add("Eyebrow", pr.kicker);
  add("Big number / metric", pr.stat);
  add("Metric label", pr.statLabel);
  add(slide.template === "quote" ? "Quote" : "Headline", pr.title);
  add(slide.template === "quote" ? "Attribution" : "Supporting text", pr.body);
  if (pr.items && pr.items.length) {
    out.push("  - List items:");
    pr.items.forEach((it) => out.push(`    - ${it}`));
  }
  return out;
}

/**
 * Produces a clean, design-system-free brief for a single visual post —
 * the thing a team member copies into Claude Design to tweak the look
 * themselves. Claude Design already has the brand, so this is content + concept
 * only. Pass the effective spec (which may be a regenerated override).
 */
export function buildPostDesignBrief(
  post: Post,
  spec?: VisualSpec | null,
  includeExportNote = true
): string {
  const vs = spec ?? post.visualSpec;
  if (!vs || vs.slides.length === 0) return "";
  const slides = vs.slides;
  const isCarousel = slides.length > 1;
  const L: string[] = [];

  L.push(`${isCarousel ? "CAROUSEL" : "INFOGRAPHIC"} — ${post.topicTitle}`);
  L.push("");
  L.push(
    isCarousel
      ? `Asset type: LinkedIn carousel — ${slides.length} swipeable slides. Design each as its own 1080×1080 frame and export each as a separate PNG.`
      : `Asset type: single infographic image (1080×1080) — one dense graphic that lands the point at a glance.`
  );
  L.push("");
  L.push("The LinkedIn post this pairs with (context for the design):");
  L.push("");
  L.push(post.postText.split("\n").map((l) => (l.trim() === "" ? ">" : "> " + l)).join("\n"));
  L.push("");

  if (isCarousel) {
    L.push("Design the carousel slide by slide:");
    L.push("");
    slides.forEach((sl, i) => {
      L.push(`Slide ${padNum(i)} — ${buildSlideId(post.id, i)}.png  ·  ${TEMPLATE_PURPOSE[sl.template] || sl.template}`);
      slideCopyLines(sl).forEach((l) => L.push(l));
      L.push("");
    });
  } else {
    L.push(`The infographic — ${buildSlideId(post.id, 0)}.png:`);
    L.push("");
    if (post.visualAssetNeeded) {
      L.push(`Concept: ${post.visualAssetNeeded}`);
      L.push("");
    }
    L.push("Copy + elements to include:");
    slideCopyLines(slides[0]).forEach((l) => L.push(l));
    L.push("");
  }

  L.push(
    "Keep the slide IDs above as the exported PNG filenames so the new versions wire back into the app automatically. (Claude Design already has the LeanScale brand — no need to specify colors or fonts.)"
  );
  if (includeExportNote) {
    L.push("");
    L.push(EXPORT_QUALITY_NOTE);
  }
  return L.join("\n");
}

/* ============================================================
   Export-quality guidance — included in every design handoff
   ============================================================ */

const EXPORT_QUALITY_NOTE = `EXPORT QUALITY — bake these in so the PNGs come out crisp and on-brand:
- Export at 2× resolution: 2160×2160 per slide (render at pixelRatio 2, not 1). 1080×1080 looks soft when viewed or scaled larger; 2160 downscales cleanly for LinkedIn.
- Do NOT use an SVG <mask> for the logo or any brand mark. DOM-to-image renderers don't reproduce masks faithfully and the mark drifts between exports. Use a geometric clip-path (or plain shapes) so the mark renders identically every time.
- Reload and visually confirm the brand mark renders correctly BEFORE exporting.
- Keep the exact slide-ID filename for each PNG ({slide-id}.png) so it wires straight back into the app.`;

/* ============================================================
   Batch export — the full design handoff doc (Copy for Claude Design)
   ============================================================ */

export function buildBatchExport(batch: Batch): string {
  const visualPosts = batch.posts.filter(
    (p) => p.visualSpec !== null && p.visualSpec.slides.length > 0
  );
  const carousels = visualPosts.filter((p) => (p.visualSpec?.slides.length ?? 0) > 1);
  const infographics = visualPosts.filter((p) => (p.visualSpec?.slides.length ?? 0) === 1);
  const totalSlides = visualPosts.reduce(
    (sum, p) => sum + (p.visualSpec?.slides.length ?? 0),
    0
  );

  const L: string[] = [];
  L.push(`# LeanScale Visual Batch — ${batch.batchId}`);
  L.push("");
  L.push(
    `${visualPosts.length} visual assets — ${carousels.length} carousels + ${infographics.length} infographics (${totalSlides} slides total).`
  );
  L.push("");
  L.push(
    "Paste this whole doc into Claude Design. It already has the LeanScale brand system, so this is content + concept only — no colors, fonts, or tokens. Each asset is labeled CAROUSEL (multi-slide) or INFOGRAPHIC (single image); the dimensions differ. Design each, then export each slide / image as a PNG named with its slide ID so it wires back into the app."
  );
  L.push("");
  L.push(EXPORT_QUALITY_NOTE);
  L.push("");
  L.push("---");

  for (const slug of AUTHOR_ORDER) {
    const authorPosts = visualPosts
      .filter((p) => p.authorSlug === slug)
      .sort((a, b) => (b.visualSpec?.slides.length ?? 0) - (a.visualSpec?.slides.length ?? 0));
    if (authorPosts.length === 0) continue;
    const meta = AUTHOR_META[slug];
    L.push("");
    L.push(`## ${meta.name} · ${meta.role}`);
    L.push("");
    for (const post of authorPosts) {
      L.push(buildPostDesignBrief(post, undefined, false));
      L.push("");
      L.push("---");
    }
  }

  return L.join("\n");
}
