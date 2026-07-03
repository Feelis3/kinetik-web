"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { products } from "@/lib/products";
import { useCart } from "@/components/providers/Cart";

/**
 * Fullscreen clip reveal — distilled from Awwwards Pack "+57 Scroll Animation / 4"
 * (Fullscreen Clip Effect). A fullscreen cover clips away to reveal a product
 * grid behind it, and clips back — a satisfying open/close transition.
 */
const COVER = "/img/editorial/img10.webp";
const GRID = products.slice(0, 6);

export function ClipReveal() {
  const [open, setOpen] = useState(false);
  const cover = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const { add } = useCart();

  const toggle = () => {
    if (busy.current || !cover.current) return;
    busy.current = true;
    const to = open
      ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" // closed (cover full)
      : "polygon(35% 35%, 65% 35%, 65% 65%, 35% 65%)"; // opened (collapsed → grid shows)
    gsap.to(cover.current, {
      clipPath: to,
      duration: 1.1,
      ease: "power4.inOut",
      onComplete: () => (busy.current = false),
    });
    setOpen((o) => !o);
  };

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-ink">
      {/* product grid behind */}
      <div className="absolute inset-0 grid grid-cols-2 gap-2 p-2 md:grid-cols-3">
        {GRID.map((p) => (
          <div key={p.id} className="group relative overflow-hidden bg-surface">
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
            <div className="absolute bottom-0 left-0 flex w-full items-end justify-between gap-2 p-4">
              <div>
                <p className="font-display text-base uppercase leading-none">{p.name}</p>
                <p className="mt-1 font-mono text-[10px] text-acid">
                  {p.salePrice ?? p.price}€
                </p>
              </div>
              <button
                data-cursor="Añadir"
                onClick={() =>
                  add(null, {
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    price: p.salePrice ?? p.price,
                    image: p.image,
                  })
                }
                className="shrink-0 rounded-full bg-cloud px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-ink transition-colors hover:bg-acid"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* cover that clips away */}
      <div
        ref={cover}
        className="absolute inset-0 z-10"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${COVER})` }}
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow mb-4">La colección completa</p>
          <h2 className="font-display text-display-lg uppercase leading-[0.9]">
            Explora
            <br />
            KINETIK
          </h2>
        </div>
      </div>

      {/* toggle button stays above the cover */}
      <button
        onClick={toggle}
        data-cursor={open ? "Cerrar" : "Abrir"}
        className="pill-primary absolute bottom-10 left-1/2 z-20 -translate-x-1/2"
      >
        {open ? "Cerrar ✕" : "Ver la galería ↗"}
      </button>
    </section>
  );
}
