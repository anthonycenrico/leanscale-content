import Link from "next/link";
import { getProdBatches, getAllPosts, countCarousels } from "./lib/data";
import { AUTHOR_META, AUTHOR_ORDER } from "./lib/types";
import { BatchExportButton } from "./lib/batch-export-button";
import { PublishedSummary } from "./lib/published-summary";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function HomePage() {
  const [batches, allPosts] = await Promise.all([getProdBatches(), getAllPosts()]);

  if (allPosts.length === 0) {
    return (
      <main>
        <section className="section section--dark hero">
          <div className="wrap">
            <p className="tag tag--on-dark">No batches yet</p>
            <h1 className="display" style={{ marginTop: "var(--space-5)" }}>
              Drop a transcript to generate your first batch.
            </h1>
          </div>
        </section>
      </main>
    );
  }

  const totalTopics = batches.reduce((n, b) => n + (b.topics?.length ?? 0), 0);
  const postIds = allPosts.map((p) => p.id);
  const latest = batches[0];

  return (
    <main>
      <section className="section section--dark hero">
        <div className="wrap">
          <p className="tag tag--on-dark">LeanScale Content</p>
          <h1 className="display" style={{ marginTop: "var(--space-5)" }}>
            Your content queue.
            <br />
            <span className="hero__em">Every batch, all five voices.</span>
          </h1>
          <p className="lede" style={{ marginTop: "var(--space-6)", maxWidth: "60ch" }}>
            The queue is additive — every new batch stacks on top, nothing gets
            replaced. Pick your name to see your full queue, mark posts published
            as you go.
          </p>

          <div className="hero__cta" style={{ marginTop: "var(--space-7)" }}>
            <BatchExportButton batch={latest} />
          </div>

          <div className="stats">
            <div className="stat">
              <p className="stat__k">Total posts</p>
              <p className="stat__v">{allPosts.length}</p>
            </div>
            <PublishedSummary postIds={postIds} />
            <div className="stat">
              <p className="stat__k">Batches</p>
              <p className="stat__v">{batches.length}</p>
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
              Each person sees every post written for them across all batches, plus
              the voice profile that produced them.
            </p>
          </div>

          <div className="pcards">
            {AUTHOR_ORDER.map((slug, idx) => {
              const meta = AUTHOR_META[slug];
              const posts = allPosts.filter((p) => p.authorSlug === slug);
              const visuals = countCarousels(posts);
              const numStr = String(idx + 1).padStart(2, "0");
              return (
                <Link key={slug} href={`/${slug}` as `/${string}`} className="pcard">
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
                      <span className="pcard__stat-k">Visuals</span>
                      <span className="pcard__stat-v">{visuals}</span>
                    </div>
                  </div>
                  <span className="pcard__link">Open queue →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--gray">
        <div className="wrap">
          <div className="section-head">
            <p className="tag">History</p>
            <h2 className="h-section">Batches.</h2>
            <p className="lede">
              Every batch is preserved. New topics add to the queue — they never
              delete what came before.
            </p>
          </div>

          <div className="batch-list">
            {batches.map((b) => {
              const visuals = countCarousels(b.posts);
              const src = (b.source?.transcripts ?? [])
                .map((t) => t.guest)
                .filter(Boolean)
                .join(", ");
              return (
                <div key={b.batchId} className="batch-row">
                  <div className="batch-row-main">
                    <span className="batch-row-date">{formatDate(b.generatedAt)}</span>
                    <span className="batch-row-note">
                      {src || b.source?.note || b.batchId}
                    </span>
                  </div>
                  <div className="batch-row-stats">
                    <span>{b.posts.length} posts</span>
                    <span className="batch-row-divider">·</span>
                    <span>{visuals} visuals</span>
                  </div>
                </div>
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
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}
