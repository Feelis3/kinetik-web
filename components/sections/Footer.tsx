/** Footer — design.md 4-column structure, re-skinned to the KINETIK dark system. */
const COLS = [
  { head: "Tienda", links: ["Carrera", "Trail", "Pista", "Lifestyle", "Rebajas"] },
  { head: "Ayuda", links: ["Envíos", "Devoluciones", "Guía de Tallas", "Contacto"] },
  { head: "Empresa", links: ["Nosotros", "Sostenibilidad", "Empleo", "Prensa"] },
  { head: "Señal", links: ["Membresía", "App", "Newsletter", "Atletas"] },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="container-x py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <a
              href="#top"
              className="font-display text-3xl uppercase tracking-tight"
            >
              KINE<span className="text-acid">TIK</span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-mute">
              Calzado de rendimiento diseñado para el movimiento.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.head}>
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-cloud">
                {c.head}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a
                      href="#"
                      className="text-sm text-mute transition-colors hover:text-cloud"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 md:flex-row md:items-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
            © {new Date().getFullYear()} KINETIK — Marca ficticia. Construido con
            los efectos del Awwwards Pack. Solo demo.
          </p>
          <div className="flex gap-5">
            {["Términos", "Privacidad", "Cookies"].map((l) => (
              // eslint-disable-next-line @next/next/no-html-link-for-pages
              <a
                key={l}
                href="#"
                className="font-mono text-[10px] uppercase tracking-widest text-mute hover:text-cloud"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
