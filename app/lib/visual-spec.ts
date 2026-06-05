import type { SlideSpec } from "./types";

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
 * Generates a clean filename for downloading a slide PNG.
 * Format: {post-id}-slide-{NN}.png
 */
export function buildSlideFilename(postId: string, index: number): string {
  const num = String(index + 1).padStart(2, "0");
  return `${postId}-slide-${num}.png`;
}
