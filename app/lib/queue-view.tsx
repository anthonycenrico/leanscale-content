"use client";

import { useEffect, useState } from "react";
import type { Post } from "./types";
import { contentTypeChipClass } from "./types";
import { CopyButton, ComposeOnLinkedInButton } from "./post-actions";

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

      {isCarousel && post.visualAssetNeeded && (
        <div className="visual-asset-block">
          <span className="visual-asset-label">Visual asset spec</span>
          <div className="visual-asset-text">{post.visualAssetNeeded}</div>
          <div className="visual-asset-status">
            PNG rendering pending — Claude Design template exports needed. Until then, copy this spec into your favorite design tool.
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
