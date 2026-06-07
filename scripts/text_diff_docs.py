#!/usr/bin/env python3
"""
Per-page word-level text comparison between docs.yellowcard.engineering and
our local /docs/{slug} render. Reports the actual missing/extra words and
the longest contiguous runs of drift, so we can tell apart real text gaps
from structural rendering differences.

Output: scripts/docs_text_diff.txt
"""
import json
import os
import re
import sys
import time
import urllib.request
from difflib import SequenceMatcher

from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(ROOT, "content", "docs")
OUT = os.path.join(ROOT, "scripts", "docs_text_diff.txt")
NAV_TS = os.path.join(ROOT, "lib", "navigation.ts")

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
)
ORIG_BASE = "https://docs.yellowcard.engineering/docs/"
LOCAL_BASE = "http://localhost:3000/docs/"
SSR_RE = re.compile(r'<script id="ssr-props" type="application/json">(.*?)</script>', re.DOTALL)

# Sentences/phrases the user has explicitly removed from the local site.
# Pre-filter them from the ORIGINAL text so they don't show as "missing".
INTENTIONAL_REMOVALS = {
    "To get started, open the recipe below:",
    # USD/EUR original sentence that mentioned the recipe widget; the local
    # version is a recipe-less rewrite ("is supported in" instead of
    # "follows the steps outlined in the recipe below"). Match both forms.
    "Making a USD/EUR send in select Asian, European, African, and South American countries follows the steps outlined in the recipe below. The request body contains fields that are specific to USD/EUR payments.",
    "Making a USD/EUR send is supported in select Asian, European, African, and South American countries. The request body contains fields that are specific to USD/EUR payments.",
}


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="replace")


def orig_body_html(html: str) -> str:
    m = SSR_RE.search(html)
    if not m:
        return ""
    data = json.loads(m.group(1))
    body = (data.get("rdmd") or {}).get("dehydrated", {}).get("body", "") or ""
    body = re.sub(r"<style>.*?</style>", "", body, flags=re.DOTALL | re.IGNORECASE)
    return body


def local_body_html(html: str) -> str:
    """Extract the <article> inner HTML (drops sidebar, header, TOC, footer)."""
    soup = BeautifulSoup(html, "lxml")
    article = soup.find("article")
    if not article:
        return ""
    # Drop the TOC aside if it's inside (it shouldn't be — article is just main col)
    return str(article)


def text_from_html(html: str, drop_phrases=()) -> str:
    soup = BeautifulSoup(html, "lxml")
    # Inside <pre>/<code> we want NO inter-span spacing — shiki splits
    # syntax tokens into separate <span>s and BeautifulSoup's get_text(" ")
    # would otherwise insert spurious spaces in e.g. "/custody/virtual-accounts".
    # Collapse each <pre> / <code> to its plain text content first.
    for el in soup.find_all(["pre", "code"]):
        plain = el.get_text("")
        el.clear()
        el.string = plain
    # Drop the in-content title (we render it in <header class="content-head">,
    # not inside markdown body) and the "Updated about 2 months ago" line and
    # the "What's Next" block — these are chrome, not content.
    for sel in [
        ".content-head",
        ".updated-at",
        ".whats-next",            # whole What's Next block (local)
        ".whats-next-heading",
        ".whats-next-link",
        ".content-toc",
        ".sidebar-link",
        ".rm-NextStep",           # original ReadMe What's Next container
        ".connections",           # original alternate
        "header",
        "nav",
        "button",
    ]:
        for el in soup.select(sel):
            el.decompose()
    # Drop ReadMe-only chrome elements that appear on the original
    for sel in [
        ".UpdatedAt",
        ".rm-NextStep",
        ".heading-anchor-icon",
        ".heading-anchor",
        ".callout-icon",
        ".code-tabs-toolbar",  # The "JSON" label tab — chrome, not text
        ".CodeTabs-toolbar",   # Original CodeTabs label row
    ]:
        for el in soup.select(sel):
            el.decompose()
    text = soup.get_text(" ")
    # Normalize whitespace
    text = re.sub(r"[   ]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    for ph in drop_phrases:
        text = text.replace(ph, " ")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def tokenize(text: str):
    """Split into word-ish tokens (case-folded, punctuation stripped) so the
    diff doesn't get tripped up by quote style or trailing punctuation."""
    # Lowercase + strip everything except alphanumerics, slashes, and underscores
    return [t for t in re.findall(r"[A-Za-z0-9_./%-]+", text.lower()) if t]


def slugs_from_nav():
    text = open(NAV_TS).read()
    return list(dict.fromkeys(re.findall(r'slug:\s*"([^"]+)"', text)))


def diff_runs(a_tokens, b_tokens, min_run=3):
    """Return list of ("delete", a_words) and ("insert", b_words) operations
    for tokens that are missing from b (delete) or extra in b (insert). Short
    one/two-token noise is filtered unless it's content-significant."""
    sm = SequenceMatcher(a=a_tokens, b=b_tokens, autojunk=False)
    ops = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            continue
        a_chunk = a_tokens[i1:i2]
        b_chunk = b_tokens[j1:j2]
        if tag == "delete":
            ops.append(("MISSING_IN_LOCAL", a_chunk))
        elif tag == "insert":
            ops.append(("EXTRA_IN_LOCAL", b_chunk))
        elif tag == "replace":
            ops.append(("ORIG", a_chunk))
            ops.append(("LOCAL", b_chunk))
    return ops


def main():
    slugs = slugs_from_nav()
    print(f"Comparing {len(slugs)} doc pages (word-level)...", file=sys.stderr)
    lines = ["# Per-page word-level text diff", ""]
    summary = []
    for i, slug in enumerate(slugs, 1):
        try:
            orig_html = fetch(ORIG_BASE + slug)
        except Exception as e:
            print(f"  [{i:>2}/{len(slugs)}] {slug:<40} ORIG FETCH FAIL ({e})", file=sys.stderr)
            continue
        try:
            local_html = fetch(LOCAL_BASE + slug)
        except Exception as e:
            print(f"  [{i:>2}/{len(slugs)}] {slug:<40} LOCAL FETCH FAIL ({e})", file=sys.stderr)
            continue

        orig_text = text_from_html(orig_body_html(orig_html), drop_phrases=INTENTIONAL_REMOVALS)
        local_text = text_from_html(local_body_html(local_html), drop_phrases=INTENTIONAL_REMOVALS)

        # Compare normalized tokens to tolerate punctuation/whitespace diffs
        orig_tokens = tokenize(orig_text)
        local_tokens = tokenize(local_text)

        sm = SequenceMatcher(a=orig_tokens, b=local_tokens, autojunk=False)
        ratio = sm.ratio()
        ops = diff_runs(orig_tokens, local_tokens)

        if ratio >= 0.999 and not ops:
            status = "OK"
        else:
            status = f"DRIFT ({ratio:.3f})"
        summary.append((slug, status, len(orig_tokens), len(local_tokens), len(ops)))
        print(
            f"  [{i:>2}/{len(slugs)}] {slug:<40} {status:>16}  "
            f"orig={len(orig_tokens):4} local={len(local_tokens):4}  ops={len(ops)}",
            file=sys.stderr,
        )

        lines.append(f"## {slug}")
        lines.append(f"  ratio={ratio:.3f}  orig_tokens={len(orig_tokens)} local_tokens={len(local_tokens)}")
        if not ops:
            lines.append("  (no diff)")
        else:
            for kind, chunk in ops:
                preview = " ".join(chunk)
                if len(preview) > 240:
                    preview = preview[:230] + "…"
                marker = "-" if "MISS" in kind or kind == "ORIG" else "+"
                lines.append(f"  {marker} [{kind}] {preview}")
        lines.append("")
        time.sleep(0.25)

    open(OUT, "w").write("\n".join(lines))
    print(f"\nWrote {OUT}", file=sys.stderr)
    print("\nSummary:", file=sys.stderr)
    for slug, status, o, l, n in summary:
        marker = "✓" if status == "OK" else "✗"
        print(f"  {marker} {slug:<40} {status:>16}  ops={n}", file=sys.stderr)


if __name__ == "__main__":
    main()
