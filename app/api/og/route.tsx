import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Satori-based PNG renderer for carousel/infographic slides.
 *
 * Light-mode LeanScale brand (per leanscale-light-mode-design-system.md):
 * - Off-white surfaces, dark-purple inverse, strong-purple primary accent
 * - Lime is callout-only
 * - Sharp geometry (max radius 16px), purple-tinted shadows, no gradients
 *
 * Usage: /api/og?template=cover&kicker=GTM&title=Hello&body=World
 *
 * Templates:
 *  - cover     : Off-white hero slide. Params: kicker, title, body
 *  - framework : Numbered framework step. Params: kicker, num, title, body
 *  - quote     : Lime pull-quote callout. Params: kicker, title (the quote), body (attribution)
 *  - dark      : Deep aubergine closing slide. Params: kicker, title, body
 *  - stat      : Single big stat with label. Params: kicker, stat, statLabel, body
 *  - listicle  : Numbered list of 3-5 items. Params: kicker, title, items (pipe-delimited)
 *
 * Slides are 1080x1080 — square format for LinkedIn carousel uploads.
 */

const COLORS = {
  offWhite: "#FFFBFF",
  lightGray: "#E9E9E7",
  darkGray: "#595959",
  black: "#000000",
  darkPurple: "#301934",
  strongPurple: "#642585",
  mediumPurple: "#D9AFD0",
  lime: "#E8FFCF",
  borderSubtle: "#E9E9E7",
};

const SIZE = { width: 1080, height: 1080 };
const PAD = 80;
const FONT_FAMILY = "'Plus Jakarta Sans', system-ui, sans-serif";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const template = (searchParams.get("template") ?? "cover").toLowerCase();
  const params = {
    kicker: searchParams.get("kicker") ?? "LeanScale",
    title: searchParams.get("title") ?? "Untitled slide",
    body: searchParams.get("body") ?? "",
    num: searchParams.get("num") ?? "01",
    items: (searchParams.get("items") ?? "").split("|").filter(Boolean),
    stat: searchParams.get("stat") ?? "",
    statLabel: searchParams.get("statLabel") ?? "",
  };

  return new ImageResponse(renderTemplate(template, params), { ...SIZE });
}

interface RenderParams {
  kicker: string;
  title: string;
  body: string;
  num: string;
  items: string[];
  stat: string;
  statLabel: string;
}

function eyebrow(text: string, color: string) {
  return (
    <div
      style={{
        fontSize: 18,
        letterSpacing: 4,
        textTransform: "uppercase",
        fontWeight: 300,
        color,
      }}
    >
      {text}
    </div>
  );
}

function footer(left: string, right: string, color: string, borderColor: string) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 24,
        borderTop: `1px solid ${borderColor}`,
        fontSize: 13,
        letterSpacing: 4,
        textTransform: "uppercase",
        fontWeight: 300,
        color,
      }}
    >
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function renderTemplate(template: string, p: RenderParams) {
  switch (template) {
    case "quote":
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: COLORS.lime,
            color: COLORS.darkPurple,
            padding: PAD,
            fontFamily: FONT_FAMILY,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {eyebrow(p.kicker, COLORS.strongPurple)}
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            <div
              style={{
                fontSize: 220,
                lineHeight: 0.7,
                fontWeight: 500,
                color: COLORS.darkPurple,
              }}
            >
              "
            </div>
            <div
              style={{
                fontSize: 60,
                lineHeight: 1.12,
                fontWeight: 500,
                color: COLORS.darkPurple,
                letterSpacing: "-0.01em",
              }}
            >
              {p.title}
            </div>
            {p.body && (
              <div
                style={{
                  fontSize: 22,
                  color: COLORS.darkPurple,
                  opacity: 0.7,
                  fontWeight: 500,
                  marginTop: 16,
                }}
              >
                — {p.body}
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: 13,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 300,
              color: COLORS.darkPurple,
              opacity: 0.7,
            }}
          >
            www.leanscale.team
          </div>
        </div>
      );

    case "framework":
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: COLORS.offWhite,
            color: COLORS.black,
            padding: PAD,
            fontFamily: FONT_FAMILY,
          }}
        >
          {eyebrow(p.kicker, COLORS.strongPurple)}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 56 }}>
            <div
              style={{
                fontSize: 200,
                fontWeight: 300,
                color: COLORS.strongPurple,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {p.num}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28, flex: 1, paddingTop: 24 }}>
              <div
                style={{
                  fontSize: 60,
                  lineHeight: 1.05,
                  fontWeight: 500,
                  color: COLORS.black,
                  letterSpacing: "-0.01em",
                }}
              >
                {p.title}
              </div>
              {p.body && (
                <div
                  style={{
                    fontSize: 24,
                    lineHeight: 1.4,
                    color: COLORS.darkGray,
                    fontWeight: 500,
                  }}
                >
                  {p.body}
                </div>
              )}
            </div>
          </div>
          {footer("www.leanscale.team", "", COLORS.darkGray, COLORS.borderSubtle)}
        </div>
      );

    case "dark":
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: COLORS.darkPurple,
            color: COLORS.offWhite,
            padding: PAD,
            fontFamily: FONT_FAMILY,
          }}
        >
          {eyebrow(p.kicker, COLORS.mediumPurple)}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div
              style={{
                fontSize: 72,
                lineHeight: 1.02,
                fontWeight: 500,
                color: COLORS.offWhite,
                letterSpacing: "-0.02em",
              }}
            >
              {p.title}
            </div>
            {p.body && (
              <div
                style={{
                  fontSize: 26,
                  lineHeight: 1.4,
                  color: COLORS.lightGray,
                  fontWeight: 500,
                }}
              >
                {p.body}
              </div>
            )}
          </div>
          {footer("www.leanscale.team", "", COLORS.mediumPurple, "rgba(217,175,208,0.18)")}
        </div>
      );

    case "stat":
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: COLORS.offWhite,
            color: COLORS.black,
            padding: PAD,
            fontFamily: FONT_FAMILY,
          }}
        >
          {eyebrow(p.kicker, COLORS.strongPurple)}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                fontSize: 280,
                fontWeight: 300,
                color: COLORS.strongPurple,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {p.stat || p.title}
            </div>
            {p.statLabel && (
              <div
                style={{
                  fontSize: 36,
                  lineHeight: 1.2,
                  fontWeight: 500,
                  color: COLORS.black,
                  letterSpacing: "-0.01em",
                  maxWidth: 800,
                }}
              >
                {p.statLabel}
              </div>
            )}
            {p.body && (
              <div
                style={{
                  fontSize: 22,
                  lineHeight: 1.4,
                  color: COLORS.darkGray,
                  fontWeight: 500,
                  marginTop: 16,
                  maxWidth: 800,
                }}
              >
                {p.body}
              </div>
            )}
          </div>
          {footer("www.leanscale.team", "", COLORS.darkGray, COLORS.borderSubtle)}
        </div>
      );

    case "listicle":
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: COLORS.offWhite,
            color: COLORS.black,
            padding: PAD,
            fontFamily: FONT_FAMILY,
          }}
        >
          {eyebrow(p.kicker, COLORS.strongPurple)}
          <div style={{ display: "flex", flexDirection: "column", gap: 36, flex: 1, justifyContent: "center" }}>
            <div
              style={{
                fontSize: 48,
                lineHeight: 1.1,
                fontWeight: 500,
                color: COLORS.black,
                letterSpacing: "-0.01em",
                marginBottom: 8,
              }}
            >
              {p.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {p.items.slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: 24,
                    paddingTop: 18,
                    paddingBottom: 18,
                    borderTop: `1px solid ${COLORS.borderSubtle}`,
                    fontSize: 24,
                    lineHeight: 1.3,
                    fontWeight: 500,
                    color: COLORS.darkGray,
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 300,
                      color: COLORS.strongPurple,
                      letterSpacing: "-0.01em",
                      fontVariantNumeric: "tabular-nums",
                      minWidth: 56,
                    }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span style={{ flex: 1, color: COLORS.black }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          {footer("www.leanscale.team", "", COLORS.darkGray, COLORS.borderSubtle)}
        </div>
      );

    case "cover":
    default:
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: COLORS.offWhite,
            color: COLORS.black,
            padding: PAD,
            fontFamily: FONT_FAMILY,
          }}
        >
          {eyebrow(p.kicker, COLORS.strongPurple)}
          <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingRight: 60 }}>
            <div
              style={{
                fontSize: 88,
                lineHeight: 1.0,
                fontWeight: 500,
                color: COLORS.black,
                letterSpacing: "-0.02em",
              }}
            >
              {p.title}
            </div>
            {p.body && (
              <div
                style={{
                  fontSize: 28,
                  lineHeight: 1.4,
                  color: COLORS.darkGray,
                  fontWeight: 500,
                  maxWidth: 820,
                }}
              >
                {p.body}
              </div>
            )}
          </div>
          {footer("www.leanscale.team", "", COLORS.darkGray, COLORS.borderSubtle)}
        </div>
      );
  }
}
