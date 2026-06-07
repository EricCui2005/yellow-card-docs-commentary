import Link from "next/link";
import { getAdjacentPages } from "@/lib/navigation";

export default function PageNavigation({ currentSlug }: { currentSlug: string }) {
  const { prev, next } = getAdjacentPages(currentSlug);

  if (!prev && !next) return null;

  return (
    <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {prev.title}
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {next.title}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
