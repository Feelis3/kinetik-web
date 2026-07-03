"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { products } from "@/lib/products";
import { useCart } from "@/components/providers/Cart";

/**
 * Featured — hover-reveal name list ported from Grid Animations / 8
 * ("Hover Grid"). Hovering a product name reveals its full-bleed image with a
 * directional clip-path wipe and a brightness flash; the rest dim away.
 */
const DIRS = [
  "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)", // right
  "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)", // left
  "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", // top
  "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", // bottom
];
const FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

export function Featured() {
  const [active, setActive] = useState<number | null>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { add } = useCart();

  const show = (i: number) => {
    setActive(i);
    const el = imgRefs.current[i];
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      {
        clipPath: DIRS[i % DIRS.length],
        filter: "brightness(280%)",
        scale: 1.15,
      },
      {
        clipPath: FULL,
        filter: "brightness(100%)",
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: "power4.out",
      }
    );
  };

  const hide = (i: number) => {
    const el = imgRefs.current[i];
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.to(el, { opacity: 0, duration: 0.5, ease: "power3.out" });
    setActive((a) => (a === i ? null : a));
  };

  return (
    <section
      id="featured"
      className="relative min-h-screen overflow-hidden bg-ink py-section"
    >
      {/* background reveal layer */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {products.map((p, i) => (
          <div
            key={p.id}
            ref={(el) => {
              imgRefs.current[i] = el;
            }}
            className="absolute inset-0 opacity-0"
            style={{ clipPath: FULL }}
          >
            <Image
              src={p.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-ink/55" />
          </div>
        ))}
      </div>

      <div className="container-x relative z-10">
        <div className="mb-10 flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-heading-xl uppercase">Lo nuevo</h2>
          <p className="max-w-xs text-sm text-cloud-dim sm:text-right">
            Ocho siluetas en rotación. Toca un producto para añadirlo.
          </p>
        </div>

        <ul className="divide-y divide-line/60">
          {products.map((p, i) => (
            <li
              key={p.id}
              onMouseEnter={() => show(i)}
              onMouseLeave={() => hide(i)}
              className="group relative flex cursor-pointer items-center justify-between gap-6 py-6 transition-opacity duration-300 md:py-7"
              style={{
                opacity: active === null || active === i ? 1 : 0.35,
              }}
            >
              <div className="flex items-baseline gap-5">
                <span className="font-mono text-xs text-mute">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-4xl uppercase leading-none transition-transform duration-500 group-hover:translate-x-3 md:text-6xl">
                  {p.name}
                </h3>
              </div>
              <div className="flex items-center gap-5">
                <span className="hidden font-mono text-xs uppercase tracking-widest text-cloud-dim sm:block">
                  {p.category}
                </span>
                <span className="font-mono text-sm text-acid">
                  {p.salePrice ?? p.price}€
                </span>
                <button
                  data-cursor="Añadir"
                  onClick={(e) => {
                    e.stopPropagation();
                    add(e.currentTarget, {
                      id: p.id,
                      name: p.name,
                      category: p.category,
                      price: p.salePrice ?? p.price,
                      image: p.image,
                    });
                  }}
                  className="shrink-0 rounded-full border border-line px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-cloud transition-colors hover:border-acid hover:text-acid"
                >
                  + Añadir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
