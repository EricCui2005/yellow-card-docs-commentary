"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const currentSlug = pathname.replace("/docs/", "");

  return (
    <nav
      aria-label="Secondary navigation"
      className="w-[260px] min-w-[260px] border-r border-gray-200 dark:border-gray-800 overflow-y-auto hidden md:block transition-colors"
      style={{ height: "calc(100vh - 108px)", position: "sticky", top: "108px" }}
    >
      <div className="py-4">
        {navigation.map((section) => (
          <section key={section.title} className="mb-1">
            <h2 className="sidebar-section-title">{section.title}</h2>
            {section.pages.map((page) => (
              <SidebarItem
                key={page.slug}
                title={page.title}
                slug={page.slug}
                currentSlug={currentSlug}
                children={page.children}
              />
            ))}
          </section>
        ))}
      </div>
    </nav>
  );
}

function SidebarItem({
  title,
  slug,
  currentSlug,
  children,
}: {
  title: string;
  slug: string;
  currentSlug: string;
  children?: { title: string; slug: string }[];
}) {
  const isActive = currentSlug === slug;
  const hasActiveChild = children?.some((c) => c.slug === currentSlug);
  const [expanded, setExpanded] = useState(isActive || !!hasActiveChild);

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={`/docs/${slug}`}
          aria-current={isActive ? "page" : undefined}
          className={`sidebar-link flex-1 ${isActive ? "active" : ""} ${children ? "sidebar-link-parent" : ""}`}
        >
          <span>{title}</span>
        </Link>
        {children && children.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse" : "Expand"}
            className="px-2 py-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
      {children && (
        <ul
          className="overflow-hidden transition-all"
          style={{
            height: expanded ? "auto" : 0,
            opacity: expanded ? 1 : 0,
          }}
        >
          {children.map((child) => (
            <li key={child.slug}>
              <Link
                href={`/docs/${child.slug}`}
                aria-current={currentSlug === child.slug ? "page" : undefined}
                className={`sidebar-link sidebar-link-child ${currentSlug === child.slug ? "active" : ""}`}
              >
                <span>{child.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
