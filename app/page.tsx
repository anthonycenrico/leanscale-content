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
        <section className="section section--dark hero">
          <div className="wrap">
            <p className="tag tag--on-dark">No batches yet</p>
            <h1 className="display" style={{ marginTop: "var(--space-5)" }}>
              Drop a transcript to generate your first batch.
            </h1>
            <p className="lede" style={{ marginTop: "var(--space-6)" }}>
              The ghostwriter skill writes batches into <code>output/</code> and
              this page picks them up automatically.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const transcriptList = batch.source.transcripts
    .map((t) => `${t.guest} — ${t.topic}`)
    .join(" · ");

  return (
    <main>
      <section className="section section--dark hero">
        <div className="wrap">
          <p className="tag tag--on-dark">Latest batch · {batch.batchId}</p>
          <h1 className="display" style={{ marginTop: "var(--space-5)" }}>
            {batch.posts.length} posts ready
            <br />
            <span className="hero__em">for the team.</span>
          </h1>
          <p className="lede" style={{ marginTop: "var(--space-6)", maxWidth: "60ch" }}>
            Pick your name below to see your queue. Copy any post and paste it
            straight into LinkedIn.
          </p>
          {transcriptList && (
            <p
              className="tag tag--on-dark"
              style={{
                marginTop: "var(--space-7)",
                color: "var(--fg-on-dark-2)",
                opacity: 0.8,
              }}
            >
              Source · {transcriptList}
            </p>
          )}

          <div className="stats">
            <div className="stat">
              <p className="stat__k">Generated</p>
              <p className="stat__v">{formatDate(batch.generatedAt)}</p>
            </div>
            <div className="stat">
              <p className="stat__k">Posts</p>
              <p className="stat__v">{batch.posts.length}</p>
            </div>
            <div className="stat">
              <p className="stat__k">Topics mined</p>
              <p className="stat__v">{batch.topics.length}</p>
            </div>
            <div className="stat">
              <p className="stat__k">Carousels</p>
              <p className="stat__v">{countCarousels(batch.posts)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="wrap">
          <div className="section-head">
            <p className="tag">The team</p>
            <h2 className="h-section">Pick your queue.</h2>
            <p className="lede">
              Five voices, five queues. Each person sees the posts written for them
              and the voice profile that produced them.
            </p>
          </div>

          <div className="pcards">
            {AUTHOR_ORDER.map((slug, idx) => {
              const meta = AUTHOR_META[slug];
              const posts = batch.posts.filter((p) => p.authorSlug === slug);
              const carousels = countCarousels(posts);
              const numStr = String(idx + 1).padStart(2, "0");
              return (
                <Link
                  key={slug}
                  href={`/${slug}` as `/${string}`}
                  className="pcard"
                >
                  <div className="pcard__top">
                    <span className="pcard__num">Author {numStr}</span>
                  </div>
                  <h3 className="pcard__title">{meta.name}</h3>
                  <p className="pcard__body">{meta.role}</p>
                  <div className="pcard__foot">
                    <div className="pcard__stat">
                      <span className="pcard__stat-k">Posts</span>
                      <span className="pcard__stat-v">{posts.length}</span>
                    </div>
                    <div className="pcard__stat">
                      <span className="pcard__stat-k">Carousels</span>
                      <span className="pcard__stat-v">{carousels}</span>
                    </div>
                  </div>
                  <span className="pcard__link">Open queue →</span>
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
