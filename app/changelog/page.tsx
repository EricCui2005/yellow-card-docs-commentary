import Link from "next/link";
import { getAllChangelogEntries } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog | Yellow Card Payments API",
  description: "Latest changes and updates to the Yellow Card Payments API.",
};

function relativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const monthsDiff =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth());

  if (monthsDiff >= 18) return `${Math.round(monthsDiff / 12)} years ago`;
  if (monthsDiff >= 10) return "about 1 year ago";
  if (monthsDiff >= 2) return `${monthsDiff} months ago`;
  if (monthsDiff === 1) return "about 1 month ago";
  if (diffDays >= 2) return `${diffDays} days ago`;
  if (diffDays === 1) return "yesterday";
  return "today";
}

// Excerpt: render the first ~100 chars of content as HTML
async function getExcerptHtml(content: string): Promise<string> {
  // Take only the first meaningful chunk
  const lines = content.split("\n").filter((l) => l.trim());
  const excerpt = lines.slice(0, 3).join("\n");
  return renderMarkdown(excerpt);
}

export default async function ChangelogPage() {
  const entries = getAllChangelogEntries();

  // Pre-render excerpts
  const entriesWithExcerpts = await Promise.all(
    entries.map(async (entry) => ({
      ...entry,
      excerptHtml: await getExcerptHtml(entry.content),
    }))
  );

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8" id="content">
      <h1 className="sr-only">Changelog</h1>
      <div className="max-w-[750px] ml-[12%]">
        {entriesWithExcerpts.map((entry, i) => (
          <article
            key={entry.slug}
            className={`py-8 ${i === 0 ? "pt-2" : ""} ${i < entries.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""}`}
          >
            <h2 className="text-[28px] font-bold leading-tight">
              <Link
                href={`/changelog/${entry.slug}`}
                className="text-[#492b7c] dark:text-[#FFCF33] hover:underline"
              >
                {entry.title}
              </Link>
            </h2>
            {entry.date && (
              <div className="flex items-center gap-1.5 mt-1.5 text-[14px] text-gray-400 dark:text-gray-500 font-medium">
                <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {relativeTime(entry.date)}
              </div>
            )}
            {/* Content excerpt */}
            {entry.excerptHtml && (
              <div
                className="mt-3 markdown-body text-[15px]"
                dangerouslySetInnerHTML={{ __html: entry.excerptHtml }}
              />
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
