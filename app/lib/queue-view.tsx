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
} from "./visual-spec";

const STORAGE_PREFIX = "leanscale-content:published:";
const SPEC_PREFIX = "leanscale-content:visualspec:";

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
  // Effective spec = localStorage override (a regenerated version) or the original.
  const [effectiveSpec, setEffectiveSpec] = useState<VisualSpec | null>(post.visualSpec);
  const [overridden, setOverridden] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SPEC_PREFIX + post.id);
      if (raw) {
        setEffectiveSpec(JSON.parse(raw) as VisualSpec);
        setOverridden(true);
      }
    } catch {}
    setHydrated(true);
  }, [post.id]);

  const persistSpec = (spec: VisualSpec) => {
    setEffectiveSpec(spec);
    setOverridden(true);
    try {
      localStorage.setItem(SPEC_PREFIX + post.id, JSON.stringify(spec));
    } catch {}
  };

  const resetSpec = () => {
    setEffectiveSpec(post.visualSpec);
    setOverridden(false);
    try {
      localStorage.removeItem(SPEC_PREFIX + post.id);
    } catch {}
  };

  const hasVisuals = effectiveSpec !== null && effectiveSpec.slides.length > 0;

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

      {hasVisuals && effectiveSpec && (
        <CarouselBlock postId={post.id} spec={effectiveSpec} overridden={overridden} />
      )}

      {hydrated && (
        <VisualControls
          post={post}
          hasVisuals={hasVisuals}
          overridden={overridden}
          onSpec={persistSpec}
          onReset={resetSpec}
        />
      )}

      <div className="post-actions">
        <CopyButton text={post.postText} />
        <ComposeOnLinkedInButton postText={post.postText} />
      </div>
    </article>
  );
}

function VisualControls({
  post,
  hasVisuals,
  overridden,
  onSpec,
  onReset,
}: {
  post: Post;
  hasVisuals: boolean;
  overridden: boolean;
  onSpec: (spec: VisualSpec) => void;
  onReset: () => void;
}) {
  const [guidance, setGuidance] = useState("");
  const [loading, setLoading] = useState<null | "carousel" | "infographic">(null);
  const [error, setError] = useState("");

  const call = async (mode: "carousel" | "infographic") => {
    setLoading(mode);
    setError("");
    try {
      const res = await fetch("/api/regenerate-visual", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          postText: post.postText,
          topicTitle: post.topicTitle,
          contentType: post.contentType,
          guidance: guidance.trim() || undefined,
          mode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Generation failed.");
      }
      onSpec(data.visualSpec as VisualSpec);
      setGuidance("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setLoading(null);
    }
  };

  // For a post that already has visuals, the "regenerate" mode matches the
  // current kind (1 slide = infographic, else carousel).
  const currentMode: "carousel" | "infographic" =
    hasVisuals && post.visualSpec && post.visualSpec.slides.length === 1
      ? "infographic"
      : "carousel";

  return (
    <div className="visual-controls">
      <div className="visual-controls-head">
        <span className="visual-controls-label">
          {hasVisuals ? "Regenerate visual" : "Generate a visual"}
        </span>
        {overridden && (
          <button className="visual-reset" onClick={onReset}>
            ↺ Reset to original
          </button>
        )}
      </div>

      <input
        type="text"
        className="visual-guidance-input"
        placeholder="Optional: how should it look? e.g. 'lead with the 40% stat, fewer words'"
        value={guidance}
        onChange={(e) => setGuidance(e.target.value)}
        disabled={loading !== null}
      />

      <div className="visual-controls-row">
        {hasVisuals ? (
          <button
            className="btn btn--small btn--primary"
            onClick={() => call(currentMode)}
            disabled={loading !== null}
          >
            {loading ? "Generating…" : `↻ Regenerate ${currentMode}`}
          </button>
        ) : (
          <>
            <button
              className="btn btn--small btn--primary"
              onClick={() => call("carousel")}
              disabled={loading !== null}
            >
              {loading === "carousel" ? "Generating…" : "Generate carousel"}
            </button>
            <button
              className="btn btn--small btn--ghost"
              onClick={() => call("infographic")}
              disabled={loading !== null}
            >
              {loading === "infographic" ? "Generating…" : "Generate infographic"}
            </button>
          </>
        )}
      </div>

      {error && <p className="visual-error">Couldn&apos;t generate: {error}</p>}
    </div>
  );
}

function CarouselBlock({
  postId,
  spec,
  overridden,
}: {
  postId: string;
  spec: VisualSpec;
  overridden: boolean;
}) {
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
        let url = satoriUrl;
        // Use a designed PNG only when not overridden (override = freshly
        // regenerated spec, so the static PNG is stale) and the file exists.
        if (!overridden) {
          try {
            const head = await fetch(pngUrl, { method: "HEAD" });
            if (head.ok) url = pngUrl;
          } catch {}
        }
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
          {overridden && <span className="regenerated-tag"> · regenerated</span>}
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
          <SlideTile
            key={idx}
            postId={postId}
            slide={slide}
            index={idx}
            preferDesigned={!overridden}
          />
        ))}
      </div>
    </div>
  );
}

function SlideTile({
  postId,
  slide,
  index,
  preferDesigned,
}: {
  postId: string;
  slide: SlideSpec;
  index: number;
  preferDesigned: boolean;
}) {
  const slideId = buildSlideId(postId, index);
  const pngUrl = buildAssetPngUrl(postId, index);
  const satoriUrl = buildSlideUrl(slide);
  const filename = buildSlideFilename(postId, index);

  // When the spec is original, prefer a designed PNG (falls back to Satori on
  // error). When regenerated, always use Satori — the static PNG is stale.
  const [imgSrc, setImgSrc] = useState(preferDesigned ? pngUrl : satoriUrl);
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
