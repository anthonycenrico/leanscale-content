"use client";

import { useEffect, useState } from "react";
import type { Post, VisualSpec, SlideSpec } from "./types";
import { contentTypeChipClass } from "./types";
import { CopyButton, ComposeOnLinkedInButton } from "./post-actions";
import {
  buildSlideUrl,
  buildSlideFilename,
  buildAssetPngUrl,
  buildSlideId,
  buildPostDesignBrief,
} from "./visual-spec";

const STORAGE_PREFIX = "leanscale-content:published:";

function formatBatchChip(batchId: string): string {
  // batchId like "2026-06-06" -> "Jun 6". Falls back to the raw id.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(batchId);
  if (!m) return batchId;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mo = months[Number(m[2]) - 1] ?? m[2];
  return `${mo} ${Number(m[3])}`;
}

interface QueueViewProps {
  posts: Post[];
}

export function QueueView({ posts }: QueueViewProps) {
  const [publishedIds, setPublishedIds] = useState<Set<string>>(new Set());
  const [showPublished, setShowPublished] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const ids = new Set<string>();
    posts.forEach((p) => {
      try {
        if (localStorage.getItem(STORAGE_PREFIX + p.id) === "true") {
          ids.add(p.id);
        }
      } catch {
        // localStorage unavailable — ignore
      }
    });
    setPublishedIds(ids);
    setHydrated(true);
  }, [posts]);

  const togglePublished = (id: string) => {
    const next = new Set(publishedIds);
    if (next.has(id)) {
      next.delete(id);
      try {
        localStorage.removeItem(STORAGE_PREFIX + id);
      } catch {}
    } else {
      next.add(id);
      try {
        localStorage.setItem(STORAGE_PREFIX + id, "true");
      } catch {}
    }
    setPublishedIds(next);
  };

  const unpublished = posts.filter((p) => !publishedIds.has(p.id));
  const published = posts.filter((p) => publishedIds.has(p.id));

  return (
    <>
      <div className="queue-counter">
        <span className="queue-count-text">
          <strong>{unpublished.length}</strong> ready
          <span className="queue-count-divider">·</span>
          <strong>{published.length}</strong> published
        </span>
        {hydrated && published.length > 0 && (
          <button
            onClick={() => setShowPublished(!showPublished)}
            className="btn btn--small btn--ghost"
          >
            {showPublished ? "Hide published" : `Show published (${published.length})`}
          </button>
        )}
      </div>

      {hydrated && unpublished.length === 0 && (
        <p className="queue-empty">All caught up — every post in this batch has been published.</p>
      )}

      <div className="post-list">
        {unpublished.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isPublished={false}
            onToggle={() => togglePublished(post.id)}
          />
        ))}
      </div>

      {hydrated && published.length > 0 && showPublished && (
        <>
          <div className="queue-divider">
            <span className="queue-divider-label">Published</span>
          </div>
          <div className="post-list">
            {published.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isPublished={true}
                onToggle={() => togglePublished(post.id)}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function PostCard({
  post,
  isPublished,
  onToggle,
}: {
  post: Post;
  isPublished: boolean;
  onToggle: () => void;
}) {
  const hasVisuals = post.visualSpec !== null && post.visualSpec.slides.length > 0;

  return (
    <article className={`post-card ${isPublished ? "post-card--published" : ""}`}>
      <div className="post-card-head">
        <div className="post-card-meta-left">
          <span className={`content-type-chip ${contentTypeChipClass(post.contentType)}`}>
            {post.contentType}
          </span>
          <span className="batch-chip" title={`Batch ${post.batchId}`}>
            {formatBatchChip(post.batchId)}
          </span>
        </div>
        <label className={`publish-toggle ${isPublished ? "publish-toggle--on" : ""}`}>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={onToggle}
            className="publish-toggle-input"
          />
          <span className="publish-toggle-label">
            {isPublished ? "Published ✓" : "Mark as published"}
          </span>
        </label>
      </div>

      <h2 className="post-topic-title">{post.topicTitle}</h2>

      <div className="post-body">{post.postText}</div>

      {post.voiceNotes && (
        <div className="voice-notes">
          <span className="voice-notes-label">Voice notes</span>
          {post.voiceNotes}
        </div>
      )}

      {hasVisuals && post.visualSpec && (
        <CarouselBlock postId={post.id} spec={post.visualSpec} />
      )}

      {hasVisuals && post.visualSpec && (
        <DesignNotes brief={buildPostDesignBrief(post)} />
      )}

      {!hasVisuals && post.visualAssetNeeded && (
        <div className="visual-asset-block">
          <span className="visual-asset-label">Visual asset spec</span>
          <div className="visual-asset-text">{post.visualAssetNeeded}</div>
        </div>
      )}

      <div className="post-actions">
        <CopyButton text={post.postText} />
        <ComposeOnLinkedInButton postText={post.postText} />
      </div>
    </article>
  );
}

function DesignNotes({ brief }: { brief: string }) {
  const [copied, setCopied] = useState(false);
  if (!brief) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("copy failed:", e);
    }
  };

  return (
    <details className="design-notes">
      <summary className="design-notes-summary">
        <span className="visual-asset-label">Tweak this in Claude Design</span>
        <span className="design-notes-hint">
          Copy the description, redesign the look, keep the slide IDs
        </span>
      </summary>
      <div className="design-notes-body">
        <button className="btn btn--small btn--ghost" onClick={copy}>
          {copied ? "Copied ✓" : "Copy design notes"}
        </button>
        <pre className="design-notes-pre">{brief}</pre>
      </div>
    </details>
  );
}

function CarouselBlock({ postId, spec }: { postId: string; spec: VisualSpec }) {
  const [downloadingAll, setDownloadingAll] = useState(false);

  const downloadSlide = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("download failed:", e);
    }
  };

  const downloadAll = async () => {
    setDownloadingAll(true);
    try {
      for (let i = 0; i < spec.slides.length; i++) {
        const slide = spec.slides[i];
        const pngUrl = buildAssetPngUrl(postId, i);
        const satoriUrl = buildSlideUrl(slide);
        // Prefer the designed PNG; fall back to Satori if it isn't there yet.
        let url = satoriUrl;
        try {
          const head = await fetch(pngUrl, { method: "HEAD" });
          if (head.ok) url = pngUrl;
        } catch {}
        await downloadSlide(url, buildSlideFilename(postId, i));
        await new Promise((r) => setTimeout(r, 220));
      }
    } finally {
      setDownloadingAll(false);
    }
  };

  const single = spec.slides.length === 1;

  return (
    <div className="carousel-block">
      <div className="carousel-block-head">
        <span className="visual-asset-label">
          {single ? "Infographic · 1 slide" : `Carousel · ${spec.slides.length} slides`}
        </span>
        <button
          className="btn btn--small btn--lime"
          onClick={downloadAll}
          disabled={downloadingAll}
        >
          {downloadingAll ? "Downloading…" : single ? "Download PNG →" : "Download all →"}
        </button>
      </div>

      <div className="slide-grid">
        {spec.slides.map((slide, idx) => (
          <SlideTile key={idx} postId={postId} slide={slide} index={idx} />
        ))}
      </div>
    </div>
  );
}

function SlideTile({
  postId,
  slide,
  index,
}: {
  postId: string;
  slide: SlideSpec;
  index: number;
}) {
  const slideId = buildSlideId(postId, index);
  const pngUrl = buildAssetPngUrl(postId, index);
  const satoriUrl = buildSlideUrl(slide);
  const filename = buildSlideFilename(postId, index);

  // Prefer the designed PNG; fall back to the Satori render on error.
  const [imgSrc, setImgSrc] = useState(pngUrl);
  const [isDesigned, setIsDesigned] = useState<boolean | null>(null);

  const handleError = () => {
    if (imgSrc !== satoriUrl) {
      setImgSrc(satoriUrl);
      setIsDesigned(false);
    }
  };

  const handleLoad = () => {
    if (isDesigned === null) {
      setIsDesigned(imgSrc === pngUrl);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(imgSrc);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("download failed:", e);
    }
  };

  return (
    <div className="slide-tile">
      <div className="slide-tile-img-wrap">
        <img
          src={imgSrc}
          alt={`Slide ${index + 1}: ${slide.params.title ?? ""}`}
          className="slide-tile-img"
          loading="lazy"
          onError={handleError}
          onLoad={handleLoad}
        />
      </div>
      <div className="slide-tile-foot">
        <span className="slide-tile-meta">
          Slide {String(index + 1).padStart(2, "0")} ·{" "}
          {isDesigned ? "designed" : slide.template}
        </span>
        <button
          className="slide-tile-download"
          onClick={handleDownload}
          title={`Download ${slideId}.png`}
        >
          ↓ PNG
        </button>
      </div>
    </div>
  );
}
