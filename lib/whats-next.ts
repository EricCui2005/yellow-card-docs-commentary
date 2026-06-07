// "What's Next" mirrors the per-page connections.next from the original
// site (crawled into content/whats-next.json). Most pages have no explicit
// next; in that case getWhatsNext returns null and the section is omitted —
// which matches the original site.
//
// Kept in its own file (not in lib/navigation.ts) because navigation.ts is
// imported by client components, and node:fs can't be bundled into them.
import fs from "fs";
import path from "path";

export interface WhatsNextPage {
  slug: string;
  title: string;
  type?: string;
}

export interface WhatsNextEntry {
  description: string | null;
  pages: WhatsNextPage[];
  external: { url: string; new_tab: boolean } | null;
}

let cache: Record<string, WhatsNextEntry> | null = null;

function load(): Record<string, WhatsNextEntry> {
  if (cache) return cache;
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "content/whats-next.json"),
      "utf8",
    );
    cache = JSON.parse(raw);
  } catch {
    cache = {};
  }
  return cache!;
}

export function getWhatsNext(slug: string): WhatsNextEntry | null {
  const entry = load()[slug];
  if (!entry) return null;
  if (!entry.pages?.length && !entry.external) return null;
  return entry;
}
