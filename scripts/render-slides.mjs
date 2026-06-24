#!/usr/bin/env node
/**
 * LeanScale slide renderer — Phase 1.5 of /ghostwrite.
 *
 * Reads posts.json for a batch, renders every CAROUSEL/INFOGRAPHIC slide as
 * 2160×2160 PNG using the LeanScale Design System (Plus Jakarta Sans, brand
 * tokens, real LeanScale Venn logo), writes to public/assets/<slide-id>.png.
 *
 * Usage:  node scripts/render-slides.mjs <YYYY-MM-DD> [postId,postId,...]
 */
import { chromium } from "playwright";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const ASSETS_DIR = resolve(REPO, "scripts/render-assets");
const toDataUrl = (p) => `data:image/png;base64,${readFileSync(p).toString("base64")}`;
const LOGO_BLACK = toDataUrl(join(ASSETS_DIR, "leanscale-logo-black.png"));
const LOGO_WHITE = toDataUrl(join(ASSETS_DIR, "leanscale-logo-white.png"));

const COLORS = {
  offWhite: "#FFFBFF",
  lightGray: "#E9E9E7",
  darkGray: "#595959",
  black: "#000000",
  darkPurple: "#301934",
  strongPurple: "#642585",
  mediumPurple: "#D9AFD0",
  lime: "#E8FFCF",
};

// ---------------- HTML helpers ----------------

const escape = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const PAGE = ({ body, scheme = "light" }) => {
  const isDark = scheme === "dark";
  const isLime = scheme === "lime";
  const bg =
    scheme === "dark" ? COLORS.darkPurple :
    scheme === "lime" ? COLORS.lime :
    COLORS.offWhite;
  const fg = isDark ? COLORS.offWhite : COLORS.black;
  return /* html */ `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap">
<style>
  :root {
    --bg: ${bg};
    --fg: ${fg};
    --accent: ${isDark ? COLORS.mediumPurple : COLORS.strongPurple};
    --muted: ${isDark ? "rgba(255,251,255,0.62)" : COLORS.darkGray};
    --hairline: ${isDark ? "rgba(217,175,208,0.22)" : COLORS.lightGray};
    --lime: ${COLORS.lime};
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: var(--bg); }
  body {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    color: var(--fg);
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }
  .slide {
    width: 1080px; height: 1080px;
    background: var(--bg);
    color: var(--fg);
    position: relative;
    padding: 88px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .tag {
    font-weight: 300;
    font-size: 18px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
  }
  .footer {
    margin-top: auto;
    padding-top: 28px;
    border-top: 1px solid var(--hairline);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .footer .logo { display: flex; align-items: center; gap: 14px; }
  .footer .logo img { height: 30px; width: auto; display: block; opacity: ${isDark ? 0.95 : 1}; }
  .footer .logo span { font-weight: 500; letter-spacing: 0.18em; }
  .footer .page { font-variant-numeric: tabular-nums; font-weight: 500; }

  .cover-title {
    font-weight: 500;
    font-size: 96px;
    line-height: 0.98;
    letter-spacing: -0.025em;
    color: var(--fg);
    max-width: 880px;
  }
  .cover-body {
    margin-top: 36px;
    font-weight: 500;
    font-size: 28px;
    line-height: 1.4;
    color: var(--muted);
    max-width: 800px;
  }

  .framework-row { display: flex; gap: 56px; align-items: center; flex: 1; }
  .framework-num {
    font-weight: 200;
    font-size: 200px;
    line-height: 0.85;
    letter-spacing: -0.04em;
    color: var(--accent);
    font-variant-numeric: tabular-nums;
    min-width: 240px;
    white-space: nowrap;
  }
  .framework-body { flex: 1; }
  .framework-title {
    font-weight: 500;
    font-size: 72px;
    line-height: 1.04;
    letter-spacing: -0.02em;
    color: var(--fg);
  }
  .framework-body-text {
    margin-top: 28px;
    font-weight: 500;
    font-size: 26px;
    line-height: 1.42;
    color: var(--muted);
  }

  .dark-title {
    font-weight: 500;
    font-size: 80px;
    line-height: 1.0;
    letter-spacing: -0.025em;
    color: var(--fg);
    max-width: 880px;
  }
  .dark-accent-bar {
    width: 80px; height: 6px;
    background: var(--lime);
    margin-bottom: 36px;
  }
  .dark-body {
    margin-top: 32px;
    font-weight: 500;
    font-size: 28px;
    line-height: 1.42;
    color: var(--muted);
    max-width: 860px;
  }

  .stat-num {
    font-weight: 200;
    font-size: 360px;
    line-height: 0.88;
    letter-spacing: -0.04em;
    color: var(--accent);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .stat-label {
    margin-top: 12px;
    font-weight: 500;
    font-size: 40px;
    line-height: 1.2;
    letter-spacing: -0.015em;
    color: var(--fg);
    max-width: 880px;
  }
  .stat-body {
    margin-top: 28px;
    font-weight: 500;
    font-size: 24px;
    line-height: 1.42;
    color: var(--muted);
    max-width: 800px;
  }

  .listicle-title {
    font-weight: 500;
    font-size: 52px;
    line-height: 1.08;
    letter-spacing: -0.02em;
    color: var(--fg);
    margin-bottom: 28px;
    max-width: 880px;
  }
  .listicle-items { display: flex; flex-direction: column; }
  .listicle-row {
    display: flex; gap: 28px;
    padding: 22px 0;
    border-top: 1px solid var(--hairline);
    font-size: 26px; line-height: 1.32;
    font-weight: 500;
    color: var(--fg);
    align-items: flex-start;
  }
  .listicle-row:last-child { border-bottom: 1px solid var(--hairline); }
  .listicle-num {
    font-weight: 300;
    font-size: 28px;
    letter-spacing: -0.01em;
    color: var(--accent);
    font-variant-numeric: tabular-nums;
    min-width: 56px;
  }
  .listicle-row span.text { flex: 1; }

  .quote-mark {
    font-weight: 200;
    font-size: 280px;
    line-height: 0.7;
    color: var(--accent);
    margin-bottom: 28px;
  }
  .quote-text {
    font-weight: 500;
    font-size: 60px;
    line-height: 1.18;
    letter-spacing: -0.018em;
    color: var(--fg);
    max-width: 880px;
  }
  .quote-attrib {
    margin-top: 36px;
    font-weight: 500;
    font-size: 24px;
    letter-spacing: 0.02em;
    color: var(--muted);
  }
  .quote-attrib::before { content: "— "; }

  .stack { display: flex; flex-direction: column; gap: 28px; flex: 1; justify-content: center; }
  .top-row {
    display: flex; align-items: center;
    margin-bottom: ${"32px"};
  }
</style>
</head>
<body>
${body}
</body>
</html>`;
};

const footer = (pageInfo, scheme) => {
  const isDark = scheme === "dark";
  const logoSrc = isDark ? LOGO_WHITE : LOGO_BLACK;
  return /* html */ `<div class="footer">
    <div class="logo"><img src="${logoSrc}" alt="LeanScale"><span>www.leanscale.team</span></div>
    <div class="page">${pageInfo}</div>
  </div>`;
};

// ---------------- Templates ----------------

function renderCover(p, pageInfo) {
  const body = /* html */ `
    <div class="slide">
      <div class="top-row"><div class="tag">${escape(p.kicker || "")}</div></div>
      <div class="stack" data-audit="stack" style="justify-content: center;">
        <div class="cover-title" data-audit="cover-title">${escape(p.title || "")}</div>
        ${p.body ? `<div class="cover-body" data-audit="cover-body">${escape(p.body)}</div>` : ""}
      </div>
      ${footer(pageInfo, "light")}
    </div>`;
  return PAGE({ body, scheme: "light" });
}

function renderFramework(p, pageInfo, scheme = "light") {
  const body = /* html */ `
    <div class="slide">
      <div class="top-row"><div class="tag">${escape(p.kicker || "")}</div></div>
      <div class="framework-row" data-audit="stack">
        <div class="framework-num" data-fit-width="true" data-audit="framework-num">${escape(p.num || "01")}</div>
        <div class="framework-body">
          <div class="framework-title" data-audit="framework-title">${escape(p.title || "")}</div>
          ${p.body ? `<div class="framework-body-text" data-audit="framework-body">${escape(p.body)}</div>` : ""}
        </div>
      </div>
      ${footer(pageInfo, scheme)}
    </div>`;
  return PAGE({ body, scheme });
}

function renderDark(p, pageInfo) {
  const body = /* html */ `
    <div class="slide">
      <div class="top-row"><div class="tag">${escape(p.kicker || "")}</div></div>
      <div class="stack" data-audit="stack" style="justify-content: center;">
        <div>
          <div class="dark-accent-bar"></div>
          <div class="dark-title" data-audit="dark-title">${escape(p.title || "")}</div>
          ${p.body ? `<div class="dark-body" data-audit="dark-body">${escape(p.body)}</div>` : ""}
        </div>
      </div>
      ${footer(pageInfo, "dark")}
    </div>`;
  return PAGE({ body, scheme: "dark" });
}

function renderStat(p, pageInfo) {
  const body = /* html */ `
    <div class="slide">
      <div class="top-row"><div class="tag">${escape(p.kicker || "")}</div></div>
      <div class="stack" data-audit="stack" style="justify-content: center;">
        <div class="stat-num" data-fit-width="true" data-audit="stat-num">${escape(p.stat || p.title || "")}</div>
        ${p.statLabel ? `<div class="stat-label" data-audit="stat-label">${escape(p.statLabel)}</div>` : ""}
        ${p.body ? `<div class="stat-body" data-audit="stat-body">${escape(p.body)}</div>` : ""}
      </div>
      ${footer(pageInfo, "light")}
    </div>`;
  return PAGE({ body, scheme: "light" });
}

function renderListicle(p, pageInfo) {
  const items = (p.items || []).slice(0, 6);
  const rows = items.map((item, idx) => /* html */ `
    <div class="listicle-row" data-audit="listicle-row">
      <span class="listicle-num">${String(idx + 1).padStart(2, "0")}</span>
      <span class="text">${escape(item)}</span>
    </div>`).join("");
  const body = /* html */ `
    <div class="slide">
      <div class="top-row"><div class="tag">${escape(p.kicker || "")}</div></div>
      <div class="stack" data-audit="stack" style="justify-content: center; gap: 0;">
        ${p.title ? `<div class="listicle-title" data-audit="listicle-title">${escape(p.title)}</div>` : ""}
        <div class="listicle-items">${rows}</div>
      </div>
      ${footer(pageInfo, "light")}
    </div>`;
  return PAGE({ body, scheme: "light" });
}

function renderQuote(p, pageInfo) {
  const body = /* html */ `
    <div class="slide">
      <div class="top-row"><div class="tag">${escape(p.kicker || "")}</div></div>
      <div class="stack" data-audit="stack" style="justify-content: center;">
        <div>
          <div class="quote-mark">"</div>
          <div class="quote-text" data-audit="quote-text">${escape(p.title || "")}</div>
          ${p.body ? `<div class="quote-attrib" data-audit="quote-attrib">${escape(p.body)}</div>` : ""}
        </div>
      </div>
      ${footer(pageInfo, "lime")}
    </div>`;
  return PAGE({ body, scheme: "lime" });
}

function renderSlide(template, params, pageInfo) {
  switch (template) {
    case "cover":     return renderCover(params, pageInfo);
    case "framework": return renderFramework(params, pageInfo, "light");
    case "dark":      return renderDark(params, pageInfo);
    case "stat":      return renderStat(params, pageInfo);
    case "listicle":  return renderListicle(params, pageInfo);
    case "quote":     return renderQuote(params, pageInfo);
    default:          return renderCover(params, pageInfo);
  }
}

// ---------------- Main ----------------

function buildSlideId(postId, index) {
  return `${postId}-slide-${String(index + 1).padStart(2, "0")}`;
}

async function main() {
  const date = process.argv[2];
  if (!date) {
    console.error("Usage: node scripts/render-slides.mjs <YYYY-MM-DD> [postId,postId,...]");
    process.exit(1);
  }
  const onlyPostIds = (process.argv[3] || "").split(",").filter(Boolean);
  const postsPath = resolve(REPO, "output", date, "posts.json");
  if (!existsSync(postsPath)) {
    console.error(`Batch not found: ${postsPath}`);
    process.exit(1);
  }
  const batch = JSON.parse(readFileSync(postsPath, "utf-8"));
  const outDir = resolve(REPO, "public/assets");
  mkdirSync(outDir, { recursive: true });

  const visualPosts = batch.posts.filter(p => p.visualSpec && p.visualSpec.slides && p.visualSpec.slides.length > 0);
  const targets = onlyPostIds.length ? visualPosts.filter(p => onlyPostIds.includes(p.id)) : visualPosts;
  const totalSlides = targets.reduce((n, p) => n + p.visualSpec.slides.length, 0);
  console.log(`Rendering ${totalSlides} slides across ${targets.length} posts → ${outDir}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1080 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  let written = 0;
  const failures = [];
  for (const post of targets) {
    const slides = post.visualSpec.slides;
    const total = slides.length;
    for (let i = 0; i < total; i++) {
      const slide = slides[i];
      const pageInfo = total === 1 ? "INFOGRAPHIC" : `${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
      const html = renderSlide(slide.template, slide.params || {}, pageInfo);
      await page.setContent(html, { waitUntil: "networkidle" });
      // Wait for Plus Jakarta Sans to finish loading
      await page.evaluate(() => document.fonts.ready);
      // Auto-fit any [data-fit-width] element by shrinking font-size until scrollWidth fits
      // its own allocated clientWidth (the box flex/grid actually gave it).
      await page.evaluate(() => {
        document.querySelectorAll('[data-fit-width="true"]').forEach((el) => {
          let size = parseFloat(getComputedStyle(el).fontSize);
          const minSize = size * 0.35;
          let guard = 80;
          while (el.scrollWidth > el.clientWidth + 1 && size > minSize && guard-- > 0) {
            size *= 0.93;
            el.style.fontSize = size + "px";
          }
        });
      });
      // Layout audit: real defects are horizontal overflow OR content crashing into the footer.
      // We do NOT check per-element vertical scroll — tight line-heights (line-height < 1.1) cause
      // false positives where the glyph extent exceeds the line-box by design.
      const issues = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll("[data-audit]").forEach((el) => {
          const key = el.getAttribute("data-audit");
          if (el.scrollWidth > el.clientWidth + 2) {
            out.push({ where: key, kind: "h-overflow", got: el.scrollWidth, max: el.clientWidth });
          }
        });
        // Stack content shouldn't crash into the footer.
        const stack = document.querySelector('[data-audit="stack"]');
        const footer = document.querySelector(".footer");
        if (stack && footer) {
          const sb = stack.getBoundingClientRect().bottom;
          const ft = footer.getBoundingClientRect().top;
          if (sb > ft + 2) out.push({ where: "stack-vs-footer", kind: "collision", got: sb, max: ft });
        }
        // Slide-level: anything escaping the 1080 canvas.
        const slide = document.querySelector(".slide");
        if (slide && slide.scrollHeight > 1080 + 2) {
          out.push({ where: "slide", kind: "canvas-overflow", got: slide.scrollHeight, max: 1080 });
        }
        return out;
      });
      const filename = `${buildSlideId(post.id, i)}.png`;
      const filePath = join(outDir, filename);
      await page.screenshot({ path: filePath, type: "png", omitBackground: false, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
      written++;
      const mark = issues.length ? `FAIL ${issues.length}` : "ok";
      process.stdout.write(`  [${written.toString().padStart(2, " ")}/${totalSlides}] ${filename}  ${mark}\n`);
      if (issues.length) failures.push({ slide: filename, issues });
    }
  }
  await browser.close();
  console.log(`Done. Wrote ${written} PNG${written === 1 ? "" : "s"} to public/assets/`);
  if (failures.length) {
    console.error(`\nLayout QA — ${failures.length} slide${failures.length === 1 ? "" : "s"} have content that does not fit:`);
    for (const f of failures) {
      console.error(`  ${f.slide}`);
      for (const i of f.issues) {
        console.error(`    · ${i.where} — ${i.kind} (got ${Math.round(i.got)} / max ${Math.round(i.max)})`);
      }
    }
    console.error(`\nFix: shorten the offending visualSpec.params field in output/<date>/posts.json, then re-render just that post:`);
    console.error(`  node scripts/render-slides.mjs <date> <postId>`);
    process.exit(2);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
