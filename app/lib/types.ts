export type ContentType =
  | "CONTRARIAN HOOK"
  | "TACTICAL PLAYBOOK"
  | "PERSONAL STORY"
  | "INDUSTRY OBSERVATION"
  | "SOFT EDUCATIONAL"
  | "CAROUSEL/INFOGRAPHIC"
  | "LISTICLE"
  | "CASE STUDY SNIPPET";

export type AuthorSlug = "jake" | "joe" | "cameron" | "yasin" | "anthony";

export type PostStatus = "draft" | "approved" | "posted";

export interface TopicKernel {
  title: string;
  angle: string;
  sourceQuote: string;
  sourcePerson: string;
  bestFor: string[];
  bestForRole: string[];
  domain: string;
}

export type SlideTemplate =
  | "cover"
  | "framework"
  | "quote"
  | "dark"
  | "stat"
  | "listicle";

export interface SlideSpec {
  template: SlideTemplate;
  params: {
    kicker?: string;
    title: string;
    body?: string;
    num?: string;
    items?: string[];
    stat?: string;
    statLabel?: string;
  };
}

export interface VisualSpec {
  slides: SlideSpec[];
}

export interface Post {
  id: string;
  batchId: string;
  author: string;
  authorSlug: AuthorSlug;
  contentType: string;
  topicTitle: string;
  postText: string;
  voiceNotes: string;
  visualAssetNeeded: string;
  visualSpec: VisualSpec | null;
  status: PostStatus;
  scheduledFor: string | null;
  postedAt: string | null;
  linkedInUrl: string | null;
  createdAt: string;
}

export interface Batch {
  batchId: string;
  generatedAt: string;
  source: {
    type: string;
    note?: string;
    transcripts: Array<{
      guest: string;
      topic: string;
      file?: string;
    }>;
  };
  topics: TopicKernel[];
  posts: Post[];
}

export interface AuthorMeta {
  slug: AuthorSlug;
  name: string;
  role: string;
  confidence: string;
}

export interface VoiceProfile {
  slug: string;
  name: string;
  role: string;
  linkedin: string;
  confidence: string;
  lastUpdated: string;
  bodyHtml: string;
}

export const AUTHOR_META: Record<AuthorSlug, AuthorMeta> = {
  jake:    { slug: "jake",    name: "Jake Toepel",     role: "Head of Engineering & Product", confidence: "medium-low" },
  joe:     { slug: "joe",     name: "Joe Zaghloul",    role: "Head of Revenue",               confidence: "medium" },
  cameron: { slug: "cameron", name: "Cameron Legge",   role: "Head of Customers",             confidence: "medium-high" },
  yasin:   { slug: "yasin",   name: "Yasin Arshad",    role: "Head of Marketing & Education", confidence: "medium-high" },
  anthony: { slug: "anthony", name: "Anthony Enrico",  role: "Co-founder & CEO",              confidence: "medium-high" },
};

export const AUTHOR_ORDER: AuthorSlug[] = ["anthony", "joe", "cameron", "yasin", "jake"];

export function contentTypeChipClass(contentType: string): string {
  const ct = contentType.toUpperCase();
  if (ct.includes("CONTRARIAN")) return "content-type-chip--contrarian";
  if (ct.includes("PLAYBOOK")) return "content-type-chip--playbook";
  if (ct.includes("STORY")) return "content-type-chip--story";
  if (ct.includes("OBSERVATION")) return "content-type-chip--observation";
  if (ct.includes("EDUCATIONAL")) return "content-type-chip--educational";
  if (ct.includes("CAROUSEL") || ct.includes("INFOGRAPHIC")) return "content-type-chip--carousel";
  if (ct.includes("LISTICLE")) return "content-type-chip--listicle";
  if (ct.includes("CASE")) return "content-type-chip--case";
  return "";
}
