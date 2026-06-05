# LeanScale Visual Batch — 2026-06-05

**10 visual posts** · 5 carousels + 5 infographics · **30 total slides to design**

This document is a complete design brief. Paste the whole thing into Claude (claude.ai) with this prompt:

> _"Design each slide below as a 1080×1080 HTML/CSS artifact following the LeanScale Light Mode design system. Render each slide as its own container so I can screenshot/export each as a PNG. Use the exact slide ID as a caption or data attribute on each container so I can name the files correctly."_

Then export each designed slide as a PNG named with its **slide ID** (shown in backticks below). Send the PNGs back and they get wired into the app at `/assets/{slide-id}.png` automatically.

---

## LeanScale Light Mode — Design System

Design every slide as a **1080×1080 PNG** (square — LinkedIn carousel + infographic format).

**Colors (use exact tokens, never improvise):**
- Page background: `#FFFBFF` (warm off-white — NEVER pure white)
- Dark inverse surface: `#301934` (deep aubergine — for closing/dark slides)
- Light gray surface: `#E9E9E7`
- Primary accent: `#642585` (strong purple — tags, big numerals, primary marks on light)
- Dark-section accent: `#D9AFD0` (medium purple — accents on dark surfaces only)
- Callout: `#E8FFCF` (lime — ONLY for the quote slide background, badges, the occasional callout)
- Ink on light: `#000000` (true black — the warm bg keeps it readable)
- Body / muted: `#595959`
- Ink on lime panels: `#1A2410` / `#0B0B0B` (NEVER off-white on lime)
- Ink on dark sections: `#FFFBFF`

**Typography — Plus Jakarta Sans only (system-ui fallback):**
- Body default weight: **500** (medium) — never 400 against the warm bg
- Tags / eyebrows: **300** (light), UPPERCASE, **0.18em** letter-spacing — the signature LeanScale detail
- Headings: **500**, `-0.01em` tracking — NEVER bold (700)
- Big numerals (stat values, step numbers): **300** (light) — architectural, not aggressive

**Geometry & rules:**
- Padding 80–96px from slide edges
- Corner radius: 0 on full-bleed surfaces, 4–8px on cards, 999px ONLY on small chip badges
- Purple-tinted shadows only: `rgba(48,25,52,0.08)` → `rgba(48,25,52,0.14)`
- NO gradients, NO glassmorphism, NO decorative shadows, NO emojis (use real ★ and → glyphs), NO rounded corners past 16px
- Footer on every slide: just `www.leanscale.team` (small, muted, uppercase, 0.18em tracking) — no other label

**Slide template repertoire** (each slide below names one — match its layout):
- **cover** — opening slide: eyebrow (kicker) + big display headline + optional lede (body)
- **framework** — numbered step: huge light-weight purple numeral (num) + title + body
- **listicle** — eyebrow + title + 3–6 items, each on a hairline-divided row with a small purple index
- **stat** — eyebrow + one huge purple value (stat) + bold label (statLabel) + body
- **quote** — LIME background, dark-purple ink: eyebrow + the quote (title) + attribution (body)
- **dark** — deep aubergine closing slide: medium-purple eyebrow + off-white headline (title) + body

You may elevate these layouts (add a subtle 2×2, a sequence arrow, a comparison split) as long as you stay on-brand. We'll fold strong new layouts back into the renderer.

---

## Asset Naming Convention

Each slide has a unique **slide ID** in backticks (e.g. `anthony-20260605-4-slide-01`). Export that slide as `{slide-id}.png`. The app already knows these paths — drop the PNGs in and they appear.

---

## The 10 Visual Posts


### Anthony Enrico · Co-founder & CEO

---

#### CAROUSEL · `anthony-20260605-4` · 5 slides

**Topic:** Why, What, How: The Three Layers of GTM Work

<details><summary>LinkedIn post text (for context)</summary>

> **'We have an AI engineer now, so we don't need a RevOps leader.'**
> 
> I hear a version of this every week. It's how I know a GTM org is about to find out what's actually missing.
> 
> There are three layers to GTM work, and AI only collapses one of them.
> 
> The CEO and CRO own the Why. The VP of RevOps owns the What. GTM engineering owns the How.
> 
> Cut the What layer and you don't get a leaner org — you get a beautifully engineered system solving the wrong problem.
> 
> Swipe through for the breakdown of all three layers, what each one owns, and the exact place AI-first orgs are about to discover a gap.

</details>

**Slides:**

**Slide 01** — `anthony-20260605-4-slide-01.png` — template: `cover`
- kicker: GTM OPERATING SYSTEM
- title: Why, What, How.
- body: The three layers of GTM work — and the one AI is fooling executives into cutting.

**Slide 02** — `anthony-20260605-4-slide-02.png` — template: `framework`
- kicker: LAYER ONE
- num: 01
- title: The Why — owned by CEO + CRO.
- body: What market we attack, what the motion is, what winning means this year. Strategy. AI doesn't touch this.

**Slide 03** — `anthony-20260605-4-slide-03.png` — template: `framework`
- kicker: LAYER TWO
- num: 02
- title: The What — owned by VP of RevOps.
- body: Translating strategy into process, data architecture, and measurement. The layer that scales you from 5 reps to 100.

**Slide 04** — `anthony-20260605-4-slide-04.png` — template: `framework`
- kicker: LAYER THREE
- num: 03
- title: The How — owned by GTM engineering.
- body: Systems, integrations, agents, automations that make the What run. This is the layer AI actually collapses.

**Slide 05** — `anthony-20260605-4-slide-05.png` — template: `dark`
- kicker: THE GAP
- title: Cut the What and the How solves the wrong problem.
- body: AI is raising the floor. It is not deciding what gets built, or why.

---

#### INFOGRAPHIC · `anthony-20260605-3` · 1 slide

**Topic:** AI Won't Cut Your Headcount Until You Fix Your Data

<details><summary>LinkedIn post text (for context)</summary>

> **Boards are mandating RevOps headcount cuts because AI is 'supposed to absorb the work.' They're skipping the most expensive step.**
> 
> You cannot layer agents on bad data and inconsistent process and expect savings. The agents just fail faster and louder.
> 
> The uncomfortable truth: the investment to reduce headcount has to happen *before* the reduction. Standardize the process. Rebuild the data model. Get the definitions agreed-upon and verifiable. Then the agent layer compounds.
> 
> Most leadership teams want the cost-out story without the capex story. It doesn't work that way.
> 
> I built the math into one image. Save it for your next board conversation about 'just using AI.'

</details>

**Slides:**

**Slide 01** — `anthony-20260605-3-slide-01.png` — template: `framework`
- kicker: AI + HEADCOUNT
- num: 01
- title: Sequence is the whole game.
- body: Cut first, backfill with agents → quietly rehiring under new titles. Fund data + process first → running 30-40% leaner. The investment comes BEFORE the cut.


### Joe Zaghloul · Chief Operating Officer

---

#### CAROUSEL · `joe-20260605-5` · 5 slides

**Topic:** The Build Order: CRO, Then RevOps, Then Enablement, Then AEs

<details><summary>LinkedIn post text (for context)</summary>

> Most founders we talk to want to hire their first AE before they've hired their CRO.
> 
> It's the #1 reason early AEs fail.
> 
> We put together a simple visual on the non-negotiable build order for a B2B GTM org — and exactly where the wheels come off when you skip a step.
> 
> Swipe through to see:
> 
> The sequence we've watched work across 50+ hyper-growth startups (Mistral AI, Clio, Chainguard, and others)
> 
> The two roles that have to be in seat BEFORE the first AE
> 
> What ramp looks like when an AE hits a built machine vs. chaos
> 
> Where fractional RevOps fits early (and where it doesn't)
> 
> Full breakdown is also up on docs.leanscale.team for anyone who'd rather read than swipe. 🫡
> 
> #revops #gtm #startups

</details>

**Slides:**

**Slide 01** — `joe-20260605-5-slide-01.png` — template: `cover`
- kicker: B2B GTM
- title: The Build Order.
- body: From 50+ hyper-growth implementations — Mistral AI, Clio, Chainguard, and counting.

**Slide 02** — `joe-20260605-5-slide-02.png` — template: `framework`
- kicker: THE SEQUENCE
- num: 01
- title: CRO first. Then RevOps + Enablement. Then AEs.
- body: Skip a phase and the AE walks into chaos. Hit the order and they ramp in weeks, not quarters.

**Slide 03** — `joe-20260605-5-slide-03.png` — template: `listicle`
- kicker: RAMP TIME
- title: AE into a built machine vs. chaos.
- items:
  - Built machine — 30-60 day ramp
  - Chaos — 6+ month ramp, or never
  - The difference: RevOps and Enablement in seat first

**Slide 04** — `joe-20260605-5-slide-04.png` — template: `listicle`
- kicker: OWNERSHIP
- title: What each role owns in the first 90 days.
- items:
  - CRO — strategy, comp, forecast
  - RevOps — data, process, tooling
  - Enablement — onboarding, playbooks
  - AE — pipeline and close

**Slide 05** — `joe-20260605-5-slide-05.png` — template: `dark`
- kicker: FULL BREAKDOWN
- title: The complete playbook is up.
- body: docs.leanscale.team

---

#### INFOGRAPHIC · `joe-20260605-4` · 1 slide

**Topic:** The Eisenhower Matrix for AI-Enabled Operators

<details><summary>LinkedIn post text (for context)</summary>

> AI gave my team 10x output capacity this year. The mistake was trying to use all of it.
> 
> The field can only absorb so much change. Three things that ship and stick beat ten that ship and get ignored.
> 
> So we run every roadmap through one filter before we commit: level of effort against business impact — with an AI multiplier on the effort axis, because what used to be "high effort" is now cheap.
> 
> Built the whole thing into one image. Save it for your next planning session. 🫡
> 
> #revops #ai

</details>

**Slides:**

**Slide 01** — `joe-20260605-4-slide-01.png` — template: `framework`
- kicker: OPERATOR MATRIX
- num: 01
- title: Effort × Impact — with an AI multiplier.
- body: Quick Wins: ship now. Big Bets: pick 1-2. Auto or delegate the low-impact lane. Drop the rest. AI shrinks the effort axis — re-score every quarter.


### Cameron Legge · Head of Customers

---

#### CAROUSEL · `cameron-20260605-5` · 5 slides

**Topic:** Why, What, How: The Three Layers of GTM Work

<details><summary>LinkedIn post text (for context)</summary>

> The line I keep hearing from founders: "we have an AI engineer now, so we don't really need a RevOps leader."
> 
> I get why it's tempting. One sharp technical hire, a stack of tools, a cleaner org chart.
> 
> The piece that's missing is a layer most people don't have a name for. So I mapped the three layers of GTM work — the Why, the What, and the How — and exactly where an AI-first org is about to find a gap.
> 
> Swipe through. If you're rebuilding your GTM ops org right now, this is the conversation to have before the headcount one.

</details>

**Slides:**

**Slide 01** — `cameron-20260605-5-slide-01.png` — template: `cover`
- kicker: CAMERON LEGGE
- title: Why, What, How: The Three Layers of GTM Work.
- body: And the one most AI-first orgs are about to discover they're missing.

**Slide 02** — `cameron-20260605-5-slide-02.png` — template: `framework`
- kicker: THE STRATEGY
- num: 01
- title: The Why is owned by the CEO and CRO.
- body: What market are we attacking, what does the motion look like, what does winning mean this year.

**Slide 03** — `cameron-20260605-5-slide-03.png` — template: `framework`
- kicker: THE TRANSLATION
- num: 02
- title: The What is owned by RevOps.
- body: Territory model, capacity plan, comp design, lifecycle, forecast cadence. The layer that turns strategy into execution.

**Slide 04** — `cameron-20260605-5-slide-04.png` — template: `framework`
- kicker: THE EXECUTION
- num: 03
- title: The How is owned by GTM engineering.
- body: Which systems, integrations, agents, and automations make the What actually run at scale.

**Slide 05** — `cameron-20260605-5-slide-05.png` — template: `dark`
- kicker: THE GAP
- title: AI automates the How. It can't decide the What.
- body: Hire both, be clear on what each owns. That's the conversation before the headcount one.

---

#### INFOGRAPHIC · `cameron-20260605-4` · 1 slide

**Topic:** The Eisenhower Matrix for AI-Enabled Operators

<details><summary>LinkedIn post text (for context)</summary>

> AI just handed every operator something close to 10x output capacity.
> 
> The catch nobody mentions: your field can only absorb so much change at once. Ship ten things and most of them never get adopted. Ship three that actually move the needle and they stick.
> 
> So I put the filter I'm using with our RevOps team into one image. Effort on one axis, business impact on the other, with a simple read on where AI genuinely accelerates the work versus where it still needs a human in the loop.
> 
> Save it for the next time your to-do list is longer than your week.
> 
> The goal was never to do more. It's to do the right three things, faster.

</details>

**Slides:**

**Slide 01** — `cameron-20260605-4-slide-01.png` — template: `listicle`
- kicker: PRIORITY FILTER
- title: Effort × Impact, with an AI read.
- items:
  - Quick Wins — low effort, high impact (let AI run it)
  - Big Bets — high effort, high impact (human-led, AI-assisted)
  - Fill-In Tasks — low effort, low impact (batch or ignore)
  - Time Sinks — high effort, low impact (just stop)


### Yaseen Arshad · Head of AI

---

#### CAROUSEL · `yasin-20260605-5` · 5 slides

**Topic:** The Eisenhower Matrix for AI-Enabled Operators

<details><summary>LinkedIn post text (for context)</summary>

> AI didn't just make my team faster this year. It made us capable of shipping ten times more work than the field can actually absorb.
> 
> That's the trap nobody warns you about. When output gets cheap, the temptation is to do everything. But three things that get adopted will always beat ten things that get ignored.
> 
> So we went back to a matrix Eisenhower would recognize — effort, urgency, importance — and added one axis for what AI can actually accelerate vs. what still needs human judgment.
> 
> Swipe through for the filter we're using to decide what to build, what to delegate to an agent, and what to leave alone entirely.
> 
> More on this in The LeanScale Letter.

</details>

**Slides:**

**Slide 01** — `yasin-20260605-5-slide-01.png` — template: `cover`
- kicker: THE LEANSCALE LETTER
- title: The AI-Enabled Operator's Matrix.
- body: How to prioritize when AI gives you 10x output and the field can only absorb a fraction of it.

**Slide 02** — `yasin-20260605-5-slide-02.png` — template: `stat`
- kicker: THE REAL CONSTRAINT
- stat: 10x
- statLabel: output · 1x absorption
- title: Output is cheap. Absorption isn't.
- body: AI multiplied what we can ship. It did nothing for how much change the field can actually adopt. That gap is where good operators go to drown.

**Slide 03** — `yasin-20260605-5-slide-03.png` — template: `listicle`
- kicker: THE 2×2
- title: Effort × importance, the original.
- items:
  - Do now — important and urgent
  - Schedule — important, not urgent
  - Delegate — urgent, not important
  - Drop — neither, and be honest about it

**Slide 04** — `yasin-20260605-5-slide-04.png` — template: `framework`
- kicker: THE AI OVERLAY
- num: 04
- title: Add what AI can actually accelerate.
- body: Lime = an agent does this well today against a clear definition. Purple = still needs your judgment. Score every task on both axes before you build.

**Slide 05** — `yasin-20260605-5-slide-05.png` — template: `dark`
- kicker: THE TAKEAWAY
- title: Three things adopted beat ten things ignored.
- body: Push the needle forward, then keep the boat afloat — in that order. More in The LeanScale Letter.

---

#### INFOGRAPHIC · `yasin-20260605-4` · 1 slide

**Topic:** Start Analog, Then Layer AI

<details><summary>LinkedIn post text (for context)</summary>

> The highest-quality AI work I see all starts the same way: someone wrote their own hypothesis down first, by hand, before they touched a model.
> 
> You can always tell when they didn't. The deck looks polished, then it collapses under the first probing question — because there was never a real point of view underneath it, just AI slop arranged neatly.
> 
> The build order is the opposite of how most people use these tools.
> 
> Analog first — your thinking, your structure. Then AI to find examples, crunch the data, and pressure-test the argument you already own.
> 
> Saved this one as a single graphic: the four-step sequence that keeps the work durable instead of brittle. Steal it for your next strategy doc.

</details>

**Slides:**

**Slide 01** — `yasin-20260605-4-slide-01.png` — template: `framework`
- kicker: BUILD ORDER
- num: 01
- title: Start analog. Then layer AI.
- body: 01 Write the hypothesis by hand · 02 AI finds examples + data · 03 AI pressure-tests your logic · 04 You decide. Skip step 01 and it collapses under the first hard question.


### Jake Toepel · Head of Engineering & Product

---

#### CAROUSEL · `jake-20260605-5` · 5 slides

**Topic:** Why, What, How: The Three Layers of GTM Work

<details><summary>LinkedIn post text (for context)</summary>

> "We have an AI engineer now, so we don't need a RevOps leader."
> 
> I hear a version of this every week, and it's about to cost a lot of teams a very expensive year.
> 
> GTM work has three layers, and a GTM engineer only owns one of them.
> 
> The Why belongs to the CEO and CRO. The What belongs to RevOps. The How belongs to engineering — that's my layer, and I can automate it all day.
> 
> What I can't do is decide what the What should be. That takes someone who's watched a comp plan break and sat through a forecast call. Skip that layer and you ship a beautifully engineered system that solves the wrong problem.
> 
> Built this out as a 5-slide breakdown. Swipe through, and DM me if you want the diagram.

</details>

**Slides:**

**Slide 01** — `jake-20260605-5-slide-01.png` — template: `cover`
- kicker: GTM ENGINEERING
- title: Why / What / How.
- body: The three layers of GTM work — and why one AI engineer can't cover all of them.

**Slide 02** — `jake-20260605-5-slide-02.png` — template: `framework`
- kicker: LAYER ONE
- num: 01
- title: The Why — owned by CEO & CRO.
- body: What market we attack, what the motion is, what winning means this year. Strategy. Nobody automates this.

**Slide 03** — `jake-20260605-5-slide-03.png` — template: `framework`
- kicker: LAYER TWO
- num: 02
- title: The What — owned by RevOps.
- body: Lead lifecycle, territory model, comp plan, forecast cadence. The translation of strategy into process. The layer teams keep cutting.

**Slide 04** — `jake-20260605-5-slide-04.png` — template: `framework`
- kicker: LAYER THREE
- num: 03
- title: The How — owned by GTM Engineering.
- body: Systems, integrations, agents, automations that make the What run at scale. This is my layer. I can build all of it.

**Slide 05** — `jake-20260605-5-slide-05.png` — template: `dark`
- kicker: THE FAILURE MODE
- title: Skip the What and the How solves the wrong problem.
- body: A perfectly engineered system, pointed at the wrong target. DM me for the diagram.

---

#### INFOGRAPHIC · `jake-20260605-4` · 1 slide

**Topic:** Forward Deployed Engineers Are Not a Trend — They're a Requirement

<details><summary>LinkedIn post text (for context)</summary>

> Spent last week comparing implementation models from a handful of AI vendors a customer was evaluating.
> 
> One number told the whole story: the FDE-to-account ratio.
> 
> The vendors shipping forward deployed engineers — people who write code, own the data model, and sit in the customer's Slack — were converting POCs to production at roughly double the rate of the ones who handed implementation to an SI partner.
> 
> This is the part of the AI services story that never makes it onto LinkedIn. It's not a hire. It's a stage of the customer journey, and it belongs in your growth model as a CAC line, not a post-sale afterthought.
> 
> Made one graphic on the ratio that matters. Save it for your next vendor eval.
> 
> What ratio are you running? Curious where teams have landed.

</details>

**Slides:**

**Slide 01** — `jake-20260605-4-slide-01.png` — template: `stat`
- kicker: AI IMPLEMENTATION
- stat: ~2x
- statLabel: POC-to-production conversion: in-house FDEs vs. outsourced
- title: The FDE ratio that decides POC outcomes.
- body: Vendors with forward deployed engineers convert at roughly double the rate. Sustainable gearing: 1 FDE per 5-7 accounts. Model it as a CAC line, not a post-sale afterthought.
