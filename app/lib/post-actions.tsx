"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = "Copy text" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button onClick={handleCopy} className="btn btn--lime">
      {copied ? "Copied ✓" : `${label} →`}
    </button>
  );
}

interface ComposeButtonProps {
  postText: string;
}

export function ComposeOnLinkedInButton({ postText }: ComposeButtonProps) {
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(postText);
    } catch {
      // ignore — open the composer anyway
    }
    window.open("https://www.linkedin.com/feed/?shareActive=true", "_blank");
  };

  return (
    <button onClick={handleClick} className="btn btn--ghost">
      Compose on LinkedIn ↗
    </button>
  );
}
