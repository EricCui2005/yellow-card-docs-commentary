#!/usr/bin/env python3
"""
Compare each /docs/{slug} page on docs.yellowcard.engineering with our local
content/docs/{slug}.md and emit a per-page diff report.

Approach:
- For original: fetch the page, extract `rdmd.dehydrated.body` HTML, parse with
  BeautifulSoup, walk block-level elements (p, h1-h6, li, td, blockquote)
  and emit a sequence of normalized text chunks.
- For local: render the markdown to HTML using the python `markdown` lib
  (with tables + fenced code), then apply the same block walk.
- Compare the two chunk lists set-wise to surface MISSING (in local) and
  EXTRA (in local but not original) chunks.

We do NOT compare order or whitespace — we look for *content drift*: text the
original has that we don't, and text we have that the original doesn't.
"""
import json
import os
import re
import sys
import time
import urllib.request

from bs4 import BeautifulSoup
import markdown as md

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(ROOT, "content", "docs")
REPORT_PATH = os.path.join(ROOT, "scripts", "docs_diff_report.txt")
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
)
BASE = "https://docs.yellowcard.engineering/docs/"

SSR_RE = re.compile(
    r'<script id="ssr-props" type="application/json">(.*?)</script>',
    re.DOTALL,
)

# Blocks we care about as discrete units of text.
BLOCK_TAGS = {"p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "td", "th", "blockquote", "pre"}

# Strip frontmatter from local markdown
FM_RE = re.compile(r"^---\n.*?\n---\n", re.DOTALL)


def fetch(slug: str) -> str:
    req = urllib.request.Request(BASE + slug, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="replace")


def original_body(html: str) -> str:
    m = SSR_RE.search(html)
    if not m:
        return ""
    data = json.loads(m.group(1))
    rdmd = data.get("rdmd") or {}
    deh = rdmd.get("dehydrated") or {}
    body = deh.get("body") or ""
    # Drop ReadMe's injected tailwind preamble
    body = re.sub(r"<style>.*?</style>", "", body, flags=re.DOTALL | re.IGNORECASE)
    return body


def normalize(text: str) -> str:
    # Collapse whitespace, strip, lowercase for comparison.
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extract_chunks(html: str) -> list[str]:
    """Return normalized text per top-level block element. Skips empty chunks
    and the empty <h>/anchor scaffolding ReadMe emits."""
    soup = BeautifulSoup(html, "lxml")
    chunks: list[str] = []
    for el in soup.find_all(BLOCK_TAGS):
        # Skip nested li when the parent li already counts -- but bs4 returns
        # them in document order with duplicates. To avoid double-counting,
        # only emit `li` if the parent isn't a li itself.
        if el.name == "li" and el.find_parent("li"):
            continue
        # Skip cells in header row that are just nested in `tr` (covered)
        text = el.get_text(" ", strip=True)
        text = normalize(text)
        if not text:
            continue
        # Skip ReadMe heading-anchor scaffolding fragments
        if text in {"Anchor link to:"}:
            continue
        chunks.append(text)
    return chunks


def md_to_chunks(markdown_text: str) -> list[str]:
    # Strip frontmatter
    markdown_text = FM_RE.sub("", markdown_text)
    html = md.markdown(
        markdown_text,
        extensions=["tables", "fenced_code", "attr_list", "sane_lists"],
    )
    return extract_chunks(html)


def slug_to_local(slug: str) -> str | None:
    path = os.path.join(DOCS_DIR, f"{slug}.md")
    if not os.path.exists(path):
        return None
    return open(path).read()


def fuzzy_in(needle: str, haystack: set[str]) -> bool:
    """Loose match: present if any haystack chunk contains the needle's first
    80 chars (without trailing punctuation noise)."""
    n = re.sub(r"[^\w ]+", "", needle).lower().strip()
    if not n:
        return True
    key = n[:80]
    for h in haystack:
        hk = re.sub(r"[^\w ]+", "", h).lower()
        if key and key in hk:
            return True
    return False


def slugs_from_nav() -> list[str]:
    """Pull every slug from lib/navigation.ts."""
    nav_path = os.path.join(ROOT, "lib", "navigation.ts")
    text = open(nav_path).read()
    return re.findall(r'slug:\s*"([^"]+)"', text)


def main():
    slugs = slugs_from_nav()
    print(f"Comparing {len(slugs)} doc pages...\n", file=sys.stderr)
    report = []
    summary = []
    for i, slug in enumerate(slugs, 1):
        local = slug_to_local(slug)
        if local is None:
            print(f"  [{i:>2}/{len(slugs)}] {slug:<40} MISSING LOCAL", file=sys.stderr)
            report.append(f"\n## {slug}\n  STATUS: missing local file content/docs/{slug}.md\n")
            summary.append((slug, "NO LOCAL", 0, 0))
            continue

        try:
            html = fetch(slug)
        except Exception as e:
            print(f"  [{i:>2}/{len(slugs)}] {slug:<40} FETCH FAIL ({e})", file=sys.stderr)
            report.append(f"\n## {slug}\n  STATUS: fetch failed: {e}\n")
            summary.append((slug, "FETCH FAIL", 0, 0))
            continue

        orig_html = original_body(html)
        orig_chunks = extract_chunks(orig_html)
        local_chunks = md_to_chunks(local)

        orig_set = set(orig_chunks)
        local_set = set(local_chunks)

        # missing = in original but not in local (loose)
        missing = []
        for c in orig_chunks:
            if c in local_set:
                continue
            if fuzzy_in(c, local_set):
                continue
            missing.append(c)

        extra = []
        for c in local_chunks:
            if c in orig_set:
                continue
            if fuzzy_in(c, orig_set):
                continue
            extra.append(c)

        status = "OK" if not missing and not extra else "DRIFT"
        summary.append((slug, status, len(missing), len(extra)))
        print(
            f"  [{i:>2}/{len(slugs)}] {slug:<40} {status:6} "
            f"orig={len(orig_chunks):3} local={len(local_chunks):3} "
            f"missing={len(missing):3} extra={len(extra):3}",
            file=sys.stderr,
        )

        report.append(f"\n## {slug}\n")
        report.append(f"  orig_chunks={len(orig_chunks)} local_chunks={len(local_chunks)} "
                      f"missing={len(missing)} extra={len(extra)}\n")
        if missing:
            report.append("  MISSING (in original, absent from local):\n")
            for c in missing:
                preview = c if len(c) < 240 else (c[:230] + "…")
                report.append(f"    - {preview}\n")
        if extra:
            report.append("  EXTRA (in local, absent from original):\n")
            for c in extra:
                preview = c if len(c) < 240 else (c[:230] + "…")
                report.append(f"    + {preview}\n")
        time.sleep(0.3)

    with open(REPORT_PATH, "w") as f:
        f.write("# Docs comparison report\n")
        f.write(f"# Source: {BASE}\n")
        f.write("# Compared {} pages.\n\n".format(len(slugs)))
        f.write("## Summary\n")
        for slug, status, m, e in summary:
            f.write(f"  {slug:<40} {status:10} missing={m:<3} extra={e}\n")
        f.write("\n# Per-page detail\n")
        f.writelines(report)
    print(f"\nReport written to {REPORT_PATH}", file=sys.stderr)


if __name__ == "__main__":
    main()
