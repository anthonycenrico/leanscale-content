import Link from "next/link";
import { notFound } from "next/navigation";
import { getLatestBatch, getPostsForAuthor } from "../lib/data";
import {
  AUTHOR_META,
  AUTHOR_ORDER,
  contentTypeChipClass,
  type AuthorSlug,
} from "../lib/types";
import { CopyButton, ComposeOnLinkedInButton } from "../lib/post-actions";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return AUTHOR_ORDER.map((slug) => ({ author: slug }));
}

interface PageProps {
  params: Promise<{ author: string }>;
}

export default async function AuthorPage({ params }: PageProps) {
  const { author } = await params;

  if (!AUTHOR_ORDER.includes(author as AuthorSlug)) {
    notFound();
  }

  const slug = author as AuthorSlug;
  const meta = AUTHOR_META[slug];
  const batch = await getLatestBatch();
  const posts = batch ? batch.posts.filter((p) => p.authorSlug === slug) : [];

  return (
    <main>
      <header className="hero">
        <div className="container">
          <span className="kicker">
            <span className="dot" />
            <Link href="/" style={{ color: "inherit" }}>← All authors</Link>
          </span>
          <h1>{meta.name}</h1>
          <p className="hero-sub">{meta.role}</p>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <span className="hero-meta-lbl">Batch</span>
              <span className="hero-meta-val">{batch?.batchId ?? "—"}</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-lbl">Posts in queue</span>
              <span className="hero-meta-val">{posts.length}</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-lbl">Voice confidence</span>
              <span className="hero-meta-val">{meta.confidence}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <p style={{ color: "var(--ink-3)" }}>No posts in this batch for {meta.name}.</p>
          ) : (
            <div className="post-list">
              {posts.map((post) => {
                const isCarousel =
                  post.contentType.toUpperCase().includes("CAROUSEL") ||
                  post.contentType.toUpperCase().includes("INFOGRAPHIC");

                return (
                  <article key={post.id} className="post-card">
                    <div className="post-card-head">
                      <div className="post-card-meta-left">
                        <span className={`content-type-chip ${contentTypeChipClass(post.contentType)}`}>
                          {post.contentType}
                        </span>
                        <span className={`status-chip status-chip--${post.status}`}>
                          {post.status}
                        </span>
                      </div>
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
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
