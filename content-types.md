# LeanScale LinkedIn Content Types

The 9 canonical types the skill picks from when generating posts. Each post is tagged with exactly one type. The post-generation agent uses these definitions to match content type to topic kernel + author voice.

**Batch constraints (enforced by the skill):**
- Each author gets exactly 5 posts per batch
- Of those 5: exactly 1 must be CAROUSEL (multi-slide) and exactly 1 must be INFOGRAPHIC (single image). Both require structured `visualSpec` output.
- The remaining 3 posts mix the other 7 types

If you want to add a new type, append it here and update `skill/SKILL.md` so the agent knows about it.

---

## 1. CONTRARIAN HOOK

**Shape:** Polarizing or unexpected take in the opening line. Designed to stop the scroll.

**Length:** 3-7 short lines (60-120 words).

**Structure:**
- Line 1: bold claim that challenges conventional wisdom
- Lines 2-4: the why behind the contrarian take (often 2-3 reasons or examples)
- Last line: clean payoff, no question bait

**Hook examples:**
- "The CHRO is no longer the economic buyer for HR AI. IT is."
- "Most founders' first GTM hire after themselves is an AE. That's why most early AEs fail."
- "AI doesn't fail because the models are weak. It fails because your work is unstructured."

**When to use:** Topic kernel has a sharp POV that the reader will disagree with at first glance. The post earns its way by delivering proof in the body.

**When NOT to use:** Author voice avoids contrarian-bait openers (e.g., Jake, Cameron). Substitute with INDUSTRY OBSERVATION instead.

---

## 2. TACTICAL PLAYBOOK

**Shape:** "Here's how I do X" with concrete numbered steps. Reads like an SOP.

**Length:** 150-250 words.

**Structure:**
- Setup line: the problem this playbook solves
- Numbered steps (3-6 typically), each one specific and actionable
- Optional: a one-line "what you'll find" payoff
- Soft CTA at the end (e.g., "DM if you want the prompt")

**Hook examples:**
- "Here's the workflow we've helped a handful of B2B startups stand up:"
- "Open a Google Sheet. Column A: every recurring task you do this week."
- "The non-negotiable build order — the one we see work, repeatedly:"

**When to use:** Topic kernel is a how-to with discrete steps. Author has earned the right to be prescriptive in the domain.

**When NOT to use:** Topic is more of a thesis or pattern observation — use CONTRARIAN HOOK or INDUSTRY OBSERVATION.

---

## 3. PERSONAL STORY / VULNERABILITY

**Shape:** First-person narrative. Career arc, mistake, lesson learned, behind-the-scenes.

**Length:** 200-300 words.

**Structure:**
- Setup: the moment / decision / context
- Middle: what happened (often with a surprise turn)
- Lesson: what the author takes from it
- Quiet landing line (not a CTA)

**Hook examples:**
- "Best career advice I ever heard, paraphrased from a friend who's moved up the ranks faster than anyone I know:"
- "Hard to believe that today marks two incredible years at exactly the company I was meant to be a part of."
- "We rebuilt a client's lead routing in 3 days last month. First reaction internally was panic."

**When to use:** Topic kernel has a narrative arc the author has actually lived (or can credibly own). Especially good for milestone posts and "I learned this" reframes.

**When NOT to use:** Author voice avoids vulnerability-bait (Jake, Joe). The author has no actual experience with the topic. The lesson is generic.

---

## 4. INDUSTRY OBSERVATION

**Shape:** "What I'm seeing across X deals/conversations right now." Pattern-recognition voice. Authority-builder.

**Length:** 100-200 words.

**Structure:**
- Setup line: where the pattern shows up (e.g., "Across the last 60 days of conversations with CROs...")
- 2-4 observations, often as parallel bullets or short paragraphs
- Implication / "so what" landing

**Hook examples:**
- "Pattern we're seeing across the AI-native B2B startups we work with:"
- "Spent last week reviewing implementation models from six AI vendors a customer was evaluating."
- "Seeing a pattern across conversations the last few months."

**When to use:** Topic kernel is a pattern (not a one-off story or how-to). The author has a credible vantage point to see the pattern from.

**When NOT to use:** Author hasn't earned the right to claim the pattern (e.g., junior IC speaking about "what enterprise CROs are doing"). Topic is more of a hot take — use CONTRARIAN HOOK.

---

## 5. SOFT EDUCATIONAL

**Shape:** Explainer of one concept. No hook gymnastics. Teaches cleanly.

**Length:** 150-250 words.

**Structure:**
- Setup: a confusion or misunderstanding worth clearing up
- Body: the concept explained simply, often with a model or analogy
- Landing: a sentence that gives the reader the new mental model in their own pocket

**Hook examples:**
- "RevOps isn't 'is Salesforce clean?' It's the language your company uses to test, measure, learn, and decide."
- "There's a confusion I keep running into in conversations with founders about GTM engineering."
- "The three layers of GTM work explain why hiring AEs first almost never works."

**When to use:** Topic kernel is a conceptual model or framework worth teaching. Good top-of-funnel positioning content.

**When NOT to use:** Topic is too tactical (use TACTICAL PLAYBOOK) or too sharp (use CONTRARIAN HOOK).

---

## 6. CAROUSEL (multi-slide swipe-through)

**Shape:** Short caption pointing to a multi-slide deck. LinkedIn loads each slide as a swipeable card. Caption is bait + signal; the slides are the payoff.

**Length:** Caption is 80-120 words. Slide count is 4-6 typically.

**Structure:**
- Caption: hook line + 1-2 sentences telling readers what they'll get from swiping
- Slides: 4-6 slides, each 1080×1080 PNG, with a clear narrative arc (cover → body slides → closing CTA)

**Required:** Every CAROUSEL post MUST include a structured `visualSpec` field with a `slides` array. Each slide entry specifies a template (`cover`, `framework`, `listicle`, `stat`, `quote`, `dark`) and params.

**Hook examples (caption-side):**
- "We put together a simple visual on the non-negotiable build order — and where the wheels come off when you skip a step."
- "Built this prioritization matrix for our team. Swipe through."

**When to use:** Topic decomposes into 4-6 sequential beats. Framework that needs visual scaffolding. Comparison that benefits from a side-by-side per slide.

**When NOT to use:** Topic is a single argument that doesn't benefit from decomposition. Use INFOGRAPHIC (single image) or a text-only type instead.

---

## 7. INFOGRAPHIC (single dense image)

**Shape:** Single 1080×1080 image that carries the value. Caption introduces, the image teaches.

**Length:** Caption is 80-150 words. Visual is 1 slide.

**Structure:**
- Caption: hook + 1-3 sentences framing the visual + optional credit/CTA
- Image: a self-contained graphic — a 2×2 matrix, a comparison table, a process flow, a stat callout

**Required:** Every INFOGRAPHIC post MUST include a `visualSpec` field with exactly 1 slide entry. Same templates as CAROUSEL — typically `stat`, `listicle`, or a future custom infographic template.

**Hook examples:**
- "One image that explains the entire GTM build order. Save it for your next founder conversation."
- "5 things every Series B CRO underestimates. All in one visual."

**When to use:** A pattern, comparison, or framework that fits cleanly into one image. Top-of-funnel positioning that benefits from a shareable visual artifact.

**When NOT to use:** A story or argument that needs more than one beat of visual content — use CAROUSEL instead.

---

## 8. LISTICLE

**Shape:** "5 things..." / "7 mistakes..." Scannable, often numbered or implicitly bulleted.

**Length:** 150-250 words.

**Structure:**
- Hook line setting up the list ("5 things every founder gets wrong about GTM build order:")
- Numbered or bolded items, each with a one-line description
- Optional payoff line at the end

**Hook examples:**
- "Five RevOps tools we ship with every quarter:"
- "Three patterns we found in the first 30 days of running AI-extracted MEDDIC against rep input:"
- "Here's what we build with daily at LeanScale to compress the middle:"

**When to use:** Topic kernel decomposes naturally into a small number of items. High shareability. Author voice tolerates list-style posts (Joe's bread and butter).

**When NOT to use:** The items don't share a coherent through-line. The post would be more powerful as a single argument.

---

## 9. CASE STUDY SNIPPET

**Shape:** "We helped a [stage] [type of] company do X. Here's what happened."

**Length:** 150-250 words.

**Structure:**
- Setup: the customer (often anonymized or named) and the problem
- The intervention
- The result (concrete numbers or qualitative outcomes)
- The lesson or generalization

**Hook examples:**
- "We recently rebuilt a chunk of our GTM diagnostic delivery using AI workflows."
- "Spent last week reviewing implementation models from six AI vendors a customer was evaluating."
- "We helped a Series B SaaS company collapse their lead-to-opportunity cycle from 14 days to 36 hours."

**When to use:** Topic kernel has a concrete real-world example with measurable outcome. Strong proof-point for buyer-facing content.

**When NOT to use:** The example is fabricated or stretches credibility. The outcome isn't specific.

Pairs well with a screenshot, before/after visual, or workflow diagram.

---

## Notes on combining types

- A single post is tagged with exactly ONE type. Don't mix.
- A topic kernel can be expressed as multiple types — that's why the post-gen agent picks the type that best matches the author's voice and the variety constraints (no more than 2 of the same type per author per batch).
- If a topic genuinely doesn't fit any of these 8 types, escalate it — either the topic needs reframing or we need a new content type added to this taxonomy.
