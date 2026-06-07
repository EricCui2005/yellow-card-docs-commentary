"use client";

// Floating popover for the currently-active annotation. Position is computed
// from the marker DOM rect, re-computed on scroll/resize, and during the tour
// also retried on a short interval because cross-page navigation can leave
// activeId set before the new page's markers have hydrated.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCommentary, type AnnotationType } from "./CommentaryProvider";

const LABELS: Record<AnnotationType, string> = {
  commentary: "Commentary",
  issue: "Broken Links / Legacy Text",
  project: "Project Ideas",
};

const POPOVER_WIDTH = 340;

function computePosition(id: string): { top: number; left: number } | null {
  const el = document.querySelector<HTMLElement>(
    `.commentary-marker[data-id="${CSS.escape(id)}"]`,
  );
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const wantedLeft = rect.left + window.scrollX;
  const maxLeft = window.scrollX + window.innerWidth - POPOVER_WIDTH - 12;
  const left = Math.max(12, Math.min(wantedLeft, maxLeft));
  return { top: rect.bottom + window.scrollY + 8, left };
}

export default function CommentaryPopover() {
  const {
    sequence,
    activeId,
    isTouring,
    filteredStep,
    filteredTotal,
    close,
    nextStep,
    prevStep,
  } = useCommentary();
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Position with retry. After cross-page navigation, the new page's markers
  // haven't been hydrated yet when activeId flips, so computePosition returns
  // null. Retry on each animation frame for up to ~1 second, plus one extra
  // pass after the smooth-scroll animation would have settled.
  useEffect(() => {
    if (!activeId) {
      setPos(null);
      return;
    }
    let attempts = 0;
    let rafHandle: number | undefined;
    let postScrollTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const tryCompute = () => {
      if (cancelled) return;
      const p = computePosition(activeId);
      if (p) {
        setPos(p);
        return;
      }
      if (++attempts < 60) {
        rafHandle = requestAnimationFrame(tryCompute);
      }
    };
    tryCompute();
    // After the smooth-scroll animation completes, recompute so the popover
    // sits under the marker in its final scrolled position.
    postScrollTimer = setTimeout(() => {
      const p = computePosition(activeId);
      if (p) setPos(p);
    }, 500);

    const reposition = () => {
      const p = computePosition(activeId);
      if (p) setPos(p);
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      cancelled = true;
      if (rafHandle) cancelAnimationFrame(rafHandle);
      if (postScrollTimer) clearTimeout(postScrollTimer);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [activeId]);

  // Esc to close; arrow keys to step during tour
  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (isTouring && e.key === "ArrowRight") nextStep();
      if (isTouring && e.key === "ArrowLeft") prevStep();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeId, isTouring, close, nextStep, prevStep]);

  // Click-outside-to-close, disabled during tour
  useEffect(() => {
    if (!activeId || isTouring) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest(".commentary-popover")) return;
      if (t.closest(".commentary-marker")) return;
      if (t.closest(".commentary-tour")) return;
      close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeId, isTouring, close]);

  if (!activeId || !pos) return null;
  const ann = sequence.find((s) => s.annotation.id === activeId)?.annotation;
  if (!ann) return null;

  const isLast = filteredStep === filteredTotal;
  const isFirst = filteredStep === 1;

  return createPortal(
    <div
      className={`commentary-popover commentary-popover--${ann.type}`}
      style={{ top: pos.top, left: pos.left, width: POPOVER_WIDTH }}
      role="dialog"
      aria-modal="false"
      aria-label={LABELS[ann.type]}
    >
      <div className="commentary-popover-header">
        <span
          className={`commentary-popover-type commentary-popover-type--${ann.type}`}
        >
          {LABELS[ann.type]}
          {isTouring && (
            <span className="commentary-popover-step">
              {" "}
              {filteredStep} / {filteredTotal}
            </span>
          )}
        </span>
        <button
          type="button"
          className="commentary-popover-close"
          aria-label="Close"
          onClick={close}
        >
          ×
        </button>
      </div>
      <div
        className="commentary-popover-body markdown-body"
        dangerouslySetInnerHTML={{ __html: ann.bodyHtml }}
      />
      {isTouring && (
        <div className="commentary-popover-nav">
          <button
            type="button"
            className="commentary-nav-btn"
            onClick={prevStep}
            disabled={isFirst}
            aria-label="Previous"
          >
            ← Prev
          </button>
          <button
            type="button"
            className="commentary-nav-btn commentary-nav-btn--primary"
            onClick={nextStep}
            aria-label={isLast ? "Finish tour" : "Next"}
          >
            {isLast ? "Finish" : "Next →"}
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}
