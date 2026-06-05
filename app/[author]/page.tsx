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
      <section className="section section--dark hero">
        <div className="wrap">
          <p className="tag tag--on-dark">
            <Link href="/" style={{ color: "inherit", borderBottom: "1px solid currentColor" }}>
              ← All authors
            </Link>
          </p>
          <h1 className="display" style={{ marginTop: "var(--space-5)" }}>
            {meta.name}
          </h1>
          <p className="lede" style={{ marginTop: "var(--space-5)" }}>{meta.role}</p>

          <div className="stats">
            <div className="stat">
              <p className="stat__k">Batch</p>
              <p className="stat__v">{batch?.batchId ?? "—"}</p>
            </div>
            <div className="stat">
              <p className="stat__k">Posts in queue</p>
              <p className="stat__v">{posts.length}</p>
            </div>
            <div className="stat">
              <p className="stat__k">Voice confidence</p>
              <p className="stat__v">{meta.confidence}</p>
            </div>
          </div>
        </div>
      </section>

      {voice && (
        <section className="section section--gray">
          <div className="wrap">
            <div className="section-head">
              <p className="tag">Voice profile</p>
              <h2 className="h-section">How your voice was built.</h2>
              <p className="lede">
                A behind-the-scenes look at the characteristics the ghostwriter
                pulls from when generating your posts. Edit{" "}
                <code>voices/{slug}.md</code> to refine it.
              </p>
            </div>

            <details className="voice-overview">
              <summary className="voice-overview-summary">
                <span className="tag">View full profile</span>
                <span className="voice-overview-summary-meta">Click to expand</span>
              </summary>
              <div className="voice-overview-body">
                <div className="voice-overview-meta">
                  <div className="voice-overview-meta-item">
                    <span className="voice-overview-meta-lbl">LinkedIn</span>
                    {voice.linkedin ? (
                      <a
                        href={voice.linkedin}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="voice-overview-meta-val"
                      >
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

      <section className="section section--light">
        <div className="wrap">
          <div className="section-head">
            <p className="tag">Your queue</p>
            <h2 className="h-section">Ready to publish.</h2>
            <p className="lede">
              Mark posts as published as you go. Published posts move to the
              bottom and dim. State persists across batches.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="queue-empty">
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
