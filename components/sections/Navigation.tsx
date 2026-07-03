"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { usePageTransition } from "@/components/providers/PageTransition";

/**
 * Fullscreen navigation — ported from Awwwards Pack
 * "+21 Navigation Menus / 6". The page content rotates/scales away while a
 * clip-path overlay sweeps in with staggered links and a hover image preview.
 * Adapted: scroll is locked while open, and links wipe to in-page sections
 * via the shared cover transition.
 */

const LINKS = [
  { label: "Colecciones", target: "collections", img: "/img/editorial/img2.webp" },
  { label: "Destacados", target: "featured", img: "/img/editorial/img11.webp" },
  { label: "Categorías", target: "categories", img: "/img/editorial/img21.webp" },
  { label: "Conecta", target: "connect", img: "/img/editorial/img30.webp" },
];

const SOCIALS = ["Instagram", "TikTok", "YouTube", "Strava"];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const animating = useRef(false);
  const overlay = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const previewImg = useRef<HTMLDivElement>(null);
  const openLabel = useRef<HTMLParagraphElement>(null);
  const closeLabel = useRef<HTMLParagraphElement>(null);
  const { lenis } = useSmoothScroll();
  const { transition } = usePageTransition();

  const pageEl = () =>
    document.getElementById("page-content") as HTMLElement | null;

  const toggleLabels = (opening: boolean) => {
    gsap.to(opening ? openLabel.current : closeLabel.current, {
      y: opening ? -10 : 10,
      rotation: opening ? -5 : 5,
      opacity: 0,
      delay: 0.25,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(opening ? closeLabel.current : openLabel.current, {
      y: 0,
      rotation: 0,
      opacity: 1,
      delay: 0.5,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const openMenu = () => {
    if (animating.current || open) return;
    animating.current = true;
    lenis?.stop();

    gsap.to(pageEl(), {
      rotation: 8,
      x: 220,
      y: 320,
      scale: 1.4,
      duration: 1.25,
      ease: "power4.inOut",
    });
    toggleLabels(true);
    gsap.to(content.current, {
      rotation: 0,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 1.25,
      ease: "power4.inOut",
    });
    gsap.to([".kx-link button", ".kx-social a"], {
      y: "0%",
      opacity: 1,
      delay: 0.75,
      duration: 1,
      stagger: 0.08,
      ease: "power3.out",
    });
    gsap.to(overlay.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
      duration: 1.25,
      ease: "power4.inOut",
      onComplete: () => {
        setOpen(true);
        animating.current = false;
      },
    });
  };

  const closeMenu = (onClosed?: () => void) => {
    if (animating.current || !open) return;
    animating.current = true;

    gsap.to(pageEl(), {
      rotation: 0,
      x: 0,
      y: 0,
      scale: 1,
      duration: 1.25,
      ease: "power4.inOut",
    });
    toggleLabels(false);
    gsap.to(content.current, {
      rotation: -15,
      x: -100,
      y: -100,
      scale: 1.5,
      opacity: 0.25,
      duration: 1.25,
      ease: "power4.inOut",
    });
    gsap.to(overlay.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.25,
      ease: "power4.inOut",
      onComplete: () => {
        setOpen(false);
        animating.current = false;
        gsap.set([".kx-link button", ".kx-social a"], { y: "120%", opacity: 0.25 });
        // A transform left on #page-content (even identity) makes it the
        // containing block for position:fixed, which breaks ScrollTrigger's
        // pinned hero — the 3D shoe then freezes on scroll. Remove it and
        // recompute the pins so the hero animates again.
        const page = pageEl();
        if (page) gsap.set(page, { clearProps: "transform" });
        ScrollTrigger.refresh();
        lenis?.start();
        onClosed?.();
      },
    });
  };

  const onLinkClick = (target: string) => {
    if (animating.current) return;
    // close menu instantly-ish then wipe to the section
    closeMenu(() => {
      transition(() => {
        const node = document.getElementById(target);
        if (node) lenis?.scrollTo(node, { immediate: true, offset: 0 });
      });
    });
  };

  const onLinkHover = (img: string) => {
    if (!open || animating.current || !previewImg.current) return;
    const imgs = previewImg.current.querySelectorAll("img");
    const last = imgs[imgs.length - 1];
    if (last && last.getAttribute("src") === img) return;

    const el = document.createElement("img");
    el.src = img;
    el.alt = "";
    el.className = "absolute inset-0 h-full w-full object-cover";
    el.style.opacity = "0";
    el.style.transform = "scale(1.25) rotate(8deg)";
    previewImg.current.appendChild(el);

    // keep only the last 3
    const all = previewImg.current.querySelectorAll("img");
    if (all.length > 3)
      for (let i = 0; i < all.length - 3; i++) all[i].remove();

    gsap.to(el, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.75,
      ease: "power2.out",
    });
  };

  // ensure correct initial transforms
  useEffect(() => {
    gsap.set([".kx-link button", ".kx-social a"], { y: "120%", opacity: 0.25 });
    gsap.set(content.current, {
      opacity: 0.25,
      x: -100,
      y: -100,
      scale: 1.5,
      rotation: -15,
    });
  }, []);

  return (
    <>
      {/* top scrim so the fixed nav doesn't collide with content on mobile */}
      <div className="pointer-events-none fixed left-0 top-0 z-[54] h-20 w-full bg-gradient-to-b from-ink via-ink/70 to-transparent md:hidden" />
      <nav className="fixed left-0 top-0 z-[60] flex w-screen items-center justify-between px-5 py-6 sm:px-8 lg:px-10 mix-blend-difference">
        <a
          href="#top"
          className="font-display text-2xl uppercase tracking-tight text-cloud"
        >
          KINETIK
        </a>
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => (open ? closeMenu() : openMenu())}
          className="relative h-6 w-16 cursor-pointer font-mono text-sm uppercase tracking-widest text-cloud"
        >
          <span ref={openLabel} className="absolute right-0 top-0">
            Menú
          </span>
          <span
            ref={closeLabel}
            className="absolute right-0 top-0 opacity-0"
          >
            Cerrar
          </span>
        </button>
      </nav>

      <div
        ref={overlay}
        className="fixed left-0 top-0 z-[55] h-screen w-screen bg-ink-soft"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
      >
        <div
          ref={content}
          className="flex h-full w-full origin-bottom-left items-center justify-center"
        >
          <div className="relative h-full w-full">
            <div className="flex h-full w-full flex-col justify-center gap-10 p-8 sm:p-12 md:flex-row md:items-center md:gap-12">
              {/* preview image */}
              <div className="hidden flex-[3] items-center justify-center md:flex">
                <div
                  ref={previewImg}
                  className="relative h-[70vh] w-[45%] overflow-hidden bg-surface"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/img/editorial/img2.webp"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* links + socials */}
              <div className="flex flex-[2] flex-col justify-center gap-12 py-8">
                <div className="flex flex-col gap-1">
                  {LINKS.map((l) => (
                    <div
                      key={l.label}
                      className="kx-link overflow-hidden pb-1"
                      style={{ clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)" }}
                    >
                      <button
                        onClick={() => onLinkClick(l.target)}
                        onMouseEnter={() => onLinkHover(l.img)}
                        className="inline-block translate-y-[120%] font-display text-5xl uppercase leading-none text-cloud opacity-25 transition-colors hover:text-acid sm:text-6xl md:text-7xl"
                      >
                        {l.label}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {SOCIALS.map((s) => (
                    <div key={s} className="kx-social overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                      <a
                        href="#"
                        className="inline-block translate-y-[120%] text-sm text-mute opacity-25 transition-colors hover:text-cloud"
                      >
                        {s}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-8 sm:p-12">
              <span className="font-mono text-xs uppercase tracking-widest text-mute">
                Movimiento Diseñado © {new Date().getFullYear()}
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-mute">
                Únete a la Señal
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
