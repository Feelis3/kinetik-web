"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type LenisCtx = { lenis: Lenis | null };
const Ctx = createContext<LenisCtx>({ lenis: null });
export const useSmoothScroll = () => useContext(Ctx);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    gsap.registerPlugin(ScrollTrigger);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) document.documentElement.classList.add("reduce-motion");

    const instance = new Lenis({
      // smoother, less "stepped" feel: more inertia + gentler wheel steps
      lerp: 0.075,
      smoothWheel: !reduce,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      syncTouch: true,
    });

    instance.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);
    // expose for debugging / automated visual checks
    (window as unknown as { __lenis?: Lenis }).__lenis = instance;

    // Pins depend on final layout — recompute once fonts, images and the
    // 3D model have settled, otherwise pin spacers can collapse on first paint.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    const t1 = setTimeout(refresh, 800);
    const t2 = setTimeout(refresh, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      instance.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <Ctx.Provider value={{ lenis }}>{children}</Ctx.Provider>;
}
