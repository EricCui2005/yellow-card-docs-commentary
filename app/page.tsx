import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main id="content" className="bg-white dark:bg-[#0b0c0d] transition-colors">
      {/* Landing Page Header / Hero - compact like original */}
      <section className="pt-10 pb-8 text-center px-6">
        <div className="max-w-[600px] mx-auto">
          <h1 className="text-[28px] md:text-[32px] font-bold mb-3 text-gray-900 dark:text-gray-100">
            Build with Yellow Card
          </h1>
          <p className="text-[15px] text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            Yellow Card provides everything you need to move money across
            emerging markets. Stablecoin payments, fiat rails, custody — all
            through one API.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/docs"
              target="_self"
              className="inline-flex items-center gap-1.5 bg-[#492b7c] text-white px-4 py-2 rounded-md font-medium hover:bg-[#1c1130] transition-colors text-[14px]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Get Started
            </Link>
            <Link
              href="/reference"
              target="_self"
              className="inline-flex items-center gap-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[14px]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              API Reference
            </Link>
          </div>
        </div>
      </section>

      {/* Block 1: Payments Infrastructure - text LEFT, image RIGHT (reverse layout) */}
      <section className="py-10 px-6">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-[22px] font-bold mb-3 text-gray-900 dark:text-gray-100">
              Payments Infrastructure that works
            </h2>
            <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">
              From Stablecoin payment infrastructure to fiat settlement rails,
              custody wallet services, and custom local Stablecoin issuance,
              Yellow Card provides the complete à-la-carte infrastructure
              businesses need to manage Stablecoins, payments, and operations
              across emerging markets.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/images/hero.png"
              alt="Payments Infrastructure"
              width={480}
              height={360}
              className="rounded-lg max-w-full h-auto"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Block 2: Support - image LEFT, text RIGHT */}
      <section className="py-10 px-6">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <Image
              src="/images/support.png"
              alt="Support"
              width={480}
              height={360}
              className="rounded-lg max-w-full h-auto"
              unoptimized
            />
          </div>
          <div>
            <h2 className="text-[22px] font-bold mb-3 text-gray-900 dark:text-gray-100">
              Support
            </h2>
            <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">
              Schedule an intro call to discuss your use case, get answers to
              integration questions, or troubleshoot technical issues. Our team
              supports you from first API call to production and beyond.
            </p>
            <p className="mt-3">
              <a
                href="mailto:api@yellowcard.io"
                className="text-[#492b7c] dark:text-[#FFCF33] hover:text-[#1c1130] dark:hover:text-[#fde68a] hover:underline text-[15px]"
              >
                api@yellowcard.io
              </a>
            </p>
          </div>
        </div>
      </section>

      <footer aria-label="Status banner" className="py-4" />
    </main>
  );
}
