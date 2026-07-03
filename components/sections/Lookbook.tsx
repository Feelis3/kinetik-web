"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useCart } from "@/components/providers/Cart";

/**
 * Lookbook — faithful port of Awwwards Pack "+10 Grid Animations / 5"
 * (Repeating Image Transition). Clicking a grid item spawns a chain of "mover"
 * clones that step from the thumbnail to a fullscreen panel via clip-path,
 * creating the signature repeating-image trail, then reveals a detail panel.
 */

const ITEMS = [
  { id: "aero-01", img: "/img/editorial/img4.webp", title: "Velocidad", desc: "División Carrera — SS26", price: 240 },
  { id: "pulse-trail", img: "/img/editorial/img9.webp", title: "Terreno", desc: "Lab de Trail — Todoterreno", price: 210 },
  { id: "ghost-court", img: "/img/editorial/img14.webp", title: "Herencia", desc: "Pista / Archivo", price: 150 },
  { id: "drift-x", img: "/img/editorial/img19.webp", title: "Descanso", desc: "Estudio — Día de Reposo", price: 110 },
  { id: "kinetik-fk", img: "/img/editorial/img23.webp", title: "Tempo", desc: "Flyknit — Carrera Diaria", price: 195 },
  { id: "strata-low", img: "/img/editorial/img28.webp", title: "Señal", desc: "Exclusivo Socios", price: 160 },
];

const CP = {
  from: "inset(100% 0% 0% 0%)",
  reveal: "inset(0% 0% 0% 0%)",
  hide: "inset(0% 0% 100% 0%)",
};
const cfg = {
  steps: 6,
  stepDuration: 0.35,
  stepInterval: 0.05,
  moverPauseBeforeExit: 0.14,
  clickedItemDurationFactor: 2,
  gridItemStaggerFactor: 0.3,
  panelRevealDurationFactor: 2,
};

export function Lookbook() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const panelImg = useRef<HTMLDivElement>(null);
  const panelContent = useRef<HTMLDivElement>(null);
  const panelTitle = useRef<HTMLHeadingElement>(null);
  const panelDesc = useRef<HTMLParagraphElement>(null);
  const panelPrice = useRef<HTMLParagraphElement>(null);
  const { add } = useCart();
  const current = useRef<{
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
  } | null>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const grid = section.querySelector<HTMLElement>(".kx-lb-grid");
    if (!grid || !panel.current || !panelImg.current) return;

    let isAnimating = false;
    let isOpen = false;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const center = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };

    const staggerDelays = (clicked: Element, items: Element[]) => {
      const base = center(clicked);
      const d = items.map((el) => {
        const c = center(el);
        return Math.hypot(c.x - base.x, c.y - base.y);
      });
      const max = Math.max(...d) || 1;
      return d.map((v) => (v / max) * cfg.gridItemStaggerFactor);
    };

    const motionPath = (s: DOMRect, e: DOMRect, steps: number) => {
      const full = steps + 2;
      const sc = { x: s.left + s.width / 2, y: s.top + s.height / 2 };
      const ec = { x: e.left + e.width / 2, y: e.top + e.height / 2 };
      const path: { left: number; top: number; width: number; height: number }[] = [];
      for (let i = 0; i < full; i++) {
        const t = i / (full - 1);
        const width = lerp(s.width, e.width, t);
        const height = lerp(s.height, e.height, t);
        const cx = lerp(sc.x, ec.x, t);
        const cy = lerp(sc.y, ec.y, t);
        path.push({ left: cx - width / 2, top: cy - height / 2, width, height });
      }
      return path.slice(1, -1);
    };

    const onClick = (item: HTMLElement) => {
      if (isAnimating || isOpen) return;
      isAnimating = true;

      const imageEl = item.querySelector<HTMLElement>(".kx-lb-img")!;
      const imgURL = imageEl.style.backgroundImage;
      const title = item.querySelector("h3")?.textContent ?? "";
      const desc = item.querySelector("p")?.textContent ?? "";

      panelImg.current!.style.backgroundImage = imgURL;
      if (panelTitle.current) panelTitle.current.textContent = title;
      if (panelDesc.current) panelDesc.current.textContent = desc;

      const price = Number(item.dataset.price ?? 0);
      current.current = {
        id: item.dataset.id ?? "lookbook",
        name: title,
        category: desc,
        price,
        image: item.dataset.img ?? "",
      };
      if (panelPrice.current) panelPrice.current.textContent = `${price}€`;

      const items = Array.from(
        grid.querySelectorAll<HTMLElement>(".kx-lb-item")
      );
      const delays = staggerDelays(item, items);

      gsap.to(items, {
        opacity: 0,
        scale: (i: number, el: Element) => (el === item ? 1 : 0.8),
        duration: (i: number, el: Element) =>
          el === item ? cfg.stepDuration * cfg.clickedItemDurationFactor : 0.3,
        ease: "sine",
        clipPath: (i: number, el: Element) => (el === item ? CP.from : "none"),
        delay: (i: number) => delays[i],
      });

      // movers
      const startRect = imageEl.getBoundingClientRect();
      const endRect = panelImg.current!.getBoundingClientRect();
      const path = motionPath(startRect, endRect, cfg.steps);
      const movers: HTMLDivElement[] = [];
      path.forEach((step, index) => {
        const mover = document.createElement("div");
        mover.className =
          "fixed bg-cover bg-center pointer-events-none will-change-transform";
        gsap.set(mover, {
          backgroundImage: imgURL,
          left: step.left,
          top: step.top,
          width: step.width,
          height: step.height,
          clipPath: CP.from,
          zIndex: 200 + index,
        });
        document.body.appendChild(mover);
        movers.push(mover);
        gsap
          .timeline({ delay: index * cfg.stepInterval })
          .fromTo(
            mover,
            { opacity: 0.4, clipPath: CP.hide },
            {
              opacity: 1,
              clipPath: CP.reveal,
              duration: cfg.stepDuration,
              ease: "sine.in",
            }
          )
          .to(
            mover,
            { clipPath: CP.from, duration: cfg.stepDuration, ease: "sine" },
            `+=${cfg.moverPauseBeforeExit}`
          );
      });

      const cleanup =
        cfg.steps * cfg.stepInterval + cfg.stepDuration * 2 + cfg.moverPauseBeforeExit;
      gsap.delayedCall(cleanup, () => movers.forEach((m) => m.remove()));

      // reveal panel
      gsap.set(panelContent.current, { opacity: 0 });
      gsap.set(panel.current, { opacity: 1, pointerEvents: "auto" });
      gsap
        .timeline({
          defaults: {
            duration: cfg.stepDuration * cfg.panelRevealDurationFactor,
            ease: "sine.inOut",
          },
        })
        .fromTo(
          panelImg.current,
          { clipPath: CP.hide },
          { clipPath: CP.reveal, delay: cfg.steps * cfg.stepInterval }
        )
        .fromTo(
          panelContent.current,
          { y: 25 },
          {
            duration: 1,
            ease: "expo",
            opacity: 1,
            y: 0,
            delay: cfg.steps * cfg.stepInterval,
            onComplete: () => {
              isAnimating = false;
              isOpen = true;
            },
          },
          "<-=.2"
        );
    };

    const reset = () => {
      if (isAnimating) return;
      isAnimating = true;
      const items = Array.from(
        grid.querySelectorAll<HTMLElement>(".kx-lb-item")
      );
      gsap
        .timeline({
          defaults: { duration: cfg.stepDuration, ease: "expo" },
          onComplete: () => {
            isAnimating = false;
            isOpen = false;
          },
        })
        .to(panel.current, { opacity: 0 })
        .set(panel.current, { pointerEvents: "none" })
        .set(panelImg.current, { clipPath: CP.hide })
        .set(items, { clipPath: "none", opacity: 0, scale: 0.8 }, 0)
        .to(items, { opacity: 1, scale: 1, stagger: 0.03 }, ">");
    };

    const items = Array.from(grid.querySelectorAll<HTMLElement>(".kx-lb-item"));
    const handlers = items.map((it) => {
      const h = () => onClick(it);
      it.addEventListener("click", h);
      return h;
    });
    const closeBtn = panel.current.querySelector(".kx-lb-close");
    const onClose = (e: Event) => {
      e.preventDefault();
      reset();
    };
    closeBtn?.addEventListener("click", onClose);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isAnimating) reset();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      items.forEach((it, i) => it.removeEventListener("click", handlers[i]));
      closeBtn?.removeEventListener("click", onClose);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <section id="lookbook" ref={root} className="bg-ink py-section">
      <div className="container-x">
        <div className="mb-12 flex items-end justify-between border-b border-line pb-6">
          <h2 className="font-display text-heading-xl uppercase">Lookbook</h2>
          <p className="eyebrow">Toca para comprar el look</p>
        </div>

        <div className="kx-lb-grid grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3">
          {ITEMS.map((it) => (
            <figure
              key={it.title}
              data-id={it.id}
              data-price={it.price}
              data-img={it.img}
              className="kx-lb-item m-0 cursor-pointer"
              data-cursor="Ver"
            >
              <div
                className="kx-lb-img aspect-[4/5] w-full bg-cover bg-center transition-opacity duration-150 hover:opacity-70"
                style={{ backgroundImage: `url(${it.img})` }}
              />
              <figcaption className="mt-3 flex items-baseline justify-between">
                <h3 className="font-display text-lg uppercase">{it.title}</h3>
                <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
                  {it.desc}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* fullscreen panel */}
      <div
        ref={panel}
        className="pointer-events-none fixed inset-0 z-[150] grid grid-cols-1 gap-8 bg-ink p-6 opacity-0 md:grid-cols-[var(--w,40vw)_1fr] md:p-12"
        style={{ ["--w" as string]: "42vw" }}
      >
        <div
          ref={panelImg}
          className="h-full w-full bg-cover bg-center"
          style={{ clipPath: CP.hide }}
        />
        <div
          ref={panelContent}
          className="flex flex-col justify-center opacity-0"
        >
          <h3
            ref={panelTitle}
            className="font-display text-display-lg uppercase leading-[0.9]"
          />
          <p ref={panelDesc} className="mt-4 max-w-md text-cloud-dim" />
          <p ref={panelPrice} className="mt-6 font-mono text-lg text-acid" />
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              data-cursor="Añadir"
              onClick={() =>
                current.current && add(panelImg.current, current.current)
              }
              className="pill-primary w-fit"
            >
              Añadir al carrito
            </button>
            <button
              className="kx-lb-close pill-ghost w-fit"
              data-cursor="Cerrar"
            >
              ← Cerrar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
