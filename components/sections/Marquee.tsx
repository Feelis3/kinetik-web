"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Velocity-aware scrolling type band — acts as the editorial separator between
 * major sections (in the spirit of SVG Animations / 4's scroll-reactive motion).
 * Scroll speed nudges the marquee direction/velocity for a kinetic feel.
 */
export function Marquee({
  text = "ENGINEERED MOTION",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = track.current;
    if (!el) return;

    const base = gsap.to(el, {
      xPercent: -50,
      repeat: -1,
      duration: 24,
      ease: "none",
    });

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity();
        const skew = gsap.utils.clamp(-30, 30, v / -60);
        gsap.to(el, { skewX: skew, duration: 0.4, ease: "power2.out" });
        base.timeScale(1 + Math.min(Math.abs(v) / 600, 4));
        gsap.to(base, { timeScale: 1, duration: 0.8, overwrite: true });
      },
    });

    return () => {
      base.kill();
      st.kill();
    };
  }, []);

  const item = (
    <span className="flex shrink-0 items-center gap-8 pr-8">
      <span className="font-display text-[8vw] uppercase leading-none text-cloud">
        {text}
      </span>
      <span className="text-cloud-dim text-[5vw] leading-none">/</span>
    </span>
  );

  return (
    <div
      className={`relative overflow-hidden border-y border-line py-6 ${className}`}
      aria-hidden
    >
      <div ref={track} className="flex w-max flex-nowrap will-change-transform">
        {item}
        {item}
        {item}
        {item}
      </div>
    </div>
  );
}
