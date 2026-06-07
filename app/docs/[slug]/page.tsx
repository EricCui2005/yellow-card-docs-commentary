import { notFound } from "next/navigation";
import { getDocBySlug, getAllDocSlugs } from "@/lib/content";
import { getWhatsNext } from "@/lib/whats-next";
import { renderMarkdown } from "@/lib/markdown";
import { getCommentary, applyAnnotations } from "@/lib/commentary";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import CommentaryMarkers from "@/components/CommentaryMarkers";
import CommentaryPopover from "@/components/CommentaryPopover";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return { title: "Not Found" };

  return {
    title: `${doc.title} | Yellow Card Payments API`,
    description: doc.excerpt,
  };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const whatsNext = getWhatsNext(slug);
  const annotations = await getCommentary(slug, "guides");
  const renderedHtml = await renderMarkdown(doc.content);
  const html = applyAnnotations(renderedHtml, annotations);

  // Extract headings from rendered HTML for TOC
  const headingRegex = /<h([2-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/g;
  const toc: { level: number; id: string; text: string }[] = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const text = match[3].replace(/<[^>]*>/g, "").trim();
    if (text) {
      toc.push({ level: parseInt(match[1]), id: match[2], text });
    }
  }

  return (
    <div className="flex">
      {/* Main content area */}
      <article className="flex-1 min-w-0 max-w-none">
        {/* Content head */}
        <header id="content-head" className="content-head px-6 pt-6">
          <div>
            <h1>{doc.title}</h1>
            {doc.excerpt && (
              <div className="excerpt">{doc.excerpt}</div>
            )}
          </div>
        </header>

        {/* Content body. CommentaryProvider lives at the layout level (so
            its state survives child navigations), but the markers + popover
            scan / render against this page's DOM, so they belong here. */}
        <section className="px-6 pt-6 pb-2">
          <MarkdownRenderer html={html} />
          <CommentaryMarkers />
          <CommentaryPopover />
        </section>

        {/* Updated timestamp */}
        <div className="px-6">
          <div className="updated-at">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Updated about 2 months ago
          </div>
        </div>

        {/* Divider */}
        <div className="px-6">
          <hr className="my-4 border-t border-gray-200 dark:border-gray-700" />
        </div>

        {/* What's Next — mirrors the original site's per-page connections.
            Many pages have no explicit next set; in that case we omit the
            section entirely (which matches the original). */}
        {whatsNext && (whatsNext.pages.length > 0 || whatsNext.external) && (
          <div className="whats-next px-6 pb-6">
            <div className="whats-next-heading">What&apos;s Next</div>
            {whatsNext.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {whatsNext.description}
              </p>
            )}
            {whatsNext.pages.map((p) => (
              <Link key={p.slug} href={`/docs/${p.slug}`} className="whats-next-link">
                {p.title} &rarr;
              </Link>
            ))}
            {whatsNext.external && (
              <a
                href={whatsNext.external.url}
                className="whats-next-link"
                target={whatsNext.external.new_tab ? "_blank" : undefined}
                rel={whatsNext.external.new_tab ? "noopener noreferrer" : undefined}
              >
                {whatsNext.external.url} &rarr;
              </a>
            )}
          </div>
        )}
      </article>

      {/* Right TOC column */}
      <aside className="content-toc hidden xl:block w-[200px] min-w-[200px] pt-6 pr-4 pl-4">
        <div className="sticky top-[100px]">
          {toc.length > 0 && (
            <nav aria-label="Table of contents">
              <ul className="toc-list">
                {toc.map((item) => (
                  <li key={item.id} style={{ paddingLeft: item.level === 3 ? 12 : 0 }}>
                    <a href={`#${item.id}`}>{item.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </aside>
    </div>
  );
}
