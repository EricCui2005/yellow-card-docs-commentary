"use client";

// Global commentary state for the entire Guides + API Reference surface.
//
// This provider sits at the ROOT layout level so its state survives every
// child navigation, including cross-section moves between /docs/* and
// /reference/*. A tour can therefore span both sections: Next/Prev increment
// globalIndex, and when the new item's (section, slug) differs from the
// current page, the provider router.pushes to the right URL; on arrival,
// an effect re-opens the annotation on the new page.
//
// Consumed by:
//   <CommentaryMarkers />  (per-page) - hydrates marker spans, calls openById
//   <CommentaryPopover />  (per-page) - renders floating popover for activeId
//   <CommentaryTour />     (root)     - top-right widget + tour controls

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

export type AnnotationType = "commentary" | "issue" | "project";
export type Section = "guides" | "reference";

/** Type filter: "all" walks every annotation; a specific type walks only that subset. */
export type TypeFilter = "all" | AnnotationType;

/** Scope filter: "all" walks both sections; "guides" or "reference" restricts to one. */
export type Scope = "all" | Section;

export interface ClientAnnotation {
  id: string;
  type: AnnotationType;
  bodyHtml: string;
}

export interface SequenceItem {
  section: Section;
  slug: string;
  annotation: ClientAnnotation;
}

interface CommentaryContextValue {
  /** The full global sequence across every Guides + Reference page, in nav order. */
  sequence: SequenceItem[];
  /** Section of the page currently mounted, or null on routes outside /docs and /reference. */
  currentSection: Section | null;
  /** Slug of the page currently mounted (empty if on the section index). */
  currentSlug: string;
  /** Annotations on the current page (matches both section + slug). */
  pageAnnotations: ClientAnnotation[];
  /** Id of the annotation whose popover is currently open, if any. */
  activeId: string | null;
  /** 0-based index into `sequence`, or -1 when no tour is running. */
  globalIndex: number;
  /** Active scope for the running tour ("all" | "guides" | "reference"). */
  tourScope: Scope;
  /** Active type filter for the running tour. */
  tourType: TypeFilter;
  /** Number of items matching the active scope+type. */
  filteredTotal: number;
  /** 1-based position of the current step within the filtered subset. */
  filteredStep: number;
  isTouring: boolean;
  openById: (id: string, opts?: { scroll?: boolean }) => void;
  close: () => void;
  /** Begin a tour, optionally restricted by scope and/or type. */
  startTour: (opts?: { scope?: Scope; type?: TypeFilter }) => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
}

const Ctx = createContext<CommentaryContextValue | null>(null);

export function useCommentary(): CommentaryContextValue {
  const v = useContext(Ctx);
  if (!v)
    throw new Error("useCommentary must be used inside <CommentaryProvider>");
  return v;
}

function parsePath(pathname: string): { section: Section | null; slug: string } {
  let m = pathname.match(/^\/docs\/?(.*)$/);
  if (m) return { section: "guides", slug: m[1].replace(/\/$/, "") };
  m = pathname.match(/^\/reference\/?(.*)$/);
  if (m) return { section: "reference", slug: m[1].replace(/\/$/, "") };
  return { section: null, slug: "" };
}

function routePrefixFor(section: Section): string {
  return section === "guides" ? "/docs" : "/reference";
}

// Sticky site header is ~150px tall (disclaimer strip + top row + nav row);
// leave a buffer so the marker doesn't end up tucked just under it.
const HEADER_OFFSET_PX = 184;
const BOTTOM_BUFFER_PX = 80;

function isMarkerComfortablyInView(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  return (
    r.top >= HEADER_OFFSET_PX &&
    r.bottom <= window.innerHeight - BOTTOM_BUFFER_PX
  );
}

function scrollWindowToMarker(el: HTMLElement) {
  // Compute the target Y manually rather than relying on scrollIntoView's
  // `block: "center"`, which is a no-op when the browser considers the
  // marker "in view" - even when it's actually obscured by the sticky
  // header. Manual scrollTo always moves to the intended position.
  const rect = el.getBoundingClientRect();
  const visibleHeight = window.innerHeight - HEADER_OFFSET_PX;
  const targetY =
    window.scrollY + rect.top - HEADER_OFFSET_PX - visibleHeight / 2 +
    rect.height / 2;
  window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
}

function scrollMarkerIntoView(id: string) {
  // Retry finding the marker because cross-page navigation can leave us
  // here before the new page's DOM has mounted with the marker spans.
  let findAttempts = 0;
  const FIND_MAX = 90; // ~1.5s at 60fps

  const verify = (el: HTMLElement) => {
    if (!isMarkerComfortablyInView(el)) {
      scrollWindowToMarker(el);
    }
  };

  const tick = () => {
    const el = document.querySelector<HTMLElement>(
      `.commentary-marker[data-id="${CSS.escape(id)}"]`,
    );
    if (el) {
      scrollWindowToMarker(el);
      // Verify after the smooth scroll has had time to settle. Late layout
      // shifts (shiki finalization, font loading, the popover mounting) can
      // bump the marker after our initial scrollTo; check once and re-scroll
      // if so. A second verify covers slower layout shifts.
      setTimeout(() => {
        const e = document.querySelector<HTMLElement>(
          `.commentary-marker[data-id="${CSS.escape(id)}"]`,
        );
        if (e) verify(e);
      }, 550);
      setTimeout(() => {
        const e = document.querySelector<HTMLElement>(
          `.commentary-marker[data-id="${CSS.escape(id)}"]`,
        );
        if (e) verify(e);
      }, 1200);
      return;
    }
    if (++findAttempts < FIND_MAX) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export default function CommentaryProvider({
  sequence,
  children,
}: {
  sequence: SequenceItem[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { section: currentSection, slug: currentSlug } = parsePath(pathname);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [globalIndex, setGlobalIndex] = useState<number>(-1);
  const [tourScope, setTourScope] = useState<Scope>("all");
  const [tourType, setTourType] = useState<TypeFilter>("all");

  const isTouring = globalIndex >= 0;

  // Helpers for filter-aware navigation. Tour walks the full `sequence` but
  // nextStep / prevStep skip over items whose section or type doesn't match.
  const matches = useCallback(
    (item: SequenceItem | undefined, scope: Scope, type: TypeFilter) => {
      if (!item) return false;
      if (scope !== "all" && item.section !== scope) return false;
      if (type !== "all" && item.annotation.type !== type) return false;
      return true;
    },
    [],
  );

  const filteredTotal = useMemo(
    () => sequence.filter((s) => matches(s, tourScope, tourType)).length,
    [sequence, tourScope, tourType, matches],
  );

  const filteredStep = useMemo(() => {
    if (globalIndex < 0) return 0;
    let count = 0;
    for (let i = 0; i <= globalIndex && i < sequence.length; i++) {
      if (matches(sequence[i], tourScope, tourType)) count++;
    }
    return count;
  }, [sequence, globalIndex, tourScope, tourType, matches]);

  const pageAnnotations = useMemo(
    () =>
      sequence
        .filter(
          (s) => s.section === currentSection && s.slug === currentSlug,
        )
        .map((s) => s.annotation),
    [sequence, currentSection, currentSlug],
  );

  // Reconcile tour state against the current page whenever either changes.
  // - If a tour is running and the current item lives on this page, open it.
  // - If the current item lives on another page, the popover stays closed
  //   here (it will open once the user navigates and the new page mounts).
  // - If no tour is running, navigating away clears any stale popover.
  useEffect(() => {
    if (isTouring) {
      const item = sequence[globalIndex];
      if (
        item &&
        item.section === currentSection &&
        item.slug === currentSlug
      ) {
        setActiveId(item.annotation.id);
        scrollMarkerIntoView(item.annotation.id);
      } else {
        setActiveId(null);
      }
    } else {
      setActiveId(null);
    }
    // We intentionally re-run on every pathname change so popovers from a
    // previous page don't linger.
  }, [currentSection, currentSlug, globalIndex, isTouring, sequence]);

  const openById = useCallback(
    (id: string, opts: { scroll?: boolean } = {}) => {
      setActiveId(id);
      // If a tour is in progress and the user clicks a marker out of order,
      // re-sync the tour index to that marker.
      setGlobalIndex((prev) => {
        if (prev < 0) return prev;
        const idx = sequence.findIndex((s) => s.annotation.id === id);
        return idx >= 0 ? idx : prev;
      });
      if (opts.scroll) scrollMarkerIntoView(id);
    },
    [sequence],
  );

  const close = useCallback(() => {
    setActiveId(null);
  }, []);

  const startTour = useCallback(
    (opts: { scope?: Scope; type?: TypeFilter } = {}) => {
      if (sequence.length === 0) return;
      const scope = opts.scope ?? "all";
      const type = opts.type ?? "all";
      setTourScope(scope);
      setTourType(type);
      // Find the first item that matches the requested filter.
      const first = sequence.findIndex((s) => matches(s, scope, type));
      if (first < 0) return;
      setGlobalIndex(first);
      const item = sequence[first];
      if (item.section !== currentSection || item.slug !== currentSlug) {
        router.push(`${routePrefixFor(item.section)}/${item.slug}`);
      }
      // Same-page case is handled by the reconcile effect.
    },
    [sequence, currentSection, currentSlug, router, matches],
  );

  const move = useCallback(
    (delta: number) => {
      if (globalIndex < 0) return;
      // Step over items that don't match the active filter so the user only
      // sees the subset they asked to walk through.
      let next = globalIndex + delta;
      while (
        next >= 0 &&
        next < sequence.length &&
        !matches(sequence[next], tourScope, tourType)
      ) {
        next += delta;
      }
      if (next < 0) return; // clamp at start
      if (next >= sequence.length) {
        // End of tour
        setGlobalIndex(-1);
        setActiveId(null);
        setTourScope("all");
        setTourType("all");
        return;
      }
      setGlobalIndex(next);
      const item = sequence[next];
      if (item.section !== currentSection || item.slug !== currentSlug) {
        router.push(`${routePrefixFor(item.section)}/${item.slug}`);
      }
      // Same-page case is handled by the reconcile effect.
    },
    [
      globalIndex,
      sequence,
      currentSection,
      currentSlug,
      router,
      tourScope,
      tourType,
      matches,
    ],
  );

  const nextStep = useCallback(() => move(1), [move]);
  const prevStep = useCallback(() => move(-1), [move]);

  const endTour = useCallback(() => {
    setGlobalIndex(-1);
    setActiveId(null);
    setTourScope("all");
    setTourType("all");
  }, []);

  return (
    <Ctx.Provider
      value={{
        sequence,
        currentSection,
        currentSlug,
        pageAnnotations,
        activeId,
        globalIndex,
        tourScope,
        tourType,
        filteredTotal,
        filteredStep,
        isTouring,
        openById,
        close,
        startTour,
        nextStep,
        prevStep,
        endTour,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
