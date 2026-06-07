"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavPage {
  slug: string;
  title: string;
  method: string;
}

interface NavSubsection {
  title: string;
  pages: NavPage[];
}

interface NavSection {
  title: string;
  pages?: NavPage[];
  subsections?: NavSubsection[];
}

const METHOD_COLORS: Record<string, string> = {
  GET: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30",
  POST: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30",
  PUT: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30",
  PATCH: "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30",
  DELETE: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30",
};

function MethodBadge({ method }: { method: string }) {
  const m = method.toUpperCase();
  const label = m === "DELETE" ? "DEL" : m;
  return (
    <span
      className={`text-[10px] font-bold uppercase px-1 py-0.5 rounded leading-none ${METHOD_COLORS[m] || "text-gray-500 bg-gray-100"}`}
    >
      {label}
    </span>
  );
}

function SidebarLink({
  page,
  currentSlug,
}: {
  page: NavPage;
  currentSlug: string;
}) {
  const isActive = currentSlug === page.slug;
  return (
    <Link
      href={`/reference/${page.slug}`}
      aria-current={isActive ? "page" : undefined}
      className={`sidebar-link flex items-center gap-2 ${isActive ? "active" : ""}`}
    >
      <MethodBadge method={page.method} />
      <span className="truncate text-[13px]">{page.title}</span>
    </Link>
  );
}

export default function ReferenceSidebar({
  navigation,
}: {
  navigation: NavSection[];
}) {
  const pathname = usePathname();
  const currentSlug = pathname.replace("/reference/", "");

  return (
    <nav
      aria-label="API Reference navigation"
      className="w-[280px] min-w-[280px] border-r border-gray-200 dark:border-gray-800 overflow-y-auto hidden md:block transition-colors"
      style={{ height: "calc(100vh - 108px)", position: "sticky", top: "108px" }}
    >
      <div className="py-4">
        {navigation.map((section) => (
          <div key={section.title} className="mb-2">
            <h2 className="sidebar-section-title">{section.title}</h2>
            {section.pages?.map((page) => (
              <SidebarLink
                key={page.slug}
                page={page}
                currentSlug={currentSlug}
              />
            ))}
            {section.subsections?.map((sub) => (
              <div key={sub.title} className="mt-1">
                <div className="px-2.5 py-1 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {sub.title}
                </div>
                {sub.pages.map((page) => (
                  <SidebarLink
                    key={page.slug}
                    page={page}
                    currentSlug={currentSlug}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
