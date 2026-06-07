#!/usr/bin/env python3
"""
Crawl each /docs/{slug} page and extract document.content.next from the SSR
props. ReadMe lets each page declare its own "What's Next" pages explicitly,
which may not match navigation order. We mirror those choices verbatim.

Output: content/whats-next.json — a map from slug to { description, pages: [{slug, title}] }.
"""
import json
import os
import re
import sys
import time
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAV_TS = os.path.join(ROOT, "lib", "navigation.ts")
OUT_PATH = os.path.join(ROOT, "content", "whats-next.json")
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
)
BASE = "https://docs.yellowcard.engineering/docs/"

SSR_RE = re.compile(
    r'<script id="ssr-props" type="application/json">(.*?)</script>',
    re.DOTALL,
)


def slugs_from_nav():
    text = open(NAV_TS).read()
    return list(dict.fromkeys(re.findall(r'slug:\s*"([^"]+)"', text)))


def fetch(slug):
    req = urllib.request.Request(BASE + slug, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="replace")


def extract_next(html):
    m = SSR_RE.search(html)
    if not m:
        return None
    data = json.loads(m.group(1))
    doc = data.get("document") or {}
    content = doc.get("content") or {}
    nxt = content.get("next") or {}
    link = content.get("link") or {}
    return {
        "description": nxt.get("description"),
        "pages": [
            {"slug": p.get("slug"), "title": p.get("title"), "type": p.get("type")}
            for p in (nxt.get("pages") or [])
            if p.get("slug")
        ],
        "external": {"url": link.get("url"), "new_tab": link.get("new_tab")}
            if link.get("url") else None,
    }


def main():
    slugs = slugs_from_nav()
    print(f"Crawling 'What's Next' for {len(slugs)} docs...", file=sys.stderr)
    out = {}
    for i, slug in enumerate(slugs, 1):
        try:
            html = fetch(slug)
            nxt = extract_next(html)
        except Exception as e:
            print(f"  [{i:>2}/{len(slugs)}] {slug:<40} FAIL ({e})", file=sys.stderr)
            continue
        out[slug] = nxt
        page_str = ", ".join(
            f'{p["title"]}→{p["slug"]}' for p in (nxt.get("pages") or [])
        )
        print(
            f"  [{i:>2}/{len(slugs)}] {slug:<40} "
            f"pages={len(nxt.get('pages') or []):2}  {page_str}",
            file=sys.stderr,
        )
        time.sleep(0.3)

    with open(OUT_PATH, "w") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
    print(f"\nWrote {OUT_PATH}", file=sys.stderr)


if __name__ == "__main__":
    main()
