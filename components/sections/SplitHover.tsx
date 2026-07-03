"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/providers/Cart";

/**
 * Split-image hover — ported from Awwwards Pack "+24 Hover Effects / 1".
 * Two panels share a row; moving the pointer reveals/expands the panel you head
 * toward (66/33 ↔ 33/66) with an eased rAF lerp. Each panel sells a look.
 */
const LOOKS = [
  {
    id: "aero-01",
    img: "/img/editorial/img6.webp",
    name: "AERO-01",
    tag: "Carrera / Carbono",
    price: 240,
    image: "/img/sneakers/sneaker-1.jpg",
  },
  {
    id: "ghost-court",
    img: "/img/editorial/img17.webp",
    name: "GHOST COURT",
    tag: "Pista / Herencia",
    price: 150,
    image: "/img/sneakers/sneaker-6.jpg",
  },
];

export function SplitHover() {
  const root = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const { add } = useCart();

  useEffect(() => {
    const section = root.current;
    if (!section || !a.current || !b.current) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let target = 50;
    let current = 50;
    const speed = 0.12;

    const tick = () => {
      current += (target - current) * speed;
      const first = 66.66 - current * 0.3333;
      a.current!.style.width = `${first}%`;
      b.current!.style.width = `${100 - first}%`;
      if (Math.abs(target - current) < 0.1) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      target = ((e.clientX - r.left) / r.width) * 100;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    section.addEventListener("pointermove", onMove);
    return () => {
      section.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="bg-ink py-section">
      <div className="container-x mb-10 flex items-end justify-between border-b border-line pb-6">
        <h2 className="font-display text-heading-xl uppercase">Cara a cara</h2>
        <p className="eyebrow">Elige tu lado</p>
      </div>

      <div
        ref={root}
        className="flex h-[64svh] w-full flex-col gap-2 px-5 sm:flex-row sm:px-8 lg:px-12"
      >
        {[LOOKS[0], LOOKS[1]].map((l, i) => (
          <div
            key={l.id}
            ref={i === 0 ? a : b}
            className="group relative h-1/2 w-full overflow-hidden bg-surface sm:h-full"
            style={{ width: undefined }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center grayscale transition-[filter] duration-500 group-hover:grayscale-0"
              style={{ backgroundImage: `url(${l.img})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 flex w-full items-end justify-between gap-4 p-6">
              <div>
                <h3 className="font-display text-3xl uppercase leading-none lg:text-4xl">
                  {l.name}
                </h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-cloud-dim">
                  {l.tag} · {l.price}€
                </p>
              </div>
              <button
                data-cursor="Añadir"
                onClick={(e) =>
                  add(e.currentTarget, {
                    id: l.id,
                    name: l.name,
                    category: l.tag,
                    price: l.price,
                    image: l.image,
                  })
                }
                className="shrink-0 rounded-full bg-cloud px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-ink transition-colors hover:bg-acid"
              >
                + Añadir
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
