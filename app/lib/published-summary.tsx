"use client";

import { useEffect, useState } from "react";

const STORAGE_PREFIX = "leanscale-content:published:";

/**
 * Client island for the home hero. Published state lives in localStorage
 * (per-post, per-browser), so the ready/published split can only be computed
 * on the client. Until hydrated it shows the total as "ready" and a dash for
 * published, so the server-rendered markup stays stable.
 */
export function PublishedSummary({ postIds }: { postIds: string[] }) {
  const [published, setPublished] = useState<number | null>(null);

  useEffect(() => {
    let n = 0;
    for (const id of postIds) {
      try {
        if (localStorage.getItem(STORAGE_PREFIX + id) === "true") n++;
      } catch {
        // ignore
      }
    }
    setPublished(n);
  }, [postIds]);

  const total = postIds.length;
  const ready = published === null ? total : total - published;

  return (
    <>
      <div className="stat">
        <p className="stat__k">Ready to post</p>
        <p className="stat__v">{ready}</p>
      </div>
      <div className="stat">
        <p className="stat__k">Published</p>
        <p className="stat__v">{published === null ? "—" : published}</p>
      </div>
    </>
  );
}
