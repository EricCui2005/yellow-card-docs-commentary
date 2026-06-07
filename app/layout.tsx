import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";
import CommentaryProvider from "@/components/CommentaryProvider";
import CommentaryTour from "@/components/CommentaryTour";
import { getGlobalCommentarySequence } from "@/lib/commentary";

export const metadata: Metadata = {
  title: "Yellow Card Payments API",
  description:
    "Yellow Card\u2019s Payment API enables foreign enterprises to automatically disburse fiat money to their African customers.",
  icons: {
    icon: "/images/dbaecf7e12bfa1ad560d1d7ba969711abbd3ad9053f78d2bd8dbf0c91aedf71d-yc-fav.png",
  },
};

const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme') || 'system';
    var resolved = theme;
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-color-mode', theme);
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Build the full global tour sequence once. The provider sits at the root
  // so its state survives every child navigation, including cross-section
  // moves between /docs/* and /reference/*. The tour widget itself hides on
  // routes outside those two sections.
  const sequence = await getGlobalCommentarySequence();
  const clientSeq = sequence.map((s) => ({
    section: s.section,
    slug: s.slug,
    annotation: {
      id: s.annotation.id,
      type: s.annotation.type,
      bodyHtml: s.annotation.bodyHtml,
    },
  }));

  return (
    <html
      lang="en"
      data-color-mode="system"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-white dark:bg-[#0b0c0d] text-gray-800 dark:text-gray-200 transition-colors">
        <ThemeProvider>
          <CommentaryProvider sequence={clientSeq}>
            <Header />
            <div className="flex-1">{children}</div>
            <CommentaryTour />
          </CommentaryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
