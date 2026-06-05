import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CONDENSED_BRAND_SPEC } from "../../lib/visual-spec";

// Node runtime (not edge) so the Anthropic SDK runs cleanly. On Netlify this
// becomes a serverless function. force-dynamic — never statically prerendered.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

const VISUAL_SPEC_TOOL: Anthropic.Tool = {
  name: "emit_visual_spec",
  description:
    "Emit the structured slide spec for a LinkedIn post. Each slide maps to a Satori-rendered 1080x1080 PNG template.",
  input_schema: {
    type: "object",
    properties: {
      slides: {
        type: "array",
        description: "Ordered slides. Carousel = 4-6 slides. Infographic = exactly 1 slide.",
        items: {
          type: "object",
          properties: {
            template: {
              type: "string",
              enum: ["cover", "framework", "listicle", "stat", "quote", "dark"],
              description:
                "cover=opening headline slide; framework=numbered step (num+title+body); listicle=3-6 items; stat=huge number/value + label + body; quote=lime pull-quote (title=quote, body=attribution); dark=aubergine closing slide.",
            },
            params: {
              type: "object",
              properties: {
                kicker: { type: "string", description: "Uppercase eyebrow, 2-4 words." },
                title: { type: "string", description: "Headline or, for quote, the quote text. <= 10 words." },
                body: { type: "string", description: "Supporting line. <= 30 words. For quote, this is the attribution." },
                num: { type: "string", description: "Two-digit string for framework slides, e.g. '01'." },
                items: { type: "array", items: { type: "string" }, description: "3-6 short list items for listicle slides." },
                stat: { type: "string", description: "The big value for stat slides, e.g. '40%' or '01'." },
                statLabel: { type: "string", description: "Label under the big stat value." },
              },
              required: ["title"],
            },
          },
          required: ["template", "params"],
        },
      },
    },
    required: ["slides"],
  },
};

interface RegenerateBody {
  postText: string;
  topicTitle: string;
  contentType: string;
  guidance?: string;
  mode?: "carousel" | "infographic";
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "No Anthropic API key configured. Add ANTHROPIC_API_KEY in Netlify → Site configuration → Environment variables, then redeploy.",
      },
      { status: 503 }
    );
  }

  let body: RegenerateBody;
  try {
    body = (await req.json()) as RegenerateBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { postText, topicTitle, contentType, guidance } = body;
  const mode: "carousel" | "infographic" =
    body.mode ??
    ((contentType || "").toUpperCase().includes("INFOGRAPHIC") ? "infographic" : "carousel");

  const slideRule =
    mode === "infographic"
      ? "Produce EXACTLY 1 slide — a single dense, self-contained graphic. Prefer the `stat`, `listicle`, or `framework` template."
      : "Produce 4 to 6 slides with a clear narrative arc: open with `cover`, then body slides (`framework`, `listicle`, `stat`), and close with `dark` or `quote`. Make each slide visually distinct — don't repeat one template for every slide unless it's a deliberate numbered sequence.";

  const userPrompt = `Produce a visualSpec for this LinkedIn post by calling emit_visual_spec.

CONTENT TYPE: ${mode}
TOPIC: ${topicTitle}

POST TEXT:
${postText}
${guidance ? `\nAUTHOR'S GUIDANCE FOR THE VISUAL:\n${guidance}\n` : ""}
Requirements:
- ${slideRule}
- Slides must follow and reinforce the narrative of the post, not restate it verbatim.
- Titles <= 10 words. Bodies <= 30 words. Kickers are 2-4 word uppercase eyebrows.
- Use only the supported templates. Match the LeanScale Light Mode design system exactly.`;

  try {
    const anthropic = new Anthropic({ apiKey });
    const resp = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      tools: [VISUAL_SPEC_TOOL],
      tool_choice: { type: "tool", name: "emit_visual_spec" },
      system: [
        {
          type: "text",
          text: "You are the design director for LeanScale. You produce structured slide specs (visualSpec) for LinkedIn posts that get rendered as 1080x1080 PNGs. You ONLY ever respond by calling the emit_visual_spec tool. Follow the brand system below exactly.",
        },
        {
          type: "text",
          text: CONDENSED_BRAND_SPEC,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const toolUse = resp.content.find((c) => c.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json(
        { error: "Model did not return a visual spec. Try again." },
        { status: 502 }
      );
    }

    const visualSpec = toolUse.input as { slides?: unknown };
    if (!visualSpec.slides || !Array.isArray(visualSpec.slides) || visualSpec.slides.length === 0) {
      return NextResponse.json(
        { error: "Generated spec had no slides. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ visualSpec });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Unexpected error generating the visual.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
