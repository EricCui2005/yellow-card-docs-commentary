// Per-page inline commentary, broken-link / legacy-text flags, and project
// ideas overlaid on the rendered docs. Two sources of truth:
//   - content/guides-commentary.json (annotations for /docs/* pages)
//   - content/reference-commentary.json (annotations for /reference/* pages)
//
// The loader pre-renders each annotation's body markdown to HTML so the
// client component can just inject it into a popover.
//
// applyAnnotations finds each annotation's `anchor` substring in the
// already-rendered docs HTML and inserts an empty <span class="commentary-marker">
// immediately after. <CommentaryMarkers /> (client) hydrates those spans
// into interactive marker pills with expandable popovers.
import fs from "fs";
import path from "path";
import { renderMarkdown } from "./markdown";

export type AnnotationType = "commentary" | "issue" | "project";
export type Section = "guides" | "reference";

export interface RawAnnotation {
  id: string;
  type: AnnotationType;
  anchor: string;
  occurrence?: number;
  body: string;
}

export interface Annotation extends RawAnnotation {
  bodyHtml: string;
}

const FILES: Record<Section, string> = {
  guides: "content/guides-commentary.json",
  reference: "content/reference-commentary.json",
};

// Intentionally uncached: in dev we want JSON edits to flow through without
// a server restart, and per-page parse cost is trivial.
async function loadSection(
  section: Section,
): Promise<Record<string, Annotation[]>> {
  const filePath = path.join(process.cwd(), FILES[section]);
  let raw: Record<string, RawAnnotation[]>;
  try {
    raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
  const out: Record<string, Annotation[]> = {};
  for (const [slug, anns] of Object.entries(raw)) {
    out[slug] = await Promise.all(
      anns.map(async (a) => ({
        ...a,
        bodyHtml: await renderMarkdown(a.body),
      })),
    );
  }
  return out;
}

export async function getCommentary(
  slug: string,
  section: Section,
): Promise<Annotation[]> {
  const all = await loadSection(section);
  return all[slug] || [];
}

// Flat global sequence of every annotation across every Guides + Reference
// page, in navigation order. Used by the global tour widget so Next/Prev can
// step across page boundaries — and across sections.
export interface GlobalSequenceItem {
  section: Section;
  slug: string;
  annotation: Annotation;
}

export async function getGlobalCommentarySequence(): Promise<
  GlobalSequenceItem[]
> {
  const { navigation } = await import("./navigation");
  const { getRefNavigation } = await import("./reference");

  // Build an ordered list of (section, slug) pairs that matches sidebar order.
  const ordered: Array<{ section: Section; slug: string }> = [];
  for (const section of navigation) {
    for (const page of section.pages) {
      ordered.push({ section: "guides", slug: page.slug });
      if (page.children) {
        for (const child of page.children)
          ordered.push({ section: "guides", slug: child.slug });
      }
    }
  }
  const refNav = getRefNavigation();
  for (const section of refNav) {
    if (section.pages) {
      for (const page of section.pages)
        ordered.push({ section: "reference", slug: page.slug });
    }
    if (section.subsections) {
      for (const sub of section.subsections) {
        for (const page of sub.pages)
          ordered.push({ section: "reference", slug: page.slug });
      }
    }
  }

  const guides = await loadSection("guides");
  const reference = await loadSection("reference");
  const seq: GlobalSequenceItem[] = [];
  for (const { section, slug } of ordered) {
    const anns = (section === "guides" ? guides : reference)[slug] || [];
    for (const a of anns) seq.push({ section, slug, annotation: a });
  }
  return seq;
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function findOccurrence(haystack: string, needle: string, n: number): number {
  let from = 0;
  for (let i = 0; i < n; i++) {
    const idx = haystack.indexOf(needle, from);
    if (idx < 0) return -1;
    if (i === n - 1) return idx;
    from = idx + needle.length;
  }
  return -1;
}

// Inject empty marker spans right after each anchor match. The client
// component finds these by data-id and renders the icon + popover.
//
// Note: we insert markers in the order given in the JSON. Earlier insertions
// shift downstream indices, but findOccurrence searches by anchor text count
// so the Nth occurrence of "Get Rates" is still found correctly even after
// markers have been inserted at occurrence 1.
export function applyAnnotations(
  html: string,
  annotations: Annotation[],
): string {
  if (annotations.length === 0) return html;
  let result = html;
  const missing: string[] = [];
  // We iterate in REVERSE so that JSON order maps to left-to-right DOM
  // order. Each insertion at position X pushes the previously-inserted
  // marker to position X + marker.length, so processing in reverse means
  // the first JSON entry ends up leftmost.
  for (let i = annotations.length - 1; i >= 0; i--) {
    const ann = annotations[i];
    const occurrence = ann.occurrence ?? 1;
    const idx = findOccurrence(result, ann.anchor, occurrence);
    if (idx < 0) {
      missing.push(`${ann.id} (anchor: "${ann.anchor.slice(0, 60)}")`);
      continue;
    }
    const insertAt = idx + ann.anchor.length;
    const marker =
      `<span class="commentary-marker" ` +
      `data-id="${escapeAttr(ann.id)}" ` +
      `data-type="${escapeAttr(ann.type)}"></span>`;
    result = result.slice(0, insertAt) + marker + result.slice(insertAt);
  }
  if (missing.length > 0 && process.env.NODE_ENV !== "production") {
    console.warn(
      `[commentary] missing anchors:\n  ${missing.join("\n  ")}`,
    );
  }
  return result;
}
