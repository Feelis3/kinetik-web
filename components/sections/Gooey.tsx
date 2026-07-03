"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useCart } from "@/components/providers/Cart";

/**
 * Gooey hover — a light recreation of Awwwards Pack "+19 WebGL/ThreeJS / 3"
 * (Gooey Hover). Instead of a WebGL framework, several circles chase the cursor
 * with staggered lag under an SVG "goo" filter, fusing into one stretchy liquid
 * blob that interacts with the image via mix-blend. Scoped to the section.
 */
const BLOBS = 6;

export function Gooey() {
  const root = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const { add } = useCart();

  useEffect(() => {
    const section = root.current;
    const lay = layer.current;
    if (!section || !lay) return;
    if (window.matchMedia("(hover: none)").matches) {
      lay.style.display = "none";
      return;
    }

    const dots = Array.from(lay.querySelectorAll<HTMLElement>(".kx-blob"));
    // each dot follows with progressively more lag -> the blob stretches
    const movers = dots.map((d, i) => ({
      x: gsap.quickTo(d, "x", { duration: 0.3 + i * 0.12, ease: "power3" }),
      y: gsap.quickTo(d, "y", { duration: 0.3 + i * 0.12, ease: "power3" }),
    }));

    let inside = false;
    const onEnter = () => {
      inside = true;
      gsap.to(dots, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.02 });
    };
    const onLeave = () => {
      inside = false;
      gsap.to(dots, { scale: 0, opacity: 0, duration: 0.4, ease: "power3.in" });
    };
    const onMove = (e: PointerEvent) => {
      if (!inside) return;
      const r = section.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      movers.forEach((m) => {
        m.x(x);
        m.y(y);
      });
    };

    section.addEventListener("pointerenter", onEnter);
    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("pointermove", onMove);
    return () => {
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[80svh] items-center justify-center overflow-hidden border-y border-line bg-ink"
    >
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id="kx-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -12"
              result="goo"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url(/img/editorial/img31.webp)" }}
      />
      <div className="absolute inset-0 bg-ink/50" />

      {/* gooey blob layer */}
      <div
        ref={layer}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 mix-blend-difference"
        style={{ filter: "url(#kx-goo)" }}
      >
        {Array.from({ length: BLOBS }).map((_, i) => (
          <div
            key={i}
            className="kx-blob absolute h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cloud opacity-0"
            style={{ left: 0, top: 0, transform: "scale(0)" }}
          />
        ))}
      </div>

      <div className="relative z-20 flex flex-col items-center px-6 text-center">
        <p className="eyebrow mb-4">Edición limitada — solo online</p>
        <h2 className="font-display text-display-lg uppercase leading-[0.9]">
          AERO-01
          <br />
          Holo
        </h2>
        <p className="mt-5 font-mono text-sm text-cloud-dim">
          280€ · stock limitado
        </p>
        <button
          data-cursor="Añadir"
          onClick={(e) =>
            add(e.currentTarget, {
              id: "aero-01-holo",
              name: "AERO-01 Holo",
              category: "Edición Limitada",
              price: 280,
              image: "/img/sneakers/sneaker-5.jpg",
            })
          }
          className="pill-primary mt-7"
        >
          Añadir al carrito
        </button>
      </div>
    </section>
  );
}
