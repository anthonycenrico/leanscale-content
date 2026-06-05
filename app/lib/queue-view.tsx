"use client";

import { useEffect, useState } from "react";
import type { Post, VisualSpec } from "./types";
import { contentTypeChipClass } from "./types";
import { CopyButton, ComposeOnLinkedInButton } from "./post-actions";
import { buildSlideUrl, buildSlideFilename } from "./visual-spec";

const STORAGE_PREFIX = "leanscale-ghostwriter:published:";

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
            className="btn btn--small"
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
  const isCarousel =
    post.contentType.toUpperCase().includes("CAROUSEL") ||
    post.contentType.toUpperCase().includes("INFOGRAPHIC");

  return (
    <article className={`post-card ${isPublished ? "post-card--published" : ""}`}>
      <div className="post-card-head">
        <div className="post-card-meta-left">
          <span className={`content-type-chip ${contentTypeChipClass(post.contentType)}`}>
            {post.contentType}
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

      {isCarousel && post.visualSpec && post.visualSpec.slides.length > 0 && (
        <CarouselBlock postId={post.id} spec={post.visualSpec} />
      )}

      {isCarousel && !post.visualSpec && post.visualAssetNeeded && (
        <div className="visual-asset-block">
          <span className="visual-asset-label">Visual asset spec</span>
          <div className="visual-asset-text">{post.visualAssetNeeded}</div>
          <div className="visual-asset-status">
            Structured visualSpec not yet defined for this post — using free-text fallback. The next batch of generated posts will include slide-by-slide specs.
          </div>
        </div>
      )}

      <div className="post-actions">
        <CopyButton text={post.postText} />
        <ComposeOnLinkedInButton postText={post.postText} />
      </div>
    </article>
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
        await downloadSlide(buildSlideUrl(slide), buildSlideFilename(postId, i));
        // tiny pause so the browser doesn't block sequential downloads
        await new Promise((r) => setTimeout(r, 220));
      }
    } finally {
      setDownloadingAll(false);
    }
  };

  return (
    <div className="carousel-block">
      <div className="carousel-block-head">
        <span className="visual-asset-label">Carousel · {spec.slides.length} slides</span>
        <button
          className="btn btn--small btn--lime"
          onClick={downloadAll}
          disabled={downloadingAll}
        >
          {downloadingAll ? "Downloading…" : "Download all →"}
        </button>
      </div>

      <div className="slide-grid">
        {spec.slides.map((slide, idx) => {
          const url = buildSlideUrl(slide);
          const filename = buildSlideFilename(postId, idx);
          return (
            <div key={idx} className="slide-tile">
              <div className="slide-tile-img-wrap">
                <img
                  src={url}
                  alt={`Slide ${idx + 1}: ${slide.params.title}`}
                  className="slide-tile-img"
                  loading="lazy"
                />
              </div>
              <div className="slide-tile-foot">
                <span className="slide-tile-meta">
                  Slide {String(idx + 1).padStart(2, "0")} · {slide.template}
                </span>
                <button
                  className="slide-tile-download"
                  onClick={() => downloadSlide(url, filename)}
                  title="Download PNG"
                >
                  ↓ PNG
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
