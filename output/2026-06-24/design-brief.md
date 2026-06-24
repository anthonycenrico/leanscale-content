# LeanScale Visual Batch — 2026-06-24

10 visual assets — 5 carousels + 5 infographics (34 slides total).

Paste this whole doc into Claude Design. It already has the LeanScale brand system, so this is content + concept only — no colors, fonts, or tokens. Each asset is labeled CAROUSEL (multi-slide) or INFOGRAPHIC (single image); the dimensions differ. Design each, then export each slide / image as a PNG named with its slide ID so it wires back into the app.

EXPORT QUALITY — bake these in so the PNGs come out crisp and on-brand:
- Export at 2× resolution: 2160×2160 per slide (render at pixelRatio 2, not 1). 1080×1080 looks soft when viewed or scaled larger; 2160 downscales cleanly for LinkedIn.
- Do NOT use an SVG <mask> for the logo or any brand mark. DOM-to-image renderers don't reproduce masks faithfully and the mark drifts between exports. Use a geometric clip-path (or plain shapes) so the mark renders identically every time.
- Reload and visually confirm the brand mark renders correctly BEFORE exporting.
- Keep the exact slide-ID filename for each PNG ({slide-id}.png) so it wires straight back into the app.

---

## Anthony Enrico · Co-founder & CEO

CAROUSEL — The Packaging Order Of Operations

Asset type: LinkedIn carousel — 6 swipeable slides. Design each as its own 1080×1080 frame and export each as a separate PNG.

The LinkedIn post this pairs with (context for the design):

> **Most teams start pricing conversations with "what number do we charge."**
>
> That's backwards. And it's why your pricing meetings go in circles.
>
> The number comes LAST. There's a sequence — and skipping a step downstream is what creates the chaos upstream.
>
> We put together a quick visual on the non-negotiable order of operations we use with every B2B SaaS client we touch.
>
> Swipe through 👇

Design the carousel slide by slide:

Slide 01 — anthony-20260624-1-slide-01.png  ·  Cover / title slide — opens the set and frames the core idea.
  - Eyebrow: PRICING PLAYBOOK
  - Headline: The Packaging Order Of Operations
  - Supporting text: Four decisions, in order. Skip one and your pricing meetings go in circles.

Slide 02 — anthony-20260624-1-slide-02.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 01
  - Eyebrow: STEP ONE
  - Headline: Packaging
  - Supporting text: What's in the box? Decide what you're selling before you decide how to sell it. Good/Better/Best, modules, tiers — this is the architecture.

Slide 03 — anthony-20260624-1-slide-03.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 02
  - Eyebrow: STEP TWO
  - Headline: Pricing Structure
  - Supporting text: Subscription? Usage? Hybrid? Outcome-based? The structure decides how your customer experiences cost over time.

Slide 04 — anthony-20260624-1-slide-04.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 03
  - Eyebrow: STEP THREE
  - Headline: Pricing Metric
  - Supporting text: What you price ON. Seats, API calls, GB processed, agents deployed. Pick the metric that scales with the value your buyer feels.

Slide 05 — anthony-20260624-1-slide-05.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 04
  - Eyebrow: STEP FOUR
  - Headline: The Number
  - Supporting text: Now — and only now — you set the price point. The number is the easy part once the first three are locked.

Slide 06 — anthony-20260624-1-slide-06.png  ·  Closing slide — the final takeaway / sign-off.
  - Eyebrow: THE PAYOFF
  - Headline: Skip a step. Pay later.
  - Supporting text: Most teams jump straight to the number and reverse-engineer the rest. That's why pricing feels broken. Run the sequence.

Keep the slide IDs above as the exported PNG filenames so the new versions wire back into the app automatically. (Claude Design already has the LeanScale brand — no need to specify colors or fonts.)

---
INFOGRAPHIC — The Complexity Budget

Asset type: single infographic image (1080×1080) — one dense graphic that lands the point at a glance.

The LinkedIn post this pairs with (context for the design):

> **Every deal has a "complexity budget."**
>
> It's the amount of intricacy your buyer will tolerate in your pricing before they walk away.
>
> An AWS enterprise contract can absorb dozens of line items, usage tiers, and commitments. A $10K/year startup deal can absorb almost none.
>
> The rule we use with B2B SaaS clients: match pricing complexity to ACV. Higher ACV = more sophisticated buyer = more complexity allowed. Lower ACV = self-serve buyer = ruthless simplicity required.
>
> Founders blow this all the time at the bottom of the market. They design enterprise-grade pricing matrices for SMB deals — and watch their conversion rate fall off a cliff.
>
> One image, the whole concept 👇

The infographic — anthony-20260624-2-slide-01.png:

Concept: A single 1080x1080 stat-style infographic with the headline 'The Complexity Budget,' a big visual showing ACV on one axis and tolerable complexity on the other, and a one-line rule at the bottom about matching one to the other.

Copy + elements to include:
  - Eyebrow: PRICING RULE
  - Big number / metric: 1:1
  - Metric label: ACV to complexity ratio
  - Headline: The Complexity Budget
  - Supporting text: Every deal has a budget of complexity your buyer will tolerate. Enterprise contracts can absorb dozens of line items. A $10K startup deal can absorb almost none. Match pricing complexity to ACV — or lose the bottom of your market.

Keep the slide IDs above as the exported PNG filenames so the new versions wire back into the app automatically. (Claude Design already has the LeanScale brand — no need to specify colors or fonts.)

---

## Joe Zaghloul · Chief Operating Officer

CAROUSEL — Customers Hate Usage Pricing — Here's How To Fix It

Asset type: LinkedIn carousel — 6 swipeable slides. Design each as its own 1080×1080 frame and export each as a separate PNG.

The LinkedIn post this pairs with (context for the design):

> We've been deep in pricing & packaging conversations with our AI-native B2B customers for months now.
>
> One pattern keeps surfacing: CFOs don't push back on usage-based pricing because it's expensive. They push back because it's unpredictable.
>
> Bill shock is killing renewals. The fix is mechanical, not philosophical — base fee + usage on top, real-time visibility, team-level controls, traceability per consumption unit.
>
> Swipe through the build order we're recommending 👇
>
> #revops #pricing

Design the carousel slide by slide:

Slide 01 — joe-20260624-1-slide-01.png  ·  Cover / title slide — opens the set and frames the core idea.
  - Eyebrow: PRICING & PACKAGING
  - Headline: Customers Hate Usage Pricing. Here's How To Fix It.
  - Supporting text: CFOs don't fear usage-based pricing because it's expensive. They fear it because it's unpredictable. Bill shock kills renewals.

Slide 02 — joe-20260624-1-slide-02.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 01
  - Eyebrow: FIX 01
  - Headline: Base Fee + Usage On Top
  - Supporting text: Anchor the contract with a recurring floor. Layer usage above it. CFOs can forecast the floor and only sweat the variable layer.

Slide 03 — joe-20260624-1-slide-03.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 02
  - Eyebrow: FIX 02
  - Headline: Real-Time Consumption Visibility
  - Supporting text: Buyers should never wait for an invoice to know what they spent. Show usage live, by team, by user, by unit.

Slide 04 — joe-20260624-1-slide-04.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 03
  - Eyebrow: FIX 03
  - Headline: IT-Level Controls Per Team
  - Supporting text: Caps, alerts, and team-level budgets. Give IT the same governance posture they expect from any cloud spend tool.

Slide 05 — joe-20260624-1-slide-05.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 04
  - Eyebrow: FIX 04
  - Headline: Audit-Grade Traceability
  - Supporting text: Every consumption unit tied to a user, prompt, agent run, or workflow. When finance asks 'what drove this spike?' the answer is one click away.

Slide 06 — joe-20260624-1-slide-06.png  ·  Closing slide — the final takeaway / sign-off.
  - Eyebrow: THE TAKEAWAY
  - Headline: Predictability Sells. Surprises Don't.
  - Supporting text: Usage pricing isn't the problem. The lack of a floor, visibility, controls, and traceability is. Ship those four and renewals stop being a fight.

Keep the slide IDs above as the exported PNG filenames so the new versions wire back into the app automatically. (Claude Design already has the LeanScale brand — no need to specify colors or fonts.)

---
INFOGRAPHIC — Revisit Pricing On Whichever Cycle Is Longer

Asset type: single infographic image (1080×1080) — one dense graphic that lands the point at a glance.

The LinkedIn post this pairs with (context for the design):

> Most B2B startups we work with let pricing decay quietly.
>
> The cleanest cadence we've seen: revisit pricing & packaging every product release cycle OR every sales cycle — whichever is longer.
>
> Six-month enterprise sales cycle? Pricing review every six months. Weekly product releases? Defer to the sales cadence so you're reviewing real cohort behavior, not noise.
>
> Simple rule. Hard to argue with. One image below to make it stick.
>
> #revops #pricing

The infographic — joe-20260624-2-slide-01.png:

Concept: Single-slide infographic showing the pricing review cadence rule. Headline states the rule: revisit pricing on whichever cycle is longer — product release or sales cycle. A simple visual contrast: a six-month sales cycle bar vs. a weekly product release bar, with an arrow showing 'longer cycle wins.' A concrete example callout: 6-month sales cycle = pricing review every 6 months.

Copy + elements to include:
  - Step number: →
  - Eyebrow: THE RULE
  - Headline: Revisit Pricing On Whichever Cycle Is Longer
  - Supporting text: Review pricing & packaging every product release OR every sales cycle — whichever takes longer. 6-month sales cycle? Review every 6 months. Weekly releases? Defer to the sales cadence so you're reading real cohort behavior, not noise.

Keep the slide IDs above as the exported PNG filenames so the new versions wire back into the app automatically. (Claude Design already has the LeanScale brand — no need to specify colors or fonts.)

---

## Cameron Legge · Head of Customers

CAROUSEL — The Reverse-Risk Pricing Rollout

Asset type: LinkedIn carousel — 6 swipeable slides. Design each as its own 1080×1080 frame and export each as a separate PNG.

The LinkedIn post this pairs with (context for the design):

> Pricing and packaging changes are scary because most teams roll them out in the wrong order.
>
> We usually start with the customer who matters most. That's where the risk is highest.
>
> The move is to flip it. Design the end state first, then sequence the rollout backwards from there — insiders, sales leadership, new business in a small region, second-tier accounts, and your most important customer last.
>
> By the time you get to the account that matters most, you have months of evidence behind you.
>
> Swipe through the sequence we use with clients.

Design the carousel slide by slide:

Slide 01 — cameron-20260624-1-slide-01.png  ·  Cover / title slide — opens the set and frames the core idea.
  - Eyebrow: PRICING ROLLOUT
  - Headline: Start at the end. Sequence backwards.
  - Supporting text: The order you roll out new pricing matters as much as the pricing itself.

Slide 02 — cameron-20260624-1-slide-02.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 01
  - Eyebrow: STEP 01
  - Headline: Design with insiders first
  - Supporting text: Pull your CS and product leads into the room. Pressure-test the model before any customer sees it.

Slide 03 — cameron-20260624-1-slide-03.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 02
  - Eyebrow: STEP 02
  - Headline: Validate with sales leadership
  - Supporting text: Get your CRO and frontline leaders behind it. If they can't sell it internally, they won't sell it externally.

Slide 04 — cameron-20260624-1-slide-04.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 03
  - Eyebrow: STEP 03
  - Headline: Test on new business in your smallest region
  - Supporting text: Lowest stakes, fastest feedback. You learn the objections without exposing real revenue.

Slide 05 — cameron-20260624-1-slide-05.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 04
  - Eyebrow: STEP 04
  - Headline: Migrate your second tier next
  - Supporting text: Customers 2, 3, 4, and 5. Build the migration muscle before the one that matters most.

Slide 06 — cameron-20260624-1-slide-06.png  ·  Closing slide — the final takeaway / sign-off.
  - Eyebrow: STEP 05
  - Headline: Then, and only then, your top account.
  - Supporting text: By the time you get there, you have months of evidence and a tested motion. That's how you protect the customer you can't afford to lose.

Keep the slide IDs above as the exported PNG filenames so the new versions wire back into the app automatically. (Claude Design already has the LeanScale brand — no need to specify colors or fonts.)

---
INFOGRAPHIC — Outcome vs Consumption Are Two Different Questions

Asset type: single infographic image (1080×1080) — one dense graphic that lands the point at a glance.

The LinkedIn post this pairs with (context for the design):

> Half the pricing debates on LinkedIn are people arguing about two different things.
>
> Outcome-based pricing is WHAT you charge for. The customer pays when something good happens — a ticket gets resolved, a deal gets booked, a meeting gets set.
>
> Consumption-based pricing is HOW you meter. Per query, per seat, per minute.
>
> These are not competing models. You can stack them. Fin AI charges by closed ticket — that's the outcome — consumed across the month — that's the consumption.
>
> Get the two questions separated and a lot of the noise clears up. Cheers!

The infographic — cameron-20260624-2-slide-01.png:

Concept: Single infographic with a two-column comparison: left column 'Outcome-Based (the WHAT)' with examples, right column 'Consumption-Based (the HOW)' with examples, and a bottom bar showing they can stack — with Fin AI as the worked example.

Copy + elements to include:
  - Eyebrow: PRICING MODELS
  - Headline: Outcome vs consumption are two different questions.
  - List items:
    - Outcome-based pricing is WHAT you charge for — resolved tickets, booked meetings, closed deals.
    - Consumption-based pricing is HOW you meter — per query, per seat, per minute, per token.
    - They are not competing models. You can stack them.
    - Fin AI charges by closed ticket (outcome) consumed across the month (consumption).
    - Separate the two questions and most pricing debates get a lot shorter.

Keep the slide IDs above as the exported PNG filenames so the new versions wire back into the app automatically. (Claude Design already has the LeanScale brand — no need to specify colors or fonts.)

---

## Yaseen Arshad · Head of AI

CAROUSEL — The 3 Questions To Decide If Outcome-Based Pricing Works

Asset type: LinkedIn carousel — 5 swipeable slides. Design each as its own 1080×1080 frame and export each as a separate PNG.

The LinkedIn post this pairs with (context for the design):

> Everyone in agentic AI wants to copy Fin AI's closed-ticket pricing.
>
> Most shouldn't.
>
> Before you torch your pricing page, run the three-question gate we use with portfolio teams thinking about going outcome-based.
>
> Three yeses, you're a candidate. Anything less, stay on usage.
>
> The gate, swipe through.

Design the carousel slide by slide:

Slide 01 — yasin-20260624-1-slide-01.png  ·  Cover / title slide — opens the set and frames the core idea.
  - Eyebrow: PRICING GATE
  - Headline: Should You Move To Outcome-Based Pricing?
  - Supporting text: Three questions decide it. Three yeses, you're a candidate. Anything less, stay on usage.

Slide 02 — yasin-20260624-1-slide-02.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 01
  - Eyebrow: QUESTION ONE
  - Headline: Can you define one clear outcome?
  - Supporting text: Not three. Not 'value delivered.' One outcome a buyer can point to and a system can count.

Slide 03 — yasin-20260624-1-slide-03.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 02
  - Eyebrow: QUESTION TWO
  - Headline: Will customers agree with that definition?
  - Supporting text: Your version of 'resolved ticket' has to match theirs. If you're still negotiating the definition mid-deal, you're not ready.

Slide 04 — yasin-20260624-1-slide-04.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 03
  - Eyebrow: QUESTION THREE
  - Headline: Is the value of that outcome the same across customers?
  - Supporting text: A resolved ticket worth $5 to one buyer and $500 to another breaks the model. Outcome pricing needs a tight value band.

Slide 05 — yasin-20260624-1-slide-05.png  ·  Closing slide — the final takeaway / sign-off.
  - Eyebrow: THE VERDICT
  - Headline: Three yeses, you're a candidate. Anything less, stay on usage.
  - Supporting text: Outcome-based pricing isn't the future for everyone. It's the future for a narrow set of vertical AI companies who pass this gate.

Keep the slide IDs above as the exported PNG filenames so the new versions wire back into the app automatically. (Claude Design already has the LeanScale brand — no need to specify colors or fonts.)

---
INFOGRAPHIC — Classic SaaS Margins Were A Historical Anomaly

Asset type: single infographic image (1080×1080) — one dense graphic that lands the point at a glance.

The LinkedIn post this pairs with (context for the design):

> 80-95% gross margins were a once-in-a-generation gift.
>
> Classic SaaS only worked that way because the marginal cost to serve the 10th customer and the 10,000th was effectively the same — basically zero.
>
> AI breaks that math. Every additional call costs compute, and that compute compounds with usage.
>
> Most SaaS founders are running the old playbook on the new economics and haven't done the unit math yet. The bolt-on AI feature looks great on the demo and quietly drags the contribution margin down for every account that actually uses it.
>
> Worth re-running the numbers before the next pricing cycle.

The infographic — yasin-20260624-2-slide-01.png:

Concept: Single-image stat infographic. Big headline contrast: classic SaaS marginal cost (~$0) vs AI-era marginal cost (compounds with usage). Should read as a 'the math has changed' callout — clean, scannable, save-worthy.

Copy + elements to include:
  - Eyebrow: MARGIN MATH
  - Big number / metric: 80-95%
  - Metric label: Classic SaaS gross margins
  - Headline: Classic SaaS Was A Historical Anomaly
  - Supporting text: Only possible because marginal cost to serve was ~$0. The 10th customer and the 10,000th cost the same to deliver. AI breaks that assumption — every call costs compute, and compute compounds with usage.

Keep the slide IDs above as the exported PNG filenames so the new versions wire back into the app automatically. (Claude Design already has the LeanScale brand — no need to specify colors or fonts.)

---

## Jake Toepel · Head of Engineering & Product

CAROUSEL — The Jobs-To-Be-Done Validation Test

Asset type: LinkedIn carousel — 6 swipeable slides. Design each as its own 1080×1080 frame and export each as a separate PNG.

The LinkedIn post this pairs with (context for the design):

> We use a dead-simple test to validate packaging before it ships.
>
> Put the three tiers in front of a real customer. Label the jobs-to-be-done on each. Ask them to point to the one that describes them.
>
> If they pick without hesitation, the packaging works.
>
> If they say "I'm a little of this and a little of that" — the packaging just failed.
>
> Swipe through the test we run on every pricing project at LeanScale Labs.

Design the carousel slide by slide:

Slide 01 — jake-20260624-1-slide-01.png  ·  Cover / title slide — opens the set and frames the core idea.
  - Eyebrow: PACKAGING VALIDATION
  - Headline: The Jobs-To-Be-Done Test
  - Supporting text: A one-question check that tells you if your packaging actually works — before you ship it.

Slide 02 — jake-20260624-1-slide-02.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 01
  - Eyebrow: STEP 01
  - Headline: Lay out the three tiers
  - Supporting text: Put your full packaging in front of a real customer. Label the jobs-to-be-done on each tier so nothing is hidden.

Slide 03 — jake-20260624-1-slide-03.png  ·  Numbered point slide — a large step number anchors a bold statement plus a line of supporting detail.
  - Step number: 02
  - Eyebrow: STEP 02
  - Headline: Ask one question
  - Supporting text: Which tier describes the job you are trying to get done? Stay quiet. Let them point.

Slide 04 — jake-20260624-1-slide-04.png  ·  List slide — a short titled list, each item on its own row.
  - Eyebrow: READING THE RESULT
  - Headline: What the answer tells you
  - List items:
    - Points immediately = packaging works
    - Hedges between two tiers = boundaries are blurry
    - Says "a little of both" = packaging failed
    - Asks clarifying questions = jobs are not legible

Slide 05 — jake-20260624-1-slide-05.png  ·  Quote slide — a pulled quote treated as the hero, with attribution.
  - Eyebrow: THE BAR
  - Quote: If they cannot pick one without hesitation, the packaging is not done.
  - Attribution: LeanScale Labs — pricing and packaging workstream

Slide 06 — jake-20260624-1-slide-06.png  ·  Closing slide — the final takeaway / sign-off.
  - Eyebrow: RUN THE TEST
  - Headline: Validate before you launch
  - Supporting text: Most packaging fails in front of customers, not in the spreadsheet. Pull three customers this week and run the test.

Keep the slide IDs above as the exported PNG filenames so the new versions wire back into the app automatically. (Claude Design already has the LeanScale brand — no need to specify colors or fonts.)

---
INFOGRAPHIC — Multi-Segment Companies Need Multi-Complexity Pricing

Asset type: single infographic image (1080×1080) — one dense graphic that lands the point at a glance.

The LinkedIn post this pairs with (context for the design):

> If you sell to startups and enterprise off the same pricing page, you have a problem.
>
> Startup pricing absorbs almost zero complexity. One number, one tier, self-serve checkout.
>
> Enterprise pricing rewards complexity. Volume curves, seat tiers, usage commits, custom SKUs.
>
> Trying to make one architecture serve both is why your sales team cannot quote either segment cleanly.
>
> The fix is not an elegant unified model. The fix is two architectures running in parallel — and packaging that decides which one a deal lives in.
>
> One image on what that actually looks like.

The infographic — jake-20260624-2-slide-01.png:

Concept: Single-slide side-by-side comparison of startup pricing architecture vs. enterprise pricing architecture, showing the different complexity each absorbs and the routing decision that sits between them.

Copy + elements to include:
  - Eyebrow: TWO ARCHITECTURES
  - Headline: Multi-segment companies need multi-complexity pricing
  - List items:
    - Startup track: one tier, one number, self-serve
    - Enterprise track: tiers, commits, seat curves, custom SKUs
    - Packaging decides which track a deal enters
    - Sales team quotes against the right model the first time
    - One unified page is what is breaking your quoting motion

Keep the slide IDs above as the exported PNG filenames so the new versions wire back into the app automatically. (Claude Design already has the LeanScale brand — no need to specify colors or fonts.)

---