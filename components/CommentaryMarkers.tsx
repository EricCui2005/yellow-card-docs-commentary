"use client";

// Hydrates the empty <span class="commentary-marker"> tags produced by
// applyAnnotations() on the server. Fills each with a type-specific icon
// and wires a click handler that opens the popover via context.
//
// Renders no DOM itself - all visual work happens via mutation of the
// pre-existing marker spans.

import { useEffect } from "react";
import {
  useCommentary,
  type AnnotationType,
} from "./CommentaryProvider";

const ICONS: Record<AnnotationType, string> = {
  commentary: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  issue: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  project: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>`,
};

const LABELS: Record<AnnotationType, string> = {
  commentary: "Commentary",
  issue: "Broken Links / Legacy Text",
  project: "Project Ideas",
};

export default function CommentaryMarkers() {
  const { pageAnnotations, openById } = useCommentary();

  useEffect(() => {
    const byId = new Map(pageAnnotations.map((a) => [a.id, a]));
    const markers = Array.from(
      document.querySelectorAll<HTMLElement>(".commentary-marker"),
    );
    const cleanups: Array<() => void> = [];

    for (const el of markers) {
      const id = el.dataset.id;
      const typeAttr = el.dataset.type as AnnotationType | undefined;
      if (!id || !typeAttr || !byId.has(id)) continue;

      // Fully idempotent: innerHTML overwrites, listeners are added & removed
      // in balanced pairs. Don't use a DOM-stored "hydrated" flag here; in
      // React Strict mode the effect runs twice and a persistent flag causes
      // the second mount to skip handler attachment after the first cleanup.
      el.innerHTML = ICONS[typeAttr] || "";
      el.classList.add(`commentary-marker--${typeAttr}`);
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute(
        "aria-label",
        `${LABELS[typeAttr]} click to expand`,
      );

      const onClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        openById(id);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openById(id);
        }
      };
      el.addEventListener("click", onClick);
      el.addEventListener("keydown", onKey);
      cleanups.push(() => {
        el.removeEventListener("click", onClick);
        el.removeEventListener("keydown", onKey);
      });
    }

    return () => cleanups.forEach((c) => c());
  }, [pageAnnotations, openById]);

  return null;
}
