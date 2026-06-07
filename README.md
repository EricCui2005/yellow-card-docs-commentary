# Yellow Card Docs — Commentary Mirror

> **Unofficial.** This is a personal mirror of parts of Yellow Card's public
> documentation (Guides + API Reference), built by Eric Cui so I can leave
> my own inline commentary on the docs. Not affiliated with or endorsed
> by Yellow Card.

## What this is

A Next.js app that renders a faithful copy of two sections of Yellow Card's
docs (`/docs/*` — Guides; `/reference/*` — API Reference), overlaid with
an inline annotation system. Each annotation falls into one of three buckets:

- **Commentary** — observations about the docs as written.
- **Broken Links / Legacy Text** — concrete issues to fix (stale URLs,
  terminology that doesn't match the rest of the docs).
- **Project Ideas** — DX-oriented suggestions for improving the API surface.

A floating walkthrough widget in the top-right of every doc page lets you
step through annotations one at a time, filtered by type and/or section.
A **Global / Guides / API Reference** scope selector lets you walk one
section, the other, or both — tour state survives cross-section navigation.

## What's annotated

- 62 annotations across the Guides section.
- 15 annotations across the API Reference section.

The polished source notes that the annotations are derived from live
outside this repo (in my Obsidian vault).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Layout

```
app/
  docs/[slug]/        — Guides pages (Markdown → HTML with annotations applied)
  reference/[slug]/   — API Reference pages (description + bodyHtml + structured tables)
components/
  Commentary*.tsx     — Marker hydration, popover, scope-aware tour widget
content/
  docs/*.md           — Guides content
  reference/*.json    — Reference endpoint data
  guides-commentary.json
  reference-commentary.json
lib/
  commentary.ts       — Loader, anchor application, global sequence builder
  markdown.ts         — Unified pipeline with ReadMe-style callouts and Shiki highlighting
```

## Credits

All doc content is Yellow Card's, mirrored from their public docs site.
The annotation system, walkthrough widget, and rendering scaffold are mine.
