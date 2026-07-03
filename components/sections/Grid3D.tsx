"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "@/lib/products";
import { useCart } from "@/components/providers/Cart";

/**
 * 3D scroll grid — ported from Awwwards Pack "+57 Scroll Animation / 6"
 * (Staggered 3D Grid). Each image wrap tilts through 3D space (rotateX / z /
 * skew / blur) as it scrolls through the viewport, with left/right items
 * mirroring their skew. Pure GSAP + CSS 3D, no WebGL.
 */

const IMAGES = [
  "/img/editorial/img8.webp",
  "/img/editorial/img13.webp",
  "/img/editorial/img18.webp",
  "/img/editorial/img24.webp",
  "/img/editorial/img29.webp",
  "/img/editorial/img32.webp",
  "/img/editorial/img11.webp",
  "/img/editorial/img20.webp",
];

export function Grid3D() {
  const root = useRef<HTMLDivElement>(null);
  const { add } = useCart();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = root.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      section.querySelectorAll<HTMLElement>(".kx-g3-wrap").forEach((wrap) => {
        const img = wrap.querySelector(".kx-g3-img");
        const rect = wrap.getBoundingClientRect();
        const leftSide = rect.left + wrap.offsetWidth / 2 < window.innerWidth / 2;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: wrap,
              start: "top bottom+=10%",
              end: "bottom top-=25%",
              scrub: true,
            },
          })
          .from(wrap, {
            startAt: { filter: "blur(0px) brightness(100%) contrast(100%)" },
            z: 300,
            rotateX: 70,
            rotateZ: leftSide ? 5 : -5,
            xPercent: leftSide ? -40 : 40,
            skewX: leftSide ? -20 : 20,
            yPercent: 100,
            filter: "blur(7px) brightness(0%) contrast(400%)",
            ease: "sine",
          })
          .to(wrap, {
            z: 300,
            rotateX: -50,
            rotateZ: leftSide ? -1 : 1,
            xPercent: leftSide ? -20 : 20,
            skewX: leftSide ? 10 : -10,
            filter: "blur(4px) brightness(0%) contrast(500%)",
            ease: "sine.in",
          })
          .from(img, { scaleY: 1.8, ease: "sine" }, 0)
          .to(img, { scaleY: 1.8, ease: "sine.in" }, ">");
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-ink py-section"
      style={{ perspective: "1200px" }}
    >
      <div className="container-x mb-16 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <h2 className="font-display text-heading-xl uppercase">Editorial SS26</h2>
        <a href="#rotation" className="pill-ghost" data-cursor="Comprar">
          Comprar la colección →
        </a>
      </div>

      <div
        className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-x-16 gap-y-12 px-6 md:grid-cols-2 md:gap-y-[28vh]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {IMAGES.map((src, i) => {
          const p = products[i % products.length];
          return (
            <div
              key={src}
              className={`kx-g3-wrap group relative aspect-[4/5] overflow-hidden bg-surface will-change-transform ${
                i % 2 === 0 ? "" : "md:translate-y-[18vh]"
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="kx-g3-img absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
              />
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/85 to-transparent p-5">
                <div>
                  <p className="font-display text-lg uppercase leading-none">
                    {p.name}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-acid">
                    {p.salePrice ?? p.price}€
                  </p>
                </div>
                <button
                  data-cursor="Añadir"
                  onClick={(e) =>
                    add(e.currentTarget.closest(".kx-g3-wrap") as HTMLElement, {
                      id: p.id,
                      name: p.name,
                      category: p.category,
                      price: p.salePrice ?? p.price,
                      image: p.image,
                    })
                  }
                  className="shrink-0 rounded-full bg-cloud px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ink transition-colors hover:bg-acid"
                >
                  + Añadir
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
