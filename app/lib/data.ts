import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Batch, Post, AuthorSlug, VoiceProfile } from "./types";

const OUTPUT_DIR = path.join(process.cwd(), "output");
const VOICES_DIR = path.join(process.cwd(), "voices");

export async function getVoiceProfile(slug: string): Promise<VoiceProfile | null> {
  const filePath = path.join(VOICES_DIR, `${slug}.md`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(raw);
    const bodyHtml = await marked.parse(content);
    return {
      slug,
      name: String(data.name ?? slug),
      role: String(data.role ?? ""),
      linkedin: String(data.linkedin ?? ""),
      confidence: String(data.confidence ?? "unknown"),
      lastUpdated: String(data.last_updated ?? ""),
      bodyHtml: typeof bodyHtml === "string" ? bodyHtml : "",
    };
  } catch {
    return null;
  }
}

export async function getAllBatches(): Promise<Batch[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(OUTPUT_DIR);
  } catch {
    return [];
  }

  const batchEntries = entries.filter((e) => !e.startsWith("."));
  const batches: Batch[] = [];

  for (const entry of batchEntries) {
    const postsPath = path.join(OUTPUT_DIR, entry, "posts.json");
    try {
      const stat = await fs.stat(postsPath);
      if (!stat.isFile()) continue;
      const raw = await fs.readFile(postsPath, "utf-8");
      const batch = JSON.parse(raw) as Batch;
      batches.push(batch);
    } catch {
      // skip malformed entries
    }
  }

  return batches.sort((a, b) => {
    const aDate = new Date(a.generatedAt).getTime();
    const bDate = new Date(b.generatedAt).getTime();
    return bDate - aDate;
  });
}

export async function getLatestBatch(): Promise<Batch | null> {
  const batches = await getAllBatches();
  return batches[0] ?? null;
}

export async function getBatch(batchId: string): Promise<Batch | null> {
  const batches = await getAllBatches();
  return batches.find((b) => b.batchId === batchId) ?? null;
}

export async function getPostsForAuthor(
  slug: AuthorSlug,
  options: { batchId?: string } = {}
): Promise<Post[]> {
  const batches = options.batchId
    ? [await getBatch(options.batchId)].filter((b): b is Batch => b !== null)
    : await getAllBatches();

  return batches.flatMap((batch) =>
    batch.posts.filter((post) => post.authorSlug === slug)
  );
}

export function countByContentType(posts: Post[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const post of posts) {
    counts[post.contentType] = (counts[post.contentType] ?? 0) + 1;
  }
  return counts;
}

export function countCarousels(posts: Post[]): number {
  return posts.filter((p) =>
    p.contentType.toUpperCase().includes("CAROUSEL") ||
    p.contentType.toUpperCase().includes("INFOGRAPHIC")
  ).length;
}
