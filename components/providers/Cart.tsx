"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { gsap } from "gsap";

/**
 * Cart with a fly-to-bag micro animation (distilled from Grid Animations / 6,
 * "Shopping Cart Animation") plus a sliding drawer that lists items, quantities
 * and a subtotal. Drawer + item stagger animated with GSAP.
 */

export type CartItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  qty: number;
};

type AddInput = Omit<CartItem, "qty">;

type Ctx = {
  items: CartItem[];
  count: number;
  total: number;
  add: (originEl: HTMLElement | null, product: AddInput) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  open: () => void;
};
const CartCtx = createContext<Ctx>({
  items: [],
  count: 0,
  total: 0,
  add: () => {},
  remove: () => {},
  setQty: () => {},
  open: () => {},
});
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const bag = useRef<HTMLButtonElement>(null);
  const countEl = useRef<HTMLSpanElement>(null);
  const prevCount = useRef(0);
  const panel = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + i.qty * i.price, 0);

  // Grid Animations / 6 signature: the cart count badge pops in with an elastic
  // bounce (and the bag nudges) every time something is added.
  useEffect(() => {
    if (count > prevCount.current) {
      gsap.fromTo(
        countEl.current,
        { scale: 0 },
        { scale: 1, duration: 0.8, ease: "elastic.out(1.3, 0.9)" }
      );
      gsap.fromTo(
        bag.current,
        { scale: 1.16 },
        { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }
      );
    }
    prevCount.current = count;
  }, [count]);

  const add = useCallback(
    (originEl: HTMLElement | null, product: AddInput) => {
      const commit = () =>
        setItems((prev) => {
          const found = prev.find((p) => p.id === product.id);
          if (found)
            return prev.map((p) =>
              p.id === product.id ? { ...p, qty: p.qty + 1 } : p
            );
          return [...prev, { ...product, qty: 1 }];
        });

      const bagEl = bag.current;
      if (!originEl || !bagEl) {
        commit();
        return;
      }
      const from = originEl.getBoundingClientRect();
      const to = bagEl.getBoundingClientRect();
      // Small, consistent flyer (capped) — never the full-bleed source size.
      const size = Math.max(56, Math.min(84, from.width, from.height)) || 80;
      const cx = from.left + from.width / 2;
      const cy = from.top + from.height / 2;
      const flyer = document.createElement("div");
      flyer.style.cssText = `position:fixed;left:${cx - size / 2}px;top:${cy - size / 2}px;width:${size}px;height:${size}px;background-image:url(${product.image});background-size:cover;background-position:center;border-radius:10px;z-index:9000;pointer-events:none;will-change:transform,opacity;box-shadow:0 10px 30px rgba(0,0,0,.4);`;
      document.body.appendChild(flyer);
      const dx = to.left + to.width / 2 - cx;
      const dy = to.top + to.height / 2 - cy;
      gsap
        .timeline({
          onComplete: () => {
            flyer.remove();
            commit();
          },
        })
        .to(flyer, {
          x: dx * 0.5,
          y: dy - 100,
          duration: 0.4,
          ease: "power2.out",
        })
        .to(flyer, {
          x: dx,
          y: dy,
          scale: 0.18,
          opacity: 0.2,
          duration: 0.45,
          ease: "power2.in",
        });
    },
    []
  );

  const remove = useCallback(
    (id: string) => setItems((prev) => prev.filter((p) => p.id !== id)),
    []
  );
  const setQty = useCallback(
    (id: string, qty: number) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((p) => p.id !== id)
          : prev.map((p) => (p.id === id ? { ...p, qty } : p))
      ),
    []
  );

  const open = useCallback(() => setDrawerOpen(true), []);
  const close = useCallback(() => setDrawerOpen(false), []);

  // drawer open/close animation
  useEffect(() => {
    if (!panel.current || !backdrop.current) return;
    if (drawerOpen) {
      gsap.set([panel.current, backdrop.current], { display: "block" });
      gsap.to(backdrop.current, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(
        panel.current,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.6, ease: "power4.out" }
      );
      gsap.fromTo(
        ".kx-cart-item",
        { x: 40, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.07,
          delay: 0.18,
          ease: "power3.out",
        }
      );
    } else {
      gsap.to(backdrop.current, { opacity: 0, duration: 0.35 });
      gsap.to(panel.current, {
        xPercent: 100,
        duration: 0.45,
        ease: "power3.in",
        onComplete: () => {
          if (panel.current && backdrop.current)
            gsap.set([panel.current, backdrop.current], { display: "none" });
        },
      });
    }
  }, [drawerOpen, items.length]);

  return (
    <CartCtx.Provider value={{ items, count, total, add, remove, setQty, open }}>
      {children}

      <button
        ref={bag}
        onClick={open}
        className="fixed bottom-4 right-4 z-[70] flex h-12 items-center gap-2.5 rounded-full border border-line bg-ink-soft/80 px-4 font-mono text-xs uppercase tracking-widest text-cloud backdrop-blur transition-colors hover:border-cloud md:bottom-6 md:right-6 md:h-14 md:gap-3 md:px-5"
        aria-label={`Abrir bolsa, ${count} artículos`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
        </svg>
        Bolsa
        <span className="relative inline-flex h-6 min-w-6 items-center justify-center">
          <span
            ref={countEl}
            className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-acid px-1.5 text-ink"
          >
            {count}
          </span>
        </span>
      </button>

      {/* backdrop */}
      <div
        ref={backdrop}
        onClick={close}
        className="fixed inset-0 z-[80] hidden bg-ink/70 opacity-0 backdrop-blur-sm"
      />

      {/* drawer */}
      <div
        ref={panel}
        className="fixed right-0 top-0 z-[81] hidden h-[100svh] w-full max-w-md border-l border-line bg-ink-soft"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line p-6">
            <h2 className="font-display text-2xl uppercase">Tu Bolsa [{count}]</h2>
            <button
              onClick={close}
              className="font-mono text-xs uppercase tracking-widest text-cloud-dim hover:text-cloud"
            >
              Cerrar
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <p className="font-display text-3xl uppercase text-cloud/30">
                  Bolsa vacía
                </p>
                <button
                  onClick={close}
                  className="pill-ghost"
                >
                  Seguir viendo
                </button>
              </div>
            ) : (
              <ul className="flex flex-col gap-5">
                {items.map((it) => (
                  <li
                    key={it.id}
                    className="kx-cart-item flex gap-4 border-b border-line/60 pb-5"
                  >
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-surface">
                      <Image src={it.image} alt={it.name} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display text-lg uppercase leading-none">
                            {it.name}
                          </h3>
                          <p className="mt-1 text-xs text-mute">{it.category}</p>
                        </div>
                        <span className="font-mono text-sm">${it.price * it.qty}</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-3 border border-line rounded-full px-3 py-1">
                          <button
                            onClick={() => setQty(it.id, it.qty - 1)}
                            className="text-cloud-dim hover:text-cloud"
                            aria-label="Decrease"
                          >
                            −
                          </button>
                          <span className="w-4 text-center font-mono text-xs">{it.qty}</span>
                          <button
                            onClick={() => setQty(it.id, it.qty + 1)}
                            className="text-cloud-dim hover:text-cloud"
                            aria-label="Increase"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => remove(it.id)}
                          className="font-mono text-[10px] uppercase tracking-widest text-mute hover:text-sale"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-line p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-cloud-dim">
                  Subtotal
                </span>
                <span className="font-display text-2xl">${total}</span>
              </div>
              <button className="pill-primary w-full justify-center">
                Finalizar compra
              </button>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-mute">
                Envío e impuestos calculados al finalizar
              </p>
            </div>
          )}
        </div>
      </div>
    </CartCtx.Provider>
  );
}
