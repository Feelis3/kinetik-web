"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/ui/Reveal";
import { useCart } from "@/components/providers/Cart";

/**
 * Showcase / storytelling.
 *  - "Living Words" (3D Animation / 16): a pinned statement whose words light up
 *    word-by-word as you scrub through.
 *  - Holographic card (3D Animation / 5, "shoe finder" HoloCardMaterial): a
 *    mouse-tilted product card with a moving holographic sheen.
 */

const STATEMENT =
  "No medimos las zapatillas en gramos. Las medimos en los milisegundos que te devuelven.";

export function Showcase() {
  const words = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);
  const { add } = useCart();

  // living words
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = words.current;
    if (!el) return;
    const spans = el.querySelectorAll<HTMLElement>("span.kx-word");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        spans,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  // holographic tilt
  useEffect(() => {
    const c = card.current;
    const s = sheen.current;
    if (!c || !s) return;
    if (document.documentElement.classList.contains("reduce-motion")) return;

    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      gsap.to(c, {
        rotationY: (px - 0.5) * 18,
        rotationX: -(py - 0.5) * 18,
        transformPerspective: 900,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(s, {
        backgroundPosition: `${px * 100}% ${py * 100}%`,
        opacity: 0.9,
        duration: 0.4,
      });
    };
    const reset = () => {
      gsap.to(c, { rotationX: 0, rotationY: 0, duration: 0.8, ease: "power3.out" });
      gsap.to(s, { opacity: 0.35, duration: 0.6 });
    };
    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerleave", reset);
    return () => {
      c.removeEventListener("pointermove", onMove);
      c.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <section id="philosophy" className="bg-ink py-section">
      {/* living words */}
      <div ref={words} className="container-x">
        <p className="eyebrow mb-10">Producto destacado</p>
        <p className="max-w-5xl font-display text-[clamp(2rem,6vw,5rem)] uppercase leading-[1.02]">
          {STATEMENT.split(" ").map((w, i) => (
            <span key={i} className="kx-word inline-block">
              {w}&nbsp;
            </span>
          ))}
        </p>
      </div>

      {/* holographic card */}
      <div className="container-x mt-section grid items-center gap-12 lg:grid-cols-2">
        <div className="flex justify-center [perspective:1000px]">
          <div
            ref={card}
            className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface will-change-transform"
          >
            <Image
              src="/img/sneakers/sneaker-5.jpg"
              alt="AERO-01 holographic"
              fill
              sizes="40vw"
              className="object-cover"
            />
            <div
              ref={sheen}
              className="pointer-events-none absolute inset-0 opacity-35 mix-blend-color-dodge"
              style={{
                backgroundImage:
                  "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.55) 42%, rgba(168,168,173,0.35) 50%, rgba(255,255,255,0.55) 58%, transparent 80%)",
                backgroundSize: "220% 220%",
              }}
            />
            <div className="absolute bottom-4 left-4 font-mono text-xs uppercase tracking-widest text-cloud">
              AERO-01 / Edición Holo
            </div>
          </div>
        </div>

        <Reveal>
          <p className="eyebrow mb-4">Ciencia de Materiales</p>
          <h2 className="font-display text-display-lg uppercase leading-[0.9]">
            Diseñada
            <br />
            al gramo
          </h2>
          <p className="mt-6 max-w-md text-cloud-dim">
            Placa de carbono forjado, espuma supercrítica y upper de punto
            reciclado: afinados en el laboratorio y validados en pista. Inclina
            la tarjeta para inspeccionar el colorway bajo la luz.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
            {[
              ["84%", "Retorno de energía"],
              ["198g", "Por zapatilla (US 9)"],
              ["100%", "Punto reciclado"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-3xl text-cloud">{n}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-mute">
                  {l}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <button
              data-cursor="Añadir"
              onClick={() =>
                add(card.current, {
                  id: "aero-01",
                  name: "AERO-01",
                  category: "Carrera / Placa de Carbono",
                  price: 240,
                  image: "/img/sneakers/sneaker-5.jpg",
                })
              }
              className="pill-primary"
            >
              Añadir al carrito — 240€
            </button>
            <a href="#rotation" className="pill-ghost" data-cursor="Ver">
              Ver ficha
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
