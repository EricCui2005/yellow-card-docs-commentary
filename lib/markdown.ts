import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { visit } from "unist-util-visit";
import { createHighlighter, type Highlighter } from "shiki";

// ReadMe-style emoji → callout class. The pipeline rewrites
// `> 📘 ...` blockquotes into `<blockquote class="callout callout_info">…`
// so the global callout CSS picks them up.
const EMOJI_TO_CALLOUT: Record<string, string> = {
  "📘": "callout_info",
  "💡": "callout_info",
  "🚧": "callout_warn",
  "⚠️": "callout_warn",
  "❗": "callout_error",
  "❌": "callout_error",
  "✅": "callout_okay",
  "👍": "callout_okay",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTextContent(node: any): string {
  if (!node) return "";
  if (node.type === "text") return node.value || "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (Array.isArray(node.children)) return node.children.map(getTextContent).join("");
  return "";
}

// Walks the hast tree post-rehype and converts blockquotes whose first
// non-whitespace text begins with one of the callout emoji. The first
// **bold paragraph** in the callout body becomes the title <h3>, matching
// the structure ReadMe's rdmd uses.
function rehypeReadmeCallouts() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, "element", (node: any) => {
      if (node.tagName !== "blockquote") return;
      const firstPara = node.children?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) => c.type === "element" && c.tagName === "p"
      );
      if (!firstPara) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const firstText = firstPara.children?.find((c: any) => c.type === "text");
      if (!firstText || typeof firstText.value !== "string") return;
      const raw = firstText.value.trimStart();
      const emoji = Object.keys(EMOJI_TO_CALLOUT).find((e) => raw.startsWith(e));
      if (!emoji) return;

      // Strip the emoji from the text node
      firstText.value = firstText.value.replace(emoji, "").trimStart();
      if (!firstText.value) {
        firstPara.children = firstPara.children.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (c: any) => c !== firstText
        );
      }
      if (firstPara.children.length === 0) {
        node.children = node.children.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (c: any) => c !== firstPara
        );
      }

      const variant = EMOJI_TO_CALLOUT[emoji];
      node.properties = node.properties || {};
      node.properties.className = ["callout", variant];

      // Determine the title. Two conventions appear in the source markdown:
      //   1. `> **Title**` — first child after the emoji is <p><strong>X</strong></p>
      //   2. `> ### \n > Title` — an EMPTY heading followed by a plain
      //      paragraph (the empty heading is the signal that the next
      //      paragraph is the title — a ReadMe quirk we mirror).
      //
      // We rewrite either form into a <h3 class="heading"><div class="heading-text">…</div></h3>
      // matching what the original rdmd emits. We keep inline children
      // (<strong>, <code>, <a>, etc.) so titles retain bold/code formatting.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const elementChildren = node.children.filter((c: any) => c.type === "element");
      if (elementChildren.length > 0) {
        const first = elementChildren[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let titleChildren: any[] | null = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let nodesToReplace: any[] = [];

        if (
          first.tagName === "p" &&
          Array.isArray(first.children) &&
          first.children.length === 1 &&
          first.children[0].type === "element" &&
          first.children[0].tagName === "strong"
        ) {
          // Title is the content of the <strong> — preserve its children
          titleChildren = first.children[0].children;
          nodesToReplace = [first];
        } else if (
          /^h[1-6]$/.test(first.tagName) &&
          getTextContent(first).trim() === "" &&
          elementChildren[1]?.tagName === "p"
        ) {
          // Empty heading followed by paragraph — the paragraph is the title
          titleChildren = elementChildren[1].children;
          nodesToReplace = [first, elementChildren[1]];
        }

        if (titleChildren && nodesToReplace.length) {
          const firstIdx = node.children.indexOf(nodesToReplace[0]);
          const lastIdx = node.children.indexOf(
            nodesToReplace[nodesToReplace.length - 1]
          );
          // Drop the source nodes (and any whitespace text between them)
          // and insert the synthesized <h3> in their place.
          const heading = {
            type: "element",
            tagName: "h3",
            properties: { className: ["heading", "heading-3"] },
            children: [
              {
                type: "element",
                tagName: "div",
                properties: { className: ["heading-text"] },
                children: titleChildren,
              },
            ],
          };
          node.children.splice(firstIdx, lastIdx - firstIdx + 1, heading);
        }
      }

      // Prepend the icon
      node.children.unshift({
        type: "element",
        tagName: "span",
        properties: { className: ["callout-icon"] },
        children: [{ type: "text", value: emoji }],
      });
    });
  };
}

// "JSON" / "CoffeeScript" / "Sample Request" labels followed by an
// indented code block come from ReadMe's CodeTabs export. We render them as
// a dark code panel with a small label header on top.
const CODE_LABEL_RE =
  /^(JSON|CoffeeScript|JavaScript|TypeScript|Python|Ruby|Java|cURL|HTTP|Sample Request[^\n]*|Sample Response[^\n]*|Bash|Shell|Go|PHP|Swift)$/i;

// Map a CodeTabs label to a shiki language id. Best-effort guess; falls back
// to "json" since that's by far the most common payload sample.
function labelToLang(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("curl") || l.startsWith("bash") || l.startsWith("shell")) return "bash";
  if (l.includes("json")) return "json";
  if (l.includes("javascript")) return "javascript";
  if (l.includes("typescript")) return "typescript";
  if (l.includes("coffee")) return "coffee";
  if (l.includes("python")) return "python";
  if (l.includes("ruby")) return "ruby";
  if (l.includes("java")) return "java";
  if (l.includes("go")) return "go";
  if (l.includes("php")) return "php";
  if (l.includes("swift")) return "swift";
  if (l.includes("http")) return "http";
  return "json";
}

function rehypeCodeTabLabel() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, "element", (node: any, _index: any, parent: any) => {
      if (!parent || !Array.isArray(parent.children)) return;
      if (node.tagName !== "pre") return;
      const idx = parent.children.indexOf(node);
      if (idx <= 0) return;
      let prevIdx = idx - 1;
      while (
        prevIdx >= 0 &&
        parent.children[prevIdx].type === "text" &&
        /^\s*$/.test(parent.children[prevIdx].value as string)
      ) {
        prevIdx--;
      }
      if (prevIdx < 0) return;
      const prev = parent.children[prevIdx];
      if (prev.type !== "element" || prev.tagName !== "p") return;
      const text =
        prev.children
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ?.map((c: any) => (c.type === "text" ? c.value : ""))
          .join("")
          .trim() || "";
      if (!CODE_LABEL_RE.test(text)) return;

      // Tag the inner <code> with a language hint so the highlighter knows
      // which grammar to apply.
      const code = node.children?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) => c.type === "element" && c.tagName === "code"
      );
      if (code) {
        const lang = labelToLang(text);
        code.properties = code.properties || {};
        const existing = (code.properties.className as string[]) || [];
        if (!existing.some((c) => c.startsWith("language-"))) {
          code.properties.className = [...existing, `language-${lang}`];
        }
      }

      const label = text;
      const wrapper = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-tabs"] },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { className: ["code-tabs-toolbar"] },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: { className: ["code-tabs-label"] },
                children: [{ type: "text", value: label }],
              },
            ],
          },
          node,
        ],
      };
      parent.children.splice(prevIdx, idx - prevIdx + 1, wrapper);
    });
  };
}

// ---- Shiki syntax highlighting ----------------------------------------
// One process-wide highlighter, lazily initialized.
let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["material-theme-palenight"],
      langs: [
        "json",
        "bash",
        "javascript",
        "typescript",
        "python",
        "ruby",
        "java",
        "go",
        "php",
        "swift",
        "http",
        "coffee",
      ],
    });
  }
  return highlighterPromise;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseHtmlFragment(html: string): any {
  // Tiny hast nodes via rehype-parse would add a dep. The shiki output is a
  // single <pre><code>...</code></pre>; we can parse it via a quick regex
  // since we only care about the inner spans/tokens. The full output is
  // re-emitted as a raw HTML node via the `raw` type, then rehype-raw
  // (which runs earlier) won't see it — so we instead pass it through
  // hast as a single element with raw inner HTML. The cleanest path is to
  // emit a <pre> element whose only child is a raw-HTML literal that
  // rehype-stringify will print verbatim.
  return {
    type: "raw",
    value: html,
  };
}

// Walks the tree and replaces every <pre><code class="language-xxx">...</code></pre>
// with shiki-highlighted equivalent (still a <pre><code>).
function rehypeShiki() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queue: Array<{ parent: any; pre: any; lang: string; code: string }> = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function collect(tree: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, "element", (node: any, _i: any, parent: any) => {
      if (node.tagName !== "pre") return;
      const codeEl = node.children?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) => c.type === "element" && c.tagName === "code"
      );
      if (!codeEl) return;
      const classes = (codeEl.properties?.className as string[]) || [];
      const langClass = classes.find((c) => c.startsWith("language-"));
      const lang = langClass ? langClass.replace("language-", "") : "";
      if (!lang) return;
      const codeText = getTextContent(codeEl);
      if (!codeText.trim()) return;
      queue.push({ parent, pre: node, lang, code: codeText });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (tree: any) => {
    collect(tree);
    if (queue.length === 0) return;
    const hl = await getHighlighter();
    for (const item of queue) {
      let html: string;
      try {
        html = hl.codeToHtml(item.code, {
          lang: item.lang,
          theme: "material-theme-palenight",
        });
      } catch {
        // Fallback: unknown grammar — leave the original pre alone.
        continue;
      }
      // Shiki returns <pre class="shiki ..."><code>...tokens...</code></pre>.
      // Strip the outer <pre> wrapper so our existing .code-tabs <pre>
      // container provides padding/background, and we just inject the
      // highlighted inner HTML.
      const inner = html
        .replace(/^<pre[^>]*>/, "")
        .replace(/<\/pre>$/, "")
        // Strip any inline background-color on the inner <code> so our
        // code-tabs background shows through cleanly.
        .replace(
          /<code([^>]*)style="([^"]*)"/i,
          (_m, attrs, style) =>
            `<code${attrs}style="${style.replace(/background-color:[^;]+;?/i, "")}"`
        );
      // Replace the <code> contents in-place with the shiki-rendered inner.
      const idx = item.parent.children.indexOf(item.pre);
      if (idx < 0) continue;
      item.parent.children[idx] = {
        type: "element",
        tagName: "pre",
        properties: {
          className: ["shiki"],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(item.pre.properties as any),
        },
        children: [parseHtmlFragment(inner)],
      };
    }
  };
}

export async function renderMarkdown(content: string): Promise<string> {
  // Transform image URLs to local paths
  const transformed = content.replace(
    /https:\/\/files\.readme\.io\/([a-f0-9-]+[^\s)]*\.(?:png|jpg|jpeg|gif|svg|webp))/g,
    (_match, filename) => `/images/${filename}`
  );

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeReadmeCallouts)
    .use(rehypeCodeTabLabel)
    .use(rehypeShiki)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(transformed);

  return String(result);
}
