# Visual Templates

This folder holds the React components used by the Satori PNG renderer at `app/api/og/route.tsx`.

## Current state

The renderer ships with **3 placeholder templates** baked into `route.tsx` itself:

- `cover` — Hero card with kicker + big title + body
- `quote` — Lime-background pull-quote card with corner mark
- `framework` — Numbered framework card (number + title + description)

These are placeholders pending the **Claude Design template exports**.

## Migrating Claude Design templates here

Once Anthony exports his templates from Claude.ai (Artifacts → "convert to React component"):

1. Drop the exported `.tsx` file into this folder, named after the template (e.g., `comparison-matrix.tsx`).
2. The component MUST be a function returning JSX with **inline styles** (Satori does not support external CSS or className mapping — only inline `style` props).
3. Use the LeanScale color tokens directly:
   ```ts
   const COLORS = {
     bgPage: "#1A1A1A",
     offWhite: "#FFFBFF",
     lime: "#E8FFCF",
     mediumPurple: "#D9AFD0",
     strongPurple: "#642585",
     limeInk: "#1A2410",
   };
   ```
4. Update `app/api/og/route.tsx` — import the new template and add a `case` to the switch statement in `renderTemplate()`.
5. Update the comment block at the top of `route.tsx` documenting the new template name + expected URL params.
6. Reference the new template name in the relevant `voices/*.md` `visualAssetNeeded` specs and in `prompts/post-generation.md` so the skill knows it exists.

## Satori gotchas

- **No CSS files, no Tailwind, no className.** Inline `style` only.
- **No `box-shadow`, no `backdrop-filter`, no `transform`.** These silently fail to render.
- **No `flex-wrap`.** Use multi-line text or a vertical stack instead.
- **Fonts:** Satori needs fonts loaded explicitly. Plus Jakarta Sans is currently inherited from the default Inter fallback — to use the actual brand font, pass a `fonts` array to `ImageResponse`. We'll add this when Claude Design templates land (they'll need the brand font for fidelity).
- **Images:** `<img>` works for absolute URLs and inline base64. Local file imports do not work in Edge runtime.

## Template naming convention

- `cover.tsx` — opening slide of a carousel
- `quote.tsx` — pull-quote / highlight panel
- `framework.tsx` — numbered framework explainer
- `matrix.tsx` — 2x2 or table comparison
- `before-after.tsx` — side-by-side comparison
- `listicle.tsx` — bulleted list slide
- `closing.tsx` — final CTA slide

Match this naming when porting Claude Design exports.
