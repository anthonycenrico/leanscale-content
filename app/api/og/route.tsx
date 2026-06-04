import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Satori-based PNG renderer for carousel/infographic slides.
 *
 * Usage: /api/og?template=cover&title=Hello&kicker=GTM
 *
 * Templates currently supported:
 *  - cover            : Hero card with kicker + big title
 *  - quote            : Lime-background pull-quote card
 *  - framework        : Numbered framework card (number + title + description)
 *
 * To add a new template:
 *  1. Add a case to the renderTemplate() switch
 *  2. Document the expected URL params at the top of this file
 *  3. Reference the template name in voices/*.md visualAssetNeeded specs
 *
 * Note: This is the PLACEHOLDER renderer. Claude Design templates will replace
 * these with on-brand layouts.
 */

const COLORS = {
  bgPage: "#1A1A1A",
  bgSurface: "#232325",
  bgSurface2: "#2C2C2E",
  offWhite: "#FFFBFF",
  ink2: "rgba(255, 251, 255, 0.78)",
  ink3: "rgba(255, 251, 255, 0.55)",
  ink4: "rgba(255, 251, 255, 0.35)",
  lime: "#E8FFCF",
  mediumPurple: "#D9AFD0",
  strongPurple: "#642585",
  limeInk: "#1A2410",
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
  const baseStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    background: COLORS.bgPage,
    color: COLORS.offWhite,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    padding: 80,
  } as const;

  switch (template) {
    case "quote":
      return (
        <div style={{ ...baseStyle, background: COLORS.lime, color: COLORS.limeInk, alignItems: "center", justifyContent: "center", padding: 120 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 48, width: "100%" }}>
            <div style={{ fontSize: 200, lineHeight: 0.7, fontWeight: 500, color: "#0B0B0B" }}>"</div>
            <div style={{ fontSize: 56, lineHeight: 1.15, fontWeight: 500, color: COLORS.limeInk }}>{title}</div>
            {body && <div style={{ fontSize: 22, color: COLORS.limeInk, opacity: 0.75, fontWeight: 400 }}>{body}</div>}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 32 }}>
              <div style={{ width: 8, height: 8, background: COLORS.strongPurple }} />
              <div style={{ fontSize: 14, letterSpacing: 4, textTransform: "uppercase", fontWeight: 300, color: COLORS.limeInk }}>{kicker}</div>
            </div>
          </div>
        </div>
      );

    case "framework":
      return (
        <div style={{ ...baseStyle, flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 8, height: 8, background: COLORS.mediumPurple }} />
            <div style={{ fontSize: 16, letterSpacing: 4, textTransform: "uppercase", fontWeight: 300, color: COLORS.ink3 }}>{kicker}</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 64 }}>
            <div style={{ fontSize: 180, fontWeight: 300, color: COLORS.mediumPurple, lineHeight: 1, letterSpacing: "-0.02em" }}>{num}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 32, flex: 1, paddingTop: 16 }}>
              <div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 500, color: COLORS.offWhite, letterSpacing: "-0.02em" }}>{title}</div>
              {body && <div style={{ fontSize: 26, lineHeight: 1.4, color: COLORS.ink2, fontWeight: 400 }}>{body}</div>}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 14, letterSpacing: 4, textTransform: "uppercase", fontWeight: 300, color: COLORS.ink4 }}>www.leanscale.team</div>
          </div>
        </div>
      );

    case "cover":
    default:
      return (
        <div style={{ ...baseStyle, flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 8, height: 8, background: COLORS.lime }} />
            <div style={{ fontSize: 18, letterSpacing: 4, textTransform: "uppercase", fontWeight: 300, color: COLORS.ink3 }}>{kicker}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingRight: 100 }}>
            <div style={{ fontSize: 84, lineHeight: 1.0, fontWeight: 500, color: COLORS.offWhite, letterSpacing: "-0.025em" }}>{title}</div>
            {body && <div style={{ fontSize: 28, lineHeight: 1.4, color: COLORS.ink2, fontWeight: 400, maxWidth: 720 }}>{body}</div>}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 32, borderTop: `1px solid ${COLORS.bgSurface2}` }}>
            <div style={{ fontSize: 14, letterSpacing: 4, textTransform: "uppercase", fontWeight: 300, color: COLORS.ink4 }}>www.leanscale.team</div>
            <div style={{ fontSize: 14, letterSpacing: 4, textTransform: "uppercase", fontWeight: 300, color: COLORS.ink4 }}>Placeholder · Claude Design template pending</div>
          </div>
        </div>
      );
  }
}
