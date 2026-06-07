"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/navigation";

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const currentSlug = pathname.replace("/docs/", "");

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 w-full border-b border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Navigation
      </button>
      {isOpen && (
        <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 max-h-[60vh] overflow-y-auto">
          <div className="py-2">
            {navigation.map((section) => (
              <div key={section.title} className="mb-1">
                <h2 className="sidebar-section-title">{section.title}</h2>
                {section.pages.map((page) => (
                  <div key={page.slug}>
                    <Link
                      href={`/docs/${page.slug}`}
                      aria-current={currentSlug === page.slug ? "page" : undefined}
                      className={`sidebar-link ${currentSlug === page.slug ? "active" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {page.title}
                    </Link>
                    {page.children?.map((child) => (
                      <Link
                        key={child.slug}
                        href={`/docs/${child.slug}`}
                        aria-current={currentSlug === child.slug ? "page" : undefined}
                        className={`sidebar-link sidebar-link-child ${currentSlug === child.slug ? "active" : ""}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
