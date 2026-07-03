"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Custom cursor (Mouse Effect family). A small dot follows the pointer with a
 * spring lag; over elements tagged `data-cursor` it expands into a labelled
 * disc ("View", "Add", "Close"), and over plain links/buttons into a ring.
 * Disabled on touch / reduced-motion.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (
      window.matchMedia("(hover: none)").matches ||
      document.documentElement.classList.contains("reduce-motion")
    )
      return;

    const el = dot.current!;
    const lbl = label.current!;
    gsap.set(el, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(el, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.2, ease: "power3" });

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const setState = (mode: "default" | "ring" | "label", text = "") => {
      if (mode === "label") {
        lbl.textContent = text;
        gsap.to(el, {
          width: 74,
          height: 74,
          backgroundColor: "#F5F5F5",
          borderWidth: 0,
          duration: 0.35,
          ease: "power3",
        });
        gsap.to(lbl, { opacity: 1, duration: 0.25 });
      } else if (mode === "ring") {
        gsap.to(lbl, { opacity: 0, duration: 0.15 });
        gsap.to(el, {
          width: 44,
          height: 44,
          backgroundColor: "rgba(0,0,0,0)",
          borderWidth: 1,
          duration: 0.35,
          ease: "power3",
        });
      } else {
        gsap.to(lbl, { opacity: 0, duration: 0.15 });
        gsap.to(el, {
          width: 10,
          height: 10,
          backgroundColor: "#F5F5F5",
          borderWidth: 0,
          duration: 0.35,
          ease: "power3",
        });
      }
    };

    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.(
        "[data-cursor],a,button"
      ) as HTMLElement | null;
      if (!t) return setState("default");
      const dc = t.getAttribute("data-cursor");
      if (dc !== null && dc !== "") setState("label", dc);
      else setState("ring");
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.classList.add("kx-has-cursor");

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("kx-has-cursor");
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-2.5 w-2.5 items-center justify-center rounded-full border-cloud bg-cloud shadow-[0_0_0_1px_rgba(10,10,11,0.25)] md:flex"
    >
      <span
        ref={label}
        className="select-none font-mono text-[10px] uppercase tracking-widest text-ink opacity-0"
      />
    </div>
  );
}
