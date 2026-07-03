"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collections } from "@/lib/products";
import { applyProductFilter } from "@/lib/filterBus";

/**
 * Collections — horizontal pinned showcase (Grid Animations / 4 "grid to full
 * preview" reimagined as a cinematic side-scroll). The section pins and the
 * track translates on vertical scroll, with per-panel image parallax.
 */
export function Collections() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = root.current;
    const inner = track.current;
    if (!section || !inner) return;

    const ctx = gsap.context(() => {
      const getScroll = () => inner.scrollWidth - window.innerWidth;

      const tween = gsap.to(inner, {
        x: () => -getScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScroll()}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          refreshPriority: 20, // refresh after the hero pin, before categories
          pinType: "fixed",
          anticipatePin: 1,
        },
      });

      // parallax each image inside the horizontal motion
      gsap.utils.toArray<HTMLElement>(".kx-collection-img").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -12 },
          {
            xPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest(".kx-collection-panel"),
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="collections"
      ref={root}
      className="relative isolate h-[100svh] overflow-hidden bg-ink"
    >
      <div className="pointer-events-none absolute left-0 top-0 z-10 w-full p-5 sm:p-8 lg:p-10">
        <p className="eyebrow">Colecciones</p>
      </div>

      <div ref={track} className="flex h-full w-max items-center will-change-transform">
        {/* intro panel */}
        <div className="flex h-full w-screen flex-col justify-center px-5 sm:px-8 lg:px-16">
          <h2 className="font-display text-display-lg uppercase leading-[0.9]">
            Hecho por
            <br />
            <span className="display-stroke">divisiones</span>
          </h2>
          <p className="mt-6 max-w-sm text-cloud-dim">
            Cada silueta KINETIK pertenece a una división diseñada para un tipo
            de movimiento. Desliza en horizontal por la línea.
          </p>
        </div>

        {collections.map((c, i) => (
          <button
            key={c.id}
            onClick={() => applyProductFilter(c.division)}
            data-cursor="Ver"
            className="kx-collection-panel group relative mx-3 block h-[72vh] w-[78vw] shrink-0 cursor-pointer overflow-hidden text-left sm:w-[52vw] lg:w-[34vw]"
          >
            <div className="kx-collection-img absolute inset-0 scale-110">
              <Image
                src={c.image}
                alt={c.title}
                fill
                sizes="40vw"
                className="object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-7">
              <span className="font-mono text-xs uppercase tracking-widest text-acid">
                {String(i + 1).padStart(2, "0")} / {c.meta}
              </span>
              <h3 className="mt-2 font-display text-4xl uppercase leading-none lg:text-5xl">
                {c.title}
              </h3>
              <span className="mt-2 inline-block font-mono text-[11px] uppercase tracking-widest text-cloud-dim">
                Ver productos →
              </span>
            </div>
          </button>
        ))}

        {/* end panel */}
        <div className="flex h-full w-[60vw] items-center justify-center px-10">
          <a href="#featured" className="pill-ghost" data-cursor="Ver">
            Ver destacados →
          </a>
        </div>
      </div>
    </section>
  );
}
