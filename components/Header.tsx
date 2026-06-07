"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const bottomNavLinks = [
  { href: "/docs", label: "Guides", icon: "guides", mobileOnly: false },
  { href: "/reference", label: "API Reference", icon: "reference", mobileOnly: false },
];

function NavIcon({ type }: { type: string }) {
  const cls = "w-[16px] h-[16px] shrink-0";
  switch (type) {
    case "guides":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "reference":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Header() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/docs") return pathname.startsWith("/docs");
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#0b0c0d] transition-colors">
      {/* Skip to content */}
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded">
        Skip to Content
      </a>

      {/* Unofficial-mirror disclaimer strip. Lead with a bold UNOFFICIAL
          badge so the eye catches it; the rest is plain text. On-brand
          warm cream so it reads as a label, not a warning. */}
      <div className="bg-[#FFE995] dark:bg-[#4a3a0e] border-b-2 border-[#E5B82A] dark:border-[#7a5e15] text-[#4a3a0e] dark:text-[#FFE89A] shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2.5 text-[13px] leading-snug text-center">
          <span className="inline-flex items-center gap-1.5 bg-[#1f2937] dark:bg-[#0b0c0d] text-[#FFCF33] px-2 py-0.5 rounded-full text-[10.5px] font-bold tracking-wider uppercase shrink-0">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Unofficial
          </span>
          <span>
            <strong className="font-semibold">Mirror built by Eric Cui</strong>
            {" "}for the purpose of annotating Yellow Card&rsquo;s public documentation. Not affiliated with or endorsed by Yellow Card.
          </span>
        </div>
      </div>

      {/* Top row: Logo + Search + Login + Theme */}
      <div className="header-top">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between h-[72px]">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/logo.png"
              alt="Yellow Card Payments API"
              width={176}
              height={40}
              className="h-[40px] w-auto dark:brightness-0 dark:invert"
              priority
            />
          </Link>

          {/* Right: Theme toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Bottom row: Version + Nav tabs */}
      <div className="header-bottom border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-end">
          {/* Version selector */}
          <div className="hidden sm:flex items-center mr-4 pb-2">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
              v1.0.37
            </span>
          </div>

          {/* Nav tabs */}
          <nav aria-label="Primary navigation" className="flex items-end gap-[1em] overflow-x-auto">
            {bottomNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`header-nav-link inline-flex items-center gap-1.5 whitespace-nowrap pb-2 ${
                  isActive(link.href) ? "active" : ""
                }`}
              >
                <NavIcon type={link.icon} />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
