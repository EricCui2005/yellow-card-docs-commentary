"use client";

// Top-right floating "walk through" widget. Mounted at the root layout so it
// is visible on every Guides AND API Reference page, even ones with zero
// annotations of their own. Hidden on routes outside those two sections.
//
// Three visual states:
//   - idle:    small pill "Commentary (N)" where N is the scope's total
//   - expanded: panel with a Scope row (Global / Guides / API Reference),
//               per-type counts within scope, and Walk-Through buttons
//   - touring: compact bar with step counter (within the active scope+type),
//              progress fill, Prev/Next, End tour

import { useEffect, useState } from "react";
import {
  useCommentary,
  type AnnotationType,
  type Scope,
  type TypeFilter,
} from "./CommentaryProvider";

const TYPE_LABEL: Record<AnnotationType, string> = {
  commentary: "Commentary",
  issue: "Broken Links / Legacy Text",
  project: "Project Ideas",
};

const SCOPE_LABEL: Record<Scope, string> = {
  all: "Global",
  guides: "Guides",
  reference: "API Reference",
};

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1" fill="currentColor" />
      <circle cx="4" cy="12" r="1" fill="currentColor" />
      <circle cx="4" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

export default function CommentaryTour() {
  const {
    sequence,
    currentSection,
    pageAnnotations,
    tourScope,
    tourType,
    filteredStep,
    filteredTotal,
    isTouring,
    startTour,
    endTour,
    openById,
    nextStep,
    prevStep,
  } = useCommentary();
  const [expanded, setExpanded] = useState(false);
  // Panel scope selector — independent of an in-flight tour's scope.
  // Defaults to the section we're currently viewing (or "all" if neither).
  const [panelScope, setPanelScope] = useState<Scope>(
    currentSection ?? "all",
  );

  useEffect(() => {
    if (isTouring) setExpanded(false);
  }, [isTouring]);

  // Keep panel default fresh when navigating between sections (but only when
  // the user hasn't explicitly touched the selector yet — for simplicity we
  // always reset to match the route).
  useEffect(() => {
    setPanelScope(currentSection ?? "all");
  }, [currentSection]);

  if (sequence.length === 0) return null;
  // Hide on routes outside /docs and /reference.
  if (currentSection === null) return null;

  const inScope = (item: (typeof sequence)[number], scope: Scope) =>
    scope === "all" || item.section === scope;

  const scopedItems = sequence.filter((s) => inScope(s, panelScope));
  const scopedCounts = scopedItems.reduce<Record<string, number>>((acc, s) => {
    acc[s.annotation.type] = (acc[s.annotation.type] ?? 0) + 1;
    return acc;
  }, {});
  const scopedTotal = scopedItems.length;

  // For idle pill: also count what's in the panel's current scope so the
  // headline number reflects the user's last view choice.
  const pillCount = scopedTotal;

  if (isTouring) {
    const isFirst = filteredStep <= 1;
    const isLast = filteredStep >= filteredTotal;
    const scopeLabel = SCOPE_LABEL[tourScope];
    const typeLabel = tourType === "all" ? null : TYPE_LABEL[tourType];
    const filterClass = tourType === "all" ? "all" : tourType;
    return (
      <div
        className={`commentary-tour commentary-tour--touring commentary-tour--filter-${filterClass}`}
        role="region"
        aria-label="Commentary tour controls"
      >
        <div className="commentary-tour-progress-line">
          <div
            className="commentary-tour-progress-fill"
            style={{
              width: `${(filteredStep / Math.max(1, filteredTotal)) * 100}%`,
            }}
          />
        </div>
        <div className="commentary-tour-body">
          <div className="commentary-tour-step">
            <div className="commentary-tour-filter-tags">
              <span
                className={`commentary-tour-filter-tag commentary-tour-filter-tag--scope commentary-tour-filter-tag--${tourScope}`}
              >
                {scopeLabel}
              </span>
              {typeLabel && (
                <span
                  className={`commentary-tour-filter-tag commentary-tour-filter-tag--${tourType}`}
                >
                  {typeLabel}
                </span>
              )}
            </div>
            <span className="commentary-tour-step-num">
              Step <strong>{filteredStep}</strong> of {filteredTotal}
            </span>
          </div>
          <button
            type="button"
            className="commentary-tour-end-x"
            onClick={endTour}
            aria-label="End tour"
            title="End tour"
          >
            ×
          </button>
        </div>
        <div className="commentary-tour-nav">
          <button
            type="button"
            className="commentary-tour-nav-btn"
            onClick={prevStep}
            disabled={isFirst}
            aria-label="Previous"
          >
            ← Prev
          </button>
          <button
            type="button"
            className="commentary-tour-nav-btn commentary-tour-nav-btn--primary"
            onClick={nextStep}
            aria-label={isLast ? "Finish tour" : "Next"}
          >
            {isLast ? "Finish" : "Next →"}
          </button>
        </div>
      </div>
    );
  }

  // Filter buttons within the chosen scope.
  const typeOptions: Array<{ key: TypeFilter; label: string; count: number }> = [
    { key: "all", label: "All", count: scopedTotal },
    ...(["commentary", "issue", "project"] as AnnotationType[])
      .filter((t) => scopedCounts[t])
      .map((t) => ({
        key: t as TypeFilter,
        label: TYPE_LABEL[t],
        count: scopedCounts[t],
      })),
  ];

  const SCOPE_OPTIONS: Scope[] = ["all", "guides", "reference"];

  return (
    <div className={`commentary-tour ${expanded ? "commentary-tour--expanded" : ""}`}>
      {!expanded && (
        <button
          type="button"
          className="commentary-tour-trigger"
          onClick={() => setExpanded(true)}
          aria-label={`Show ${pillCount} commentary items in ${SCOPE_LABEL[panelScope]}`}
        >
          <ListIcon />
          <span className="commentary-tour-trigger-label">Commentary</span>
          <span className="commentary-tour-trigger-count">{pillCount}</span>
        </button>
      )}

      {expanded && (
        <div
          className="commentary-tour-panel"
          role="region"
          aria-label="Commentary index"
        >
          <div className="commentary-tour-panel-header">
            <span className="commentary-tour-panel-title">
              {panelScope === "all"
                ? "Across the docs"
                : `Across ${SCOPE_LABEL[panelScope]}`}
            </span>
            <button
              type="button"
              className="commentary-tour-panel-close"
              aria-label="Close"
              onClick={() => setExpanded(false)}
            >
              ×
            </button>
          </div>

          {/* Scope selector — pick which surface to walk. */}
          <div
            className="commentary-tour-scope-row"
            role="tablist"
            aria-label="Tour scope"
          >
            {SCOPE_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={panelScope === s}
                className={`commentary-tour-scope-btn ${
                  panelScope === s ? "commentary-tour-scope-btn--active" : ""
                }`}
                onClick={() => setPanelScope(s)}
              >
                {SCOPE_LABEL[s]}
              </button>
            ))}
          </div>

          <div className="commentary-tour-panel-counts">
            {(["commentary", "issue", "project"] as AnnotationType[])
              .filter((t) => scopedCounts[t])
              .map((t) => (
                <div
                  key={t}
                  className={`commentary-tour-count-row commentary-tour-count-row--${t}`}
                >
                  <span className="commentary-tour-count-dot" />
                  <span className="commentary-tour-count-label">
                    {TYPE_LABEL[t]}
                  </span>
                  <span className="commentary-tour-count-num">
                    {scopedCounts[t]}
                  </span>
                </div>
              ))}
            {scopedTotal === 0 && (
              <div className="commentary-tour-empty">
                No commentary in this scope yet.
              </div>
            )}
          </div>

          {/* Walk Through buttons (scope + type combinations) */}
          {scopedTotal > 0 && (
            <div className="commentary-tour-start-group">
              {typeOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className={`commentary-tour-start commentary-tour-start--${opt.key}`}
                  onClick={() => {
                    setExpanded(false);
                    startTour({ scope: panelScope, type: opt.key });
                  }}
                >
                  <PlayIcon />
                  <span className="commentary-tour-start-label">
                    Walk through {opt.label.toLowerCase()}
                  </span>
                  <span className="commentary-tour-start-count">
                    {opt.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {pageAnnotations.length > 0 && (
            <>
              <div className="commentary-tour-panel-subhead">
                On this page ({pageAnnotations.length})
              </div>
              <div className="commentary-tour-panel-list" role="list">
                {pageAnnotations.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className={`commentary-tour-list-item commentary-tour-list-item--${a.type}`}
                    onClick={() => {
                      setExpanded(false);
                      openById(a.id, { scroll: true });
                    }}
                    role="listitem"
                  >
                    <span className="commentary-tour-list-dot" />
                    <span className="commentary-tour-list-text">
                      {previewBody(a.bodyHtml)}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function previewBody(html: string): string {
  const text = html
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/&[a-z]+;|&#x?\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 78 ? `${text.slice(0, 76)}…` : text;
}
