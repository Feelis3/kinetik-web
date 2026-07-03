"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, type Product } from "@/lib/products";
import { useCart } from "@/components/providers/Cart";
import { FILTER_EVENT } from "@/lib/filterBus";

const FILTERS = ["Todos", "Carrera", "Trail", "Pista", "Lifestyle"];

/**
 * Product card grid — design.md "product-card" discipline (flat card, image on
 * a soft stage, swatch dots, name / subtitle / price, sale signalling) rebuilt
 * for the KINETIK dark system, wired to the fly-to-bag cart (Grid 6).
 */
function Card({ p }: { p: Product }) {
  const imgRef = useRef<HTMLDivElement>(null);
  const { add } = useCart();

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        {p.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full border border-line bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cloud backdrop-blur">
            {p.badge}
          </span>
        )}
        <div ref={imgRef} className="absolute inset-0">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width:640px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
          />
        </div>
        <button
          onClick={() =>
            add(imgRef.current, {
              id: p.id,
              name: p.name,
              category: p.category,
              price: p.salePrice ?? p.price,
              image: p.image,
            })
          }
          data-cursor="Añadir"
          className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-acid px-6 py-2.5 font-mono text-[11px] uppercase tracking-widest text-ink transition-all duration-300 ease-expo md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          Añadir
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex gap-1.5">
          {p.swatches.map((s) => (
            <span
              key={s}
              className="h-3 w-3 rounded-full ring-1 ring-line"
              style={{ background: s }}
            />
          ))}
        </div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg uppercase leading-none">
              {p.name}
            </h3>
            <p className="mt-1 text-xs text-mute">{p.category}</p>
          </div>
          <div className="text-right">
            {p.salePrice ? (
              <div className="flex flex-col items-end">
                <span className="font-mono text-sm text-sale">
                  {p.salePrice}€
                </span>
                <span className="font-mono text-[11px] text-mute line-through">
                  {p.price}€
                </span>
              </div>
            ) : (
              <span className="font-mono text-sm">{p.price}€</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid() {
  const [filter, setFilter] = useState("Todos");
  const grid = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  const shown = useMemo(
    () =>
      filter === "Todos"
        ? products
        : products.filter((p) => p.division === filter),
    [filter]
  );

  // let category sections set the filter
  useEffect(() => {
    const onFilter = (e: Event) => {
      const d = (e as CustomEvent<string>).detail;
      setFilter(FILTERS.includes(d) ? d : "Todos");
    };
    window.addEventListener(FILTER_EVENT, onFilter);
    return () => window.removeEventListener(FILTER_EVENT, onFilter);
  }, []);

  // Stagger the cards in — on first scroll into view, and again on every filter
  // change (the grid re-flows with the same reveal the pack grids use).
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = grid.current;
    if (!el) return;
    const cards = el.querySelectorAll(".kx-pg-card");
    const reveal = () =>
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 30, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" }
      );

    if (first.current) {
      first.current = false;
      gsap.set(cards, { autoAlpha: 0 });
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: reveal,
      });
      return () => st.kill();
    }
    const t = reveal();
    return () => t.kill();
  }, [filter]);

  return (
    <section id="rotation" className="bg-ink py-section">
      <div className="container-x">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <h2 className="font-display text-heading-xl uppercase">
            En rotación ahora
          </h2>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                data-cursor="Filtrar"
                className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                  filter === f
                    ? "border-acid bg-acid text-ink"
                    : "border-line text-cloud-dim hover:border-cloud-dim"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={grid}
          className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4"
        >
          {shown.map((p) => (
            <div key={p.id} className="kx-pg-card">
              <Card p={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
