"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { categories } from "@/lib/products";

/**
 * Categories — "layout formation on scroll" (Grid Animations / 7). Tiles fly up
 * into formation once and stay; clicking a tile jumps to the featured lineup.
 */
export function Categories() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = root.current;
    if (!section) return;
    const grid = section.querySelector<HTMLElement>(".kx-cat-grid");
    if (!grid) return;
    const tiles = grid.querySelectorAll<HTMLElement>(".kx-cat-tile");
    const mid = Math.floor(tiles.length / 2);

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3", duration: 1.1 },
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none none",
          },
        })
        .from(tiles, {
          stagger: { amount: 0.35, from: "center" },
          yPercent: 150,
          autoAlpha: 0,
          transformOrigin: "50% 0%",
          rotation: (pos: number) => {
            const d = Math.abs(pos - mid);
            return pos < mid ? d * 4 : d * -4;
          },
        })
        .from(
          section.querySelector(".kx-cat-title"),
          { yPercent: 120, autoAlpha: 0, duration: 1, ease: "power4" },
          0.3
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="categories"
      ref={root}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-ink py-section"
    >
      <div className="container-x pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-center">
        <h2 className="kx-cat-title font-display text-display-xl uppercase leading-none text-cloud/10">
          Encuentra tu
          <br />
          terreno
        </h2>
      </div>

      <div className="container-x relative z-10">
        <p className="eyebrow mb-8">Compra por categoría</p>
        <div className="kx-cat-grid grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <a
              key={c.label}
              href="#featured"
              data-cursor="Ver"
              className="kx-cat-tile group relative aspect-[3/4] overflow-hidden bg-surface"
            >
              <Image
                src={c.image}
                alt={c.label}
                fill
                sizes="(max-width:768px) 50vw, 16vw"
                className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <span className="absolute bottom-4 left-4 font-display text-xl uppercase">
                {c.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
