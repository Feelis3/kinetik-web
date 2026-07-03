"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { applyProductFilter } from "@/lib/filterBus";

/**
 * Sticky / magnetic images — a performance-conscious recreation of the effect
 * in Awwwards Pack "+19 WebGL/ThreeJS / 4" (Sticky Image Effect). The original
 * warps a GL plane toward the cursor; here the framed image "sticks" to the
 * pointer with elastic lag, a velocity skew and a scale-up — same magnetic feel
 * without a WebGL context.
 */
const ITEMS = [
  { img: "/img/editorial/img7.webp", label: "Carrera" },
  { img: "/img/editorial/img16.webp", label: "Trail" },
  { img: "/img/editorial/img25.webp", label: "Pista" },
];

export function StickyImages() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const cleanups: (() => void)[] = [];

    section.querySelectorAll<HTMLElement>(".kx-sticky").forEach((frame) => {
      const inner = frame.querySelector<HTMLElement>(".kx-sticky-img");
      if (!inner) return;

      const xTo = gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3" });
      const skewTo = gsap.quickTo(inner, "skewX", { duration: 0.5, ease: "power3" });
      let lastX = 0;

      const onEnter = () =>
        gsap.to(inner, { scale: 1.08, duration: 0.6, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const r = frame.getBoundingClientRect();
        const relX = e.clientX - (r.left + r.width / 2);
        const relY = e.clientY - (r.top + r.height / 2);
        // image sticks toward the cursor (a fraction of the offset)
        xTo(relX * 0.32);
        yTo(relY * 0.32);
        skewTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.4));
        lastX = e.clientX;
      };
      const onLeave = () => {
        gsap.to(inner, {
          x: 0,
          y: 0,
          skewX: 0,
          scale: 1,
          duration: 0.9,
          ease: "elastic.out(1, 0.5)",
        });
      };

      frame.addEventListener("pointerenter", onEnter);
      frame.addEventListener("pointermove", onMove);
      frame.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        frame.removeEventListener("pointerenter", onEnter);
        frame.removeEventListener("pointermove", onMove);
        frame.removeEventListener("pointerleave", onLeave);
      });
    });

    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <section ref={root} className="bg-ink py-section">
      <div className="container-x">
        <div className="mb-16 flex items-end justify-between border-b border-line pb-6">
          <h2 className="font-display text-heading-xl uppercase">
            Compra por deporte
          </h2>
          <p className="eyebrow">Elige tu disciplina</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {ITEMS.map((it) => (
            <button
              key={it.label}
              onClick={() => applyProductFilter(it.label)}
              className="kx-sticky group relative block aspect-[3/4] cursor-pointer overflow-hidden bg-surface text-left"
              data-cursor="Ver"
            >
              <div
                className="kx-sticky-img absolute inset-[-12%] bg-cover bg-center will-change-transform"
                style={{ backgroundImage: `url(${it.img})` }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <div className="pointer-events-none absolute bottom-5 left-5 z-10">
                <span className="block font-display text-2xl uppercase">
                  {it.label}
                </span>
                <span className="mt-1 block font-mono text-[11px] uppercase tracking-widest text-cloud-dim">
                  Ver productos →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
