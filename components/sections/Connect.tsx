"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

/** Membership / newsletter CTA — the "Join Signal" moment before the footer. */
export function Connect() {
  return (
    <section id="connect" className="relative overflow-hidden py-section">
      <div className="absolute inset-0 -z-0">
        <Image
          src="/img/editorial/img24.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      </div>

      <div className="container-x relative z-10 text-center">
        <Reveal>
          <p className="eyebrow mb-6">[ 05 ] — Membresía</p>
          <h2 className="mx-auto max-w-4xl font-display text-display-lg uppercase leading-[0.9]">
            Únete a la
            <span className="text-acid"> señal</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-cloud-dim">
            Acceso anticipado a lanzamientos, colorways solo para socios y los
            datos detrás de cada modelo. Sin ruido — solo movimiento.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-10 flex max-w-md items-center gap-2 rounded-full border border-line bg-ink-soft p-2 focus-within:border-acid"
          >
            <input
              type="email"
              required
              placeholder="tu@email.com"
              className="flex-1 bg-transparent px-4 py-2 text-sm text-cloud outline-none placeholder:text-mute"
            />
            <button type="submit" className="pill-primary !py-2.5">
              Únete
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
