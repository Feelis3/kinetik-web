/**
 * Tiny event bus so category sections (Collections, "Compra por deporte") can
 * drive the ProductGrid filter and scroll the shopper to the lineup.
 */
export const FILTER_EVENT = "kx:filter";

export function applyProductFilter(division: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(FILTER_EVENT, { detail: division }));
  const el = document.getElementById("rotation");
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } })
    .__lenis;
  if (lenis) lenis.scrollTo(y - 20);
  else window.scrollTo(0, y - 20);
}
