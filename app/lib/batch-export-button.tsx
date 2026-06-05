"use client";

import { useState } from "react";
import type { Batch } from "./types";
import { buildBatchExport } from "./visual-spec";

export function BatchExportButton({ batch }: { batch: Batch }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const doc = buildBatchExport(batch);
    try {
      await navigator.clipboard.writeText(doc);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("copy failed:", e);
    }
  };

  const visualCount = batch.posts.filter(
    (p) => p.visualSpec !== null && p.visualSpec.slides.length > 0
  ).length;

  if (visualCount === 0) return null;

  return (
    <button onClick={handleClick} className="btn btn--ghost-dark btn--small">
      {copied
        ? `Copied — ${visualCount} posts ready for Claude ✓`
        : `Export ${visualCount} visual posts for Claude design →`}
    </button>
  );
}
