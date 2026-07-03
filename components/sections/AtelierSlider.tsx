"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { products } from "@/lib/products";
import { useCart } from "@/components/providers/Cart";

/**
 * Product slider — distilled from Awwwards Pack "+22 Sliders / 2" (Atelier Nova).
 * The active slide fills the stage with a char-split title; a small preview of
 * the next product sits in the corner and, on click/advance, clip-expands to
 * fullscreen while the titles swap character by character.
 */
const SLIDES = products.slice(0, 5).map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.salePrice ?? p.price,
  image: p.image,
}));

const FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
const SEED = "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)";

export function AtelierSlider() {
  const [active, setActive] = useState(0);
  const animating = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const nextImg = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { add } = useCart();

  const next = (active + 1) % SLIDES.length;

  // reset the corner preview clip each time the active slide changes
  useEffect(() => {
    if (!nextImg.current) return;
    gsap.fromTo(
      nextImg.current,
      { clipPath: SEED },
      { clipPath: FULL, duration: 0.7, ease: "power3.out" }
    );
    // char reveal on the active title
    const chars = titleRef.current?.querySelectorAll(".kx-ch > span");
    if (chars)
      gsap.fromTo(
        chars,
        { yPercent: 120 },
        { yPercent: 0, duration: 0.7, stagger: 0.03, ease: "power3.out" }
      );
  }, [active]);

  const advance = () => {
    if (animating.current) return;
    animating.current = true;
    const overlay = nextImg.current;
    if (!overlay) {
      setActive(next);
      animating.current = false;
      return;
    }
    // grow the corner preview to fullscreen, then commit
    gsap
      .timeline({
        onComplete: () => {
          setActive(next);
          animating.current = false;
        },
      })
      .to(overlay, {
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        duration: 0.8,
        ease: "power4.inOut",
      });
  };

  const s = SLIDES[active];
  const n = SLIDES[next];

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-ink">
      <div
        ref={stage}
        onClick={advance}
        data-cursor="Siguiente"
        className="absolute inset-0 cursor-pointer"
      >
        {/* active image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${s.image})` }}
        />
        <div className="absolute inset-0 bg-ink/45" />

        {/* corner preview of the next slide (grows on advance) */}
        <div
          ref={nextImg}
          key={active}
          className="absolute bottom-8 right-8 z-10 h-[280px] w-[200px] overflow-hidden md:h-[350px] md:w-[250px]"
          style={{ clipPath: FULL }}
        >
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${n.image})` }}
          />
        </div>
      </div>

      {/* meta */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 flex w-full items-start justify-between p-5 pt-24 sm:p-8 lg:p-12">
        <p className="eyebrow">Destacados — {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}</p>
        <p className="eyebrow hidden sm:block">Toca para el siguiente</p>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full p-5 sm:p-8 lg:p-12">
        <h2
          ref={titleRef}
          key={s.name}
          className="font-display text-display-lg uppercase leading-[0.9]"
        >
          {s.name.split("").map((c, i) => (
            <span key={i} className="kx-ch inline-block overflow-hidden align-bottom">
              <span className="inline-block">{c === " " ? " " : c}</span>
            </span>
          ))}
        </h2>
        <div className="pointer-events-auto mt-5 flex flex-wrap items-center gap-5">
          <span className="font-mono text-sm text-cloud-dim">
            {s.category} · {s.price}€
          </span>
          <button
            data-cursor="Añadir"
            onClick={(e) => {
              e.stopPropagation();
              add(e.currentTarget, s);
            }}
            className="pill-primary"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </section>
  );
}
