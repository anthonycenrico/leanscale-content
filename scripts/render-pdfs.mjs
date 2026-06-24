#!/usr/bin/env node
/**
 * Bundle each carousel post's rendered PNGs into a single LinkedIn-ready PDF.
 *
 * Why PDF: LinkedIn renders document carousels (PDFs) with native page
 * navigation and a swipe-through UI — better sequential UX than uploading a
 * multi-image post. Infographics stay as single PNGs (no sequence to render).
 *
 * Inputs:  output/<date>/posts.json AND public/assets/<slide-id>.png for every
 *          slide of every CAROUSEL post in the batch.
 * Outputs: public/assets/<post-id>.pdf  (one PDF per carousel post, pages at
 *          1080×1080 / 1pt-per-px to match the PNG canvas).
 *
 * Usage:  node scripts/render-pdfs.mjs <YYYY-MM-DD> [postId,postId,...]
 */
import { PDFDocument } from "pdf-lib";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");

function buildSlideId(postId, index) {
  return `${postId}-slide-${String(index + 1).padStart(2, "0")}`;
}

async function main() {
  const date = process.argv[2];
  if (!date) {
    console.error("Usage: node scripts/render-pdfs.mjs <YYYY-MM-DD> [postId,postId,...]");
    process.exit(1);
  }
  const onlyPostIds = (process.argv[3] || "").split(",").filter(Boolean);
  const postsPath = resolve(REPO, "output", date, "posts.json");
  if (!existsSync(postsPath)) {
    console.error(`Batch not found: ${postsPath}`);
    process.exit(1);
  }
  const batch = JSON.parse(readFileSync(postsPath, "utf-8"));
  const assetsDir = resolve(REPO, "public/assets");
  mkdirSync(assetsDir, { recursive: true });

  const carousels = batch.posts.filter(
    (p) => p.contentType === "CAROUSEL" && p.visualSpec && p.visualSpec.slides && p.visualSpec.slides.length > 0
  );
  const targets = onlyPostIds.length ? carousels.filter((p) => onlyPostIds.includes(p.id)) : carousels;

  console.log(`Bundling ${targets.length} carousel${targets.length === 1 ? "" : "s"} into PDFs → ${assetsDir}`);

  let written = 0;
  for (const post of targets) {
    const slides = post.visualSpec.slides;
    const pdf = await PDFDocument.create();
    const missing = [];
    for (let i = 0; i < slides.length; i++) {
      const slideId = buildSlideId(post.id, i);
      const pngPath = join(assetsDir, `${slideId}.png`);
      if (!existsSync(pngPath)) {
        missing.push(slideId);
        continue;
      }
      const pngBytes = readFileSync(pngPath);
      const img = await pdf.embedPng(pngBytes);
      const page = pdf.addPage([1080, 1080]);
      page.drawImage(img, { x: 0, y: 0, width: 1080, height: 1080 });
    }
    if (missing.length) {
      console.error(`  ${post.id}: missing PNGs — ${missing.join(", ")}. Run render-slides.mjs first.`);
      process.exit(2);
    }
    const pdfBytes = await pdf.save();
    const outPath = join(assetsDir, `${post.id}.pdf`);
    writeFileSync(outPath, pdfBytes);
    written++;
    const sizeKb = (pdfBytes.length / 1024).toFixed(0);
    process.stdout.write(`  [${written.toString().padStart(2, " ")}/${targets.length}] ${post.id}.pdf  (${slides.length} pages, ${sizeKb} KB)\n`);
  }
  console.log(`Done. Wrote ${written} PDF${written === 1 ? "" : "s"}.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
