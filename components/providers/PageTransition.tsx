"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { gsap } from "gsap";

/**
 * Cover-style page transition — ported from Awwwards Pack
 * "+17 Page Transitions / 5" (CoverPageTransition). Two overlay panels
 * scale vertically to cover the viewport, an action runs at the covered
 * midpoint, then the panels retract to reveal. Exposed app-wide so the
 * fullscreen nav can wipe between in-page destinations.
 */

type Ctx = { transition: (action?: () => void) => void };
const TransitionCtx = createContext<Ctx>({ transition: () => {} });
export const usePageTransition = () => useContext(TransitionCtx);

export function PageTransition({ children }: { children: React.ReactNode }) {
  const topRow = useRef<HTMLDivElement>(null);
  const bottomRow = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  // intro reveal on first paint
  useEffect(() => {
    const rows = [topRow.current, bottomRow.current];
    gsap
      .timeline({ defaults: { ease: "power3.inOut", duration: 0.9 } })
      .set(rows, { scaleY: 1 })
      .set(word.current, { opacity: 1, y: 0 })
      .to(word.current, { opacity: 0, y: -20, duration: 0.5, delay: 0.5 })
      .to(rows, { scaleY: 0, stagger: 0.05 }, "<0.1");
  }, []);

  const transition = useCallback((action?: () => void) => {
    if (busy.current) return;
    busy.current = true;
    const rows = [topRow.current, bottomRow.current];
    gsap
      .timeline({
        defaults: { ease: "power3.inOut", duration: 0.7 },
        onComplete: () => (busy.current = false),
      })
      .to(rows, { scaleY: 1, transformOrigin: "50% 100%" })
      .set(word.current, { opacity: 1, y: 0 })
      .add(() => action?.())
      .to(word.current, { opacity: 0, y: -16, duration: 0.4 }, "+=0.15")
      .to(rows, { scaleY: 0, transformOrigin: "50% 0%", stagger: 0.05 }, "<");
  }, []);

  return (
    <TransitionCtx.Provider value={{ transition }}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-[9999]">
        <div
          ref={topRow}
          className="absolute left-0 top-0 h-1/2 w-full origin-top scale-y-0 bg-ink"
        />
        <div
          ref={bottomRow}
          className="absolute bottom-0 left-0 h-1/2 w-full origin-bottom scale-y-0 bg-ink"
        />
        <div
          ref={word}
          className="absolute inset-0 flex items-center justify-center opacity-0"
        >
          <span className="font-display text-5xl uppercase tracking-tight text-cloud">
            KINE<span className="text-acid">TIK</span>
          </span>
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}
