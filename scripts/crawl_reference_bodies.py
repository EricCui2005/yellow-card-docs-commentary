#!/usr/bin/env python3
"""
Re-crawl each /reference/{slug} page on docs.yellowcard.engineering and
extract rdmd.dehydrated.body (rendered HTML containing callouts, disclaimers,
notes, and supplementary text) into our local content/reference/{slug}.json.

We also strip the leading tailwind <style> tag the renderer injects.
"""
import json
import os
import re
import sys
import time
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF_DIR = os.path.join(ROOT, "content", "reference")
NAV_PATH = os.path.join(REF_DIR, "navigation.json")
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)
BASE = "https://docs.yellowcard.engineering/reference/"

STYLE_RE = re.compile(r"<style>.*?</style>", re.DOTALL | re.IGNORECASE)
SSR_RE = re.compile(
    r'<script id="ssr-props" type="application/json">(.*?)</script>',
    re.DOTALL,
)


def fetch(slug: str) -> str:
    req = urllib.request.Request(BASE + slug, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="replace")


def extract_body(html: str) -> tuple[str, dict]:
    m = SSR_RE.search(html)
    if not m:
        return "", {}
    data = json.loads(m.group(1))
    rdmd = data.get("rdmd") or {}
    deh = rdmd.get("dehydrated") or {}
    body = deh.get("body") or ""
    # Strip leading tailwind preamble — the host site re-injects it; we don't want
    # 100kb of tailwind reset rules embedded in each endpoint JSON.
    body = STYLE_RE.sub("", body).strip()
    return body, data


def main():
    nav = json.load(open(NAV_PATH))
    slugs = []
    for section in nav["sections"]:
        for page in section.get("pages", []):
            slugs.append(page["slug"])
        for sub in section.get("subsections", []):
            for page in sub.get("pages", []):
                slugs.append(page["slug"])

    print(f"Crawling {len(slugs)} endpoints...")
    updated = 0
    unchanged = 0
    empty = 0
    failed = []
    for i, slug in enumerate(slugs, 1):
        path = os.path.join(REF_DIR, f"{slug}.json")
        if not os.path.exists(path):
            print(f"  [{i:>2}/{len(slugs)}] {slug:<36} SKIP (no local file)")
            continue
        try:
            html = fetch(slug)
            body, _ = extract_body(html)
        except Exception as e:
            print(f"  [{i:>2}/{len(slugs)}] {slug:<36} FAIL ({e})")
            failed.append(slug)
            continue

        data = json.load(open(path))
        old = data.get("bodyHtml") or ""
        if body == old:
            status = "unchanged"
            unchanged += 1
        elif not body:
            status = "no body"
            empty += 1
        else:
            data["bodyHtml"] = body
            with open(path, "w") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            status = f"updated ({len(body)} chars)"
            updated += 1
        print(f"  [{i:>2}/{len(slugs)}] {slug:<36} {status}")
        time.sleep(0.4)  # be polite

    print(
        f"\nDone. updated={updated} unchanged={unchanged} no_body={empty} "
        f"failed={len(failed)}"
    )
    if failed:
        print("Failed slugs:", failed)


if __name__ == "__main__":
    main()
