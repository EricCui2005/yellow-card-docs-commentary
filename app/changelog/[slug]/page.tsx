import { notFound } from "next/navigation";
import { getChangelogEntry, getAllChangelogSlugs } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllChangelogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getChangelogEntry(slug);
  if (!entry) return { title: "Not Found" };

  return {
    title: `${entry.title} | Changelog | Yellow Card Payments API`,
  };
}

export default async function ChangelogEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getChangelogEntry(slug);
  if (!entry) notFound();

  const html = await renderMarkdown(entry.content);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/changelog"
        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 inline-flex items-center gap-1"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Changelog
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-2 dark:text-gray-100">{entry.title}</h1>
      {entry.date && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          {new Date(entry.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
      <MarkdownRenderer html={html} />
    </div>
  );
}
