import Link from "next/link";
import { getLatestBatch, countCarousels } from "./lib/data";
import { AUTHOR_META, AUTHOR_ORDER } from "./lib/types";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function HomePage() {
  const batch = await getLatestBatch();

  if (!batch) {
    return (
      <main>
        <header className="hero">
          <div className="container">
            <span className="kicker"><span className="dot" />No batches yet</span>
            <h1>Drop a transcript to generate your first batch.</h1>
            <p className="hero-sub">
              The ghostwriter skill writes batches into <code>output/</code> and
              this page picks them up automatically.
            </p>
          </div>
        </header>
      </main>
    );
  }

  const transcriptList = batch.source.transcripts
    .map((t) => `${t.guest} — ${t.topic}`)
    .join(" · ");

  return (
    <main>
      <header className="hero">
        <div className="container">
          <span className="kicker kicker--lime">
            <span className="dot" />Latest batch · {batch.batchId}
          </span>
          <h1>{batch.posts.length} posts ready for the team.</h1>
          <p className="hero-sub">
            Pick your name below to see your queue. Tap copy on any post and
            paste straight into LinkedIn.
          </p>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <span className="hero-meta-lbl">Generated</span>
              <span className="hero-meta-val">{formatDate(batch.generatedAt)}</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-lbl">Posts</span>
              <span className="hero-meta-val">{batch.posts.length}</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-lbl">Topics mined</span>
              <span className="hero-meta-val">{batch.topics.length}</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-lbl">Carousels</span>
              <span className="hero-meta-val">{countCarousels(batch.posts)}</span>
            </div>
          </div>
          {transcriptList && (
            <p className="hero-sub" style={{ marginTop: "var(--space-5)", fontSize: 13, color: "var(--ink-3)" }}>
              Source: {transcriptList}
            </p>
          )}
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker"><span className="dot" />The team</span>
            <h2 className="section-title">Pick your queue</h2>
          </div>

          <div className="author-grid">
            {AUTHOR_ORDER.map((slug) => {
              const meta = AUTHOR_META[slug];
              const posts = batch.posts.filter((p) => p.authorSlug === slug);
              const carousels = countCarousels(posts);
              return (
                <Link key={slug} href={`/${slug}` as `/${string}`} className="author-card">
                  <div>
                    <h3 className="author-card-name">{meta.name}</h3>
                    <p className="author-card-role">{meta.role}</p>
                  </div>
                  <div className="author-card-stats">
                    <div className="author-card-stat">
                      <span className="author-card-stat-num">{posts.length}</span>
                      <span className="author-card-stat-lbl">Posts</span>
                    </div>
                    <div className="author-card-stat">
                      <span className="author-card-stat-num">{carousels}</span>
                      <span className="author-card-stat-lbl">Carousels</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}
