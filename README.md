# KINETIK — Engineered Motion

**🔗 Live:** https://kinetik-beryl.vercel.app/

![Hero](docs/01_hero.png)

A premium, dark-futuristic single-page experience for a fictional performance-footwear
brand (**KINETIK**), built as an Awwwards-style showcase. Long-scroll homepage with a
3D scroll hero, a fullscreen navigation, cinematic page transitions and a sequence of
scroll-driven product sections.

> Fictional brand. Built **on top of the local Awwwards Pack effects** — each effect was
> inspected and ported to React rather than recreated from scratch.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS** — mono / stealth system (`#0B0B0C` ink, `#F5F5F5` cloud, pure
  white as the only accent; sale red `#FF3B30` is the single semantic colour)
- **GSAP + ScrollTrigger** · **Lenis** smooth scroll · **Three.js** (WebGL)

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Effect → Component mapping

Every section reuses the implementation from `assets/Awwwards Pack`, ported into a React
client component (original Three.js / GSAP logic preserved inside `useEffect` with cleanup).

| Awwwards Pack source | Component | Section |
|---|---|---|
| `+22 3D Animation / 21` (+ scanner idea from `/19`) | `components/sections/Hero.tsx` | Pinned 3D scroll hero — sneaker GLB rotates, circular-mask reveal, feature tooltips |
| `+10 Background Animations / 8` | `components/visual/DitherBackground.tsx` | Global WebGL dithered-wave backdrop (pointer-reactive) |
| `+21 Navigation Menus / 6` | `components/sections/Navigation.tsx` | Fullscreen menu — page rotates away, clip-path sweep, hover image preview |
| `+17 Page Transitions / 5` | `components/providers/PageTransition.tsx` | Cover-panel intro reveal + wipe between in-page destinations |
| `+10 Grid Animations / 4` | `components/sections/Collections.tsx` | Horizontal pinned collection showcase with image parallax |
| `+10 Grid Animations / 8` | `components/sections/Featured.tsx` | Hover-reveal product-name list with directional clip-path wipes |
| `+10 Grid Animations / 6` | `components/providers/Cart.tsx` | Fly-to-bag add-to-cart micro animation |
| `+10 Grid Animations / 7` | `components/sections/Categories.tsx` | Layout-formation-on-scroll (tiles fly up into a grid) |
| `+10 Grid Animations / 5` | image set used across editorial sections | Repeating-image editorial source imagery |
| `+22 3D Animation / 5` (HoloCardMaterial) | `components/sections/Showcase.tsx` | Holographic mouse-tilt product card |
| `+22 3D Animation / 16` ("Living Words") | `components/sections/Showcase.tsx` | Scrub-lit kinetic statement |
| `+11 SVG Animations / 4` (scroll-reactive motion) | `components/sections/Marquee.tsx` | Velocity-aware marquee separators |

Design discipline (typographic scale, pill geometry, product-card layout, 8px spacing,
sale price signalling) follows the provided `design.md`, re-skinned to the dark system.

## Assets

- `public/models/sneaker.glb` — CC0 sneaker model (Khronos / Shopify *MaterialsVariantsShoe*).
- `public/img/sneakers/*` — sneaker product photography (Unsplash).
- `public/img/editorial/*` — editorial campaign imagery (from the Awwwards Pack).
- The raw `assets/` folder (zip + extracted sources) is git-ignored.

## Performance notes

- All WebGL (hero + dither background) is `dynamic(..., { ssr:false })` and lazy.
- One shared Lenis + GSAP ticker; ScrollTrigger pins use `refreshPriority` so the three
  pinned sections (hero, collections, categories) recompute in document order.
- `prefers-reduced-motion` disables smooth scroll, background animation and shortens the
  hero pin.
