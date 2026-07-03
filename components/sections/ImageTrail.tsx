"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Image trail — essence of Awwwards Pack "+19 Mouse Effect / 5". Moving the
 * pointer across this band leaves a trail of editorial images that fade in at
 * the cursor and drift away. Scoped to the section so it never fires globally.
 */
const IMAGES = [
  "/img/editorial/img1.webp",
  "/img/editorial/img6.webp",
  "/img/editorial/img10.webp",
  "/img/editorial/img13.webp",
  "/img/editorial/img17.webp",
  "/img/editorial/img20.webp",
  "/img/editorial/img25.webp",
  "/img/editorial/img29.webp",
  "/img/editorial/img31.webp",
];

export function ImageTrail() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (
      window.matchMedia("(hover: none)").matches ||
      document.documentElement.classList.contains("reduce-motion")
    )
      return;

    let i = 0;
    let last = { x: 0, y: 0 };
    let primed = false;
    const threshold = 85;

    const spawn = (x: number, y: number) => {
      const img = document.createElement("div");
      img.className =
        "pointer-events-none absolute z-0 h-[clamp(140px,18vw,260px)] w-[clamp(110px,14vw,200px)] bg-cover bg-center will-change-transform";
      img.style.backgroundImage = `url(${IMAGES[i % IMAGES.length]})`;
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      img.style.transform = "translate(-50%, -50%)";
      el.appendChild(img);
      i++;

      gsap
        .timeline({ onComplete: () => img.remove() })
        .fromTo(
          img,
          {
            scale: 0.4,
            opacity: 0,
            rotation: gsap.utils.random(-12, 12),
            clipPath: "inset(100% 0% 0% 0%)",
          },
          {
            scale: 1,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.5,
            ease: "power3.out",
          }
        )
        .to(
          img,
          {
            opacity: 0,
            scale: 0.85,
            yPercent: 25,
            duration: 0.7,
            ease: "power2.in",
          },
          "+=0.15"
        );
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!primed) {
        primed = true;
        last = { x, y };
        return;
      }
      if (Math.hypot(x - last.x, y - last.y) < threshold) return;
      last = { x, y };
      spawn(x, y);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[80svh] items-center justify-center overflow-hidden border-y border-line bg-ink"
    >
      <div className="relative z-10 flex flex-col items-center px-6 text-center mix-blend-difference">
        <p className="eyebrow mb-4">Nueva colección</p>
        <h2 className="font-display text-display-lg uppercase leading-[0.9]">
          SS26
          <br />
          ya disponible
        </h2>
      </div>
      <a
        href="#rotation"
        data-cursor="Comprar"
        className="pill-primary absolute bottom-12 left-1/2 z-20 -translate-x-1/2"
      >
        Comprar ahora
      </a>
    </section>
  );
}
