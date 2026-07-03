"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useCart } from "@/components/providers/Cart";

/**
 * Best-sellers carousel — stacked cards (Awwwards Pack "+22 Sliders / 3").
 * Cards stack with a y/z offset; clicking the stack flies the top card down and
 * recycles it to the back while the next card's copy reveals. Each card sells:
 * price + add-to-cart.
 */

const CARDS = [
  { id: "aero-01", img: "/img/editorial/img5.webp", title: "AERO-01", meta: "Carrera / Placa de Carbono", price: 240 },
  { id: "pulse-trail", img: "/img/editorial/img12.webp", title: "PULSE TRAIL", meta: "Todoterreno / Reciclado", price: 210 },
  { id: "ghost-court", img: "/img/editorial/img22.webp", title: "GHOST COURT", meta: "Pista / Herencia", price: 150 },
  { id: "kinetik-fk", img: "/img/editorial/img26.webp", title: "KINETIK FK", meta: "Flyknit / Tempo", price: 195 },
];

export function StackedCards() {
  const root = useRef<HTMLDivElement>(null);
  const { add } = useCart();

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    gsap.registerPlugin(CustomEase);
    if (!CustomEase.get("stackEase"))
      CustomEase.create("stackEase", "0.83, 0, 0.17, 1");

    const slider = section.querySelector<HTMLElement>(".kx-stack");
    if (!slider) return;

    const splitChars = (sel: string) => {
      section.querySelectorAll<HTMLElement>(sel).forEach((el) => {
        el.innerHTML = el.innerText
          .split("")
          .map((c) => `<span>${c === " " ? "&nbsp;" : c}</span>`)
          .join("");
      });
    };

    const positionCards = () => {
      const cards = Array.from(slider.querySelectorAll<HTMLElement>(".kx-card"));
      gsap.to(cards, {
        y: (i) => `${-14 + 14 * i}%`,
        z: (i) => 16 * i,
        duration: 1,
        ease: "stackEase",
        stagger: -0.08,
      });
    };

    splitChars(".kx-card .copy h3");
    splitChars(".kx-card .copy p");
    positionCards();
    gsap.set(".kx-card .copy h3 span", { y: -220 });
    gsap.set(".kx-card .copy p span", { y: 60, opacity: 0 });
    gsap.set(".kx-stack .kx-card:last-child .copy h3 span", { y: 0 });
    gsap.set(".kx-stack .kx-card:last-child .copy p span", { y: 0, opacity: 1 });

    let isAnimating = false;
    const advance = () => {
      if (isAnimating) return;
      isAnimating = true;
      const cards = Array.from(slider.querySelectorAll<HTMLElement>(".kx-card"));
      const last = cards.pop()!;
      const upcoming = cards[cards.length - 1];

      gsap.to(last.querySelectorAll(".copy h3 span"), {
        y: 220,
        duration: 0.7,
        ease: "stackEase",
        stagger: 0.03,
      });
      gsap.to(last.querySelectorAll(".copy p span"), {
        y: 40,
        opacity: 0,
        duration: 0.45,
        ease: "power3.out",
        stagger: 0.015,
      });
      gsap.to(last, {
        y: "+=160%",
        duration: 0.78,
        ease: "stackEase",
        onComplete: () => {
          slider.prepend(last);
          positionCards();
          gsap.set(last.querySelectorAll(".copy h3 span"), { y: -220 });
          gsap.set(last.querySelectorAll(".copy p span"), { y: 60, opacity: 0 });
          setTimeout(() => (isAnimating = false), 420);
        },
      });
      if (upcoming) {
        gsap.to(upcoming.querySelectorAll(".copy h3 span"), {
          y: 0,
          duration: 0.9,
          ease: "stackEase",
          stagger: 0.04,
        });
        gsap.to(upcoming.querySelectorAll(".copy p span"), {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.02,
          delay: 0.12,
        });
      }
    };

    slider.addEventListener("click", advance);
    return () => slider.removeEventListener("click", advance);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-ink py-section">
      <div className="container-x pointer-events-none absolute left-0 top-0 flex w-full flex-col gap-1 px-5 pb-5 pt-20 sm:flex-row sm:items-end sm:justify-between sm:p-8 lg:p-12">
        <h2 className="font-display text-heading-xl uppercase">Lo más vendido</h2>
        <p className="eyebrow">Toca la pila para ver el siguiente</p>
      </div>

      <div
        ref={root}
        className="flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        <div
          className="kx-stack relative h-[60vh] max-h-[560px] w-[78vw] max-w-[420px] cursor-pointer"
          style={{ transformStyle: "preserve-3d" }}
          data-cursor="Siguiente"
        >
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="kx-card absolute inset-0 overflow-hidden rounded-2xl border border-line bg-surface will-change-transform"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${c.img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
              <div className="copy absolute bottom-0 left-0 w-full p-7">
                <h3 className="overflow-hidden font-display text-4xl uppercase leading-none [&_span]:inline-block">
                  {c.title}
                </h3>
                <p className="mt-2 overflow-hidden font-mono text-[11px] uppercase tracking-widest text-cloud-dim [&_span]:inline-block">
                  {c.meta}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-sm">{c.price}€</span>
                  <button
                    data-cursor="Añadir"
                    onClick={(e) => {
                      e.stopPropagation();
                      add(e.currentTarget.closest(".kx-card") as HTMLElement, {
                        id: c.id,
                        name: c.title,
                        category: c.meta,
                        price: c.price,
                        image: c.img,
                      });
                    }}
                    className="rounded-full bg-cloud px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-ink transition-colors hover:bg-acid"
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
