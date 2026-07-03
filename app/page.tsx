"use client";

import dynamic from "next/dynamic";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PageTransition } from "@/components/providers/PageTransition";
import { CartProvider } from "@/components/providers/Cart";
import { Navigation } from "@/components/sections/Navigation";
import { Marquee } from "@/components/sections/Marquee";
import { Collections } from "@/components/sections/Collections";
import { Featured } from "@/components/sections/Featured";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { Showcase } from "@/components/sections/Showcase";
import { StackedCards } from "@/components/sections/StackedCards";
import { Lookbook } from "@/components/sections/Lookbook";
import { ImageTrail } from "@/components/sections/ImageTrail";
import { Grid3D } from "@/components/sections/Grid3D";
import { StickyImages } from "@/components/sections/StickyImages";
import { Gooey } from "@/components/sections/Gooey";
import { AtelierSlider } from "@/components/sections/AtelierSlider";
import { SplitHover } from "@/components/sections/SplitHover";
import { ClipReveal } from "@/components/sections/ClipReveal";
import { Categories } from "@/components/sections/Categories";
import { Connect } from "@/components/sections/Connect";
import { Footer } from "@/components/sections/Footer";
import { CustomCursor } from "@/components/visual/CustomCursor";

// WebGL-heavy pieces stay out of SSR / the initial bundle.
const Hero = dynamic(
  () => import("@/components/sections/Hero").then((m) => m.Hero),
  { ssr: false }
);
const DitherBackground = dynamic(
  () =>
    import("@/components/visual/DitherBackground").then(
      (m) => m.DitherBackground
    ),
  { ssr: false }
);

export default function Home() {
  return (
    <SmoothScroll>
      <PageTransition>
        <CartProvider>
          <DitherBackground />
          <CustomCursor />
          <Navigation />
          <main id="page-content" className="relative bg-ink/0">
            <span id="top" className="absolute top-0" />
            <Hero />
            <Marquee text="ENVÍO GRATIS +50€ · DEVOLUCIONES EN 30 DÍAS" />
            <Collections />
            <AtelierSlider />
            <Featured />
            <ProductGrid />
            <StackedCards />
            <Showcase />
            <Lookbook />
            <ImageTrail />
            <Grid3D />
            <StickyImages />
            <SplitHover />
            <Gooey />
            <ClipReveal />
            <Marquee text="NUEVA COLECCIÓN SS26 · YA DISPONIBLE" />
            <Categories />
            <Connect />
            <Footer />
          </main>
        </CartProvider>
      </PageTransition>
    </SmoothScroll>
  );
}
