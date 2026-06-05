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
 * Usage: /api/og?template=cover&title=Hello&kicker=GTM
 *
 * Templates:
 *  - cover     : Off-white hero slide with eyebrow + display headline
 *  - quote     : Lime-bg pull-quote callout
 *  - framework : Numbered framework slide (light bg, big purple numeral)
 *  - dark      : Dark aubergine variant for closing slides / CTAs
 *
 * Note: PLACEHOLDER renderer. Claude Design template exports will replace these.
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
};

const SIZE = { width: 1080, height: 1080 };

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const template = searchParams.get("template") ?? "cover";
  const title = searchParams.get("title") ?? "Untitled";
  const kicker = searchParams.get("kicker") ?? "LeanScale";
  const body = searchParams.get("body") ?? "";
  const num = searchParams.get("num") ?? "1";

  return new ImageResponse(
    renderTemplate(template, { title, kicker, body, num }),
    { ...SIZE }
  );
}

function renderTemplate(
  template: string,
  props: { title: string; kicker: string; body: string; num: string }
) {
  const { title, kicker, body, num } = props;

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
            alignItems: "center",
            justifyContent: "center",
            padding: 120,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 40, width: "100%" }}>
            <div
              style={{
                fontSize: 14,
                letterSpacing: 4,
                textTransform: "uppercase",
                fontWeight: 300,
                color: COLORS.strongPurple,
              }}
            >
              {kicker}
            </div>
            <div
              style={{
                fontSize: 64,
                lineHeight: 1.15,
                fontWeight: 500,
                color: COLORS.darkPurple,
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </div>
            {body && (
              <div style={{ fontSize: 24, color: COLORS.darkPurple, opacity: 0.7, fontWeight: 400 }}>
                {body}
              </div>
            )}
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
            padding: 96,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 16,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 300,
              color: COLORS.strongPurple,
            }}
          >
            {kicker}
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 64 }}>
            <div
              style={{
                fontSize: 180,
                fontWeight: 300,
                color: COLORS.strongPurple,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {num}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 32, flex: 1, paddingTop: 24 }}>
              <div
                style={{
                  fontSize: 56,
                  lineHeight: 1.05,
                  fontWeight: 500,
                  color: COLORS.black,
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </div>
              {body && (
                <div style={{ fontSize: 24, lineHeight: 1.4, color: COLORS.darkGray, fontWeight: 500 }}>
                  {body}
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 13,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 300,
              color: COLORS.darkGray,
            }}
          >
            <span>www.leanscale.team</span>
            <span>Placeholder</span>
          </div>
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
            padding: 96,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 16,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 300,
              color: COLORS.mediumPurple,
            }}
          >
            {kicker}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div
              style={{
                fontSize: 68,
                lineHeight: 1.05,
                fontWeight: 500,
                color: COLORS.offWhite,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </div>
            {body && (
              <div style={{ fontSize: 26, lineHeight: 1.4, color: COLORS.lightGray, fontWeight: 500 }}>
                {body}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 13,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 300,
              color: COLORS.mediumPurple,
            }}
          >
            <span>www.leanscale.team</span>
            <span>Placeholder · Claude Design pending</span>
          </div>
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
            padding: 96,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 300,
              color: COLORS.strongPurple,
            }}
          >
            {kicker}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingRight: 100 }}>
            <div
              style={{
                fontSize: 80,
                lineHeight: 1.02,
                fontWeight: 500,
                color: COLORS.black,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </div>
            {body && (
              <div
                style={{
                  fontSize: 26,
                  lineHeight: 1.4,
                  color: COLORS.darkGray,
                  fontWeight: 500,
                  maxWidth: 720,
                }}
              >
                {body}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 13,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 300,
              color: COLORS.darkGray,
            }}
          >
            <span>www.leanscale.team</span>
            <span>Placeholder · Claude Design pending</span>
          </div>
        </div>
      );
  }
}
