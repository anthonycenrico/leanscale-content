import Link from "next/link";
import { notFound } from "next/navigation";
import { getLatestBatch, getVoiceProfile } from "../lib/data";
import { AUTHOR_META, AUTHOR_ORDER, type AuthorSlug } from "../lib/types";
import { QueueView } from "../lib/queue-view";

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
  const [batch, voice] = await Promise.all([
    getLatestBatch(),
    getVoiceProfile(slug),
  ]);
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

      {voice && (
        <section className="section section--voice">
          <div className="container">
            <details className="voice-overview">
              <summary className="voice-overview-summary">
                <span className="kicker kicker--lime">
                  <span className="dot" />
                  How your voice was built
                </span>
                <span className="voice-overview-summary-meta">
                  Click to expand · {voice.bodyHtml ? "full profile" : "no body"}
                </span>
              </summary>
              <div className="voice-overview-body">
                <div className="voice-overview-meta">
                  <div className="voice-overview-meta-item">
                    <span className="voice-overview-meta-lbl">LinkedIn</span>
                    {voice.linkedin ? (
                      <a href={voice.linkedin} target="_blank" rel="noreferrer noopener" className="voice-overview-meta-val">
                        {voice.linkedin.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <span className="voice-overview-meta-val">—</span>
                    )}
                  </div>
                  <div className="voice-overview-meta-item">
                    <span className="voice-overview-meta-lbl">Confidence</span>
                    <span className="voice-overview-meta-val">{voice.confidence}</span>
                  </div>
                  <div className="voice-overview-meta-item">
                    <span className="voice-overview-meta-lbl">Last updated</span>
                    <span className="voice-overview-meta-val">{voice.lastUpdated || "—"}</span>
                  </div>
                </div>
                <div
                  className="voice-overview-content"
                  dangerouslySetInnerHTML={{ __html: voice.bodyHtml }}
                />
              </div>
            </details>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <p style={{ color: "var(--ink-3)" }}>
              No posts in this batch for {meta.name}.
            </p>
          ) : (
            <QueueView posts={posts} />
          )}
        </div>
      </section>
    </main>
  );
}
