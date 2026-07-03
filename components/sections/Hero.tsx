"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Hero = editorial intro + pinned 3D product scroll.
 *
 *  - Intro: ported from Awwwards Pack "+26 Hero Animations / 3" (full-bleed
 *    image-sequence reveal + radial vignette + masked word-by-word headline).
 *  - Pinned overview: ported from "+22 3D Animation / 21" (rotating sneaker GLB,
 *    circular-mask reveal, sliding display headers, feature tooltips).
 *
 * Mono/stealth re-skin. The 3D loop is render-on-demand and shadow-free for fps.
 */

const HEADER_1 = "INGENIERÍA";

const INTRO_IMAGES = [
  "/img/editorial/img2.webp",
  "/img/editorial/img11.webp",
  "/img/editorial/img7.webp",
  "/img/editorial/img21.webp",
  "/img/editorial/img16.webp",
  "/img/editorial/img30.webp",
];

const HEADLINE = ["EN", "BUSCA DEL", "MOVIMIENTO"];

const TOOLTIPS = [
  {
    tag: "01",
    title: "Placa de Propulsión de Carbono",
    desc: "Una placa forjada de longitud completa devuelve energía en cada zancada, convirtiendo el esfuerzo en impulso.",
  },
  {
    tag: "02",
    title: "Espuma ZeroGravity",
    desc: "Espuma supercrítica en la entresuela, afinada para un 84% de retorno de energía: ligera bajo carga, implacable al ritmo.",
  },
];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const modelMount = useRef<HTMLDivElement>(null);

  // ---- intro reveal timeline ----
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = document.documentElement.classList.contains("reduce-motion");

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".kx-intro-img", { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(".kx-intro-frame", { scale: 1, borderRadius: 0 });
        gsap.set(".kx-intro-radial", { opacity: 1 });
        gsap.set([".kx-intro-word > span", ".kx-intro-cta"], {
          yPercent: 0,
          autoAlpha: 1,
        });
        return;
      }

      gsap.set(".kx-intro-frame", { scale: 0.72, borderRadius: 14 });
      gsap.set(".kx-intro-img", { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(".kx-intro-word > span", { yPercent: 115 });
      gsap.set(".kx-intro-cta", { autoAlpha: 0, y: 20 });

      gsap
        .timeline({ delay: 0.15 })
        .to(
          ".kx-intro-frame",
          { scale: 1, borderRadius: 0, duration: 1.2, ease: "power3.inOut" },
          0
        )
        .to(
          ".kx-intro-img",
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.9,
            stagger: { each: 0.2, ease: "power1.out" },
          },
          0.2
        )
        .to(".kx-intro-radial", { opacity: 1, duration: 0.9 }, ">-0.5")
        .to(
          ".kx-intro-word > span",
          { yPercent: 0, duration: 0.95, stagger: 0.09, ease: "power3.out" },
          "-=0.55"
        )
        .to(
          ".kx-intro-cta",
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.35"
        );
    }, el);

    return () => ctx.revert();
  }, []);

  // ---- pinned 3D overview ----
  useEffect(() => {
    const el = root.current;
    const mount = modelMount.current;
    if (!el || !mount) return;

    const reduce = document.documentElement.classList.contains("reduce-motion");
    const mobile = window.innerWidth < 768;
    let cleanupThree: (() => void) | null = null;
    let killed = false;

    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import(
        "three/examples/jsm/loaders/GLTFLoader.js"
      );
      const { RoomEnvironment } = await import(
        "three/examples/jsm/environments/RoomEnvironment.js"
      );
      if (killed) return;

      let model: THREE.Object3D | null = null;
      let modelSize: THREE.Vector3 | null = null;
      let baseY = 0;
      const isMobile = window.innerWidth < 768;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(window.innerWidth, window.innerHeight);
      // Crisp on hi-DPI displays — 2x supersampling on desktop sharpens edges.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.6 : 2));
      const maxAniso = renderer.capabilities.getMaxAnisotropy();
      // Cinematic, slightly underexposed grade so the colourway reads deep
      // rather than flat-bright.
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.62;
      mount.appendChild(renderer.domElement);

      // Studio environment for realistic PBR reflections (no external HDRI).
      // Kept low-intensity so reflections add form without washing the shoe out.
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      scene.add(new THREE.AmbientLight(0xffffff, 0.3));
      const mainLight = new THREE.DirectionalLight(0xffffff, 2.4);
      mainLight.position.set(2, 3, 3);
      scene.add(mainLight);
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
      fillLight.position.set(-3, 0, -2);
      scene.add(fillLight);
      const rimLight = new THREE.DirectionalLight(0xffffff, 1.6);
      rimLight.position.set(0, -2, -4);
      scene.add(rimLight);

      const setupModel = () => {
        if (!model || !modelSize) return;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.set(
          isMobile ? -center.x : -center.x - modelSize.x * 0.1,
          -center.y,
          -center.z
        );
        model.rotation.z = isMobile ? 0 : THREE.MathUtils.degToRad(-12);
        const cameraDistance = isMobile ? 2.05 : 1.32;
        camera.position.set(
          0,
          0,
          Math.max(modelSize.x, modelSize.y, modelSize.z) * cameraDistance
        );
        camera.lookAt(0, 0, 0);
      };

      const applyMaterials = () => {
        if (!model) return;
        model.traverse((node) => {
          const mesh = node as THREE.Mesh;
          const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
          if (mesh.isMesh && mat) {
            mat.metalness = 0.25;
            mat.roughness = 0.45;
            mat.envMapIntensity = 0.35;
            // Max anisotropic filtering keeps the knit/texture crisp at grazing
            // angles instead of blurring — the main "low-res" culprit.
            (
              [
                "map",
                "normalMap",
                "roughnessMap",
                "metalnessMap",
                "aoMap",
                "emissiveMap",
              ] as const
            ).forEach((k) => {
              const tex = mat[k] as THREE.Texture | null;
              if (tex) {
                tex.anisotropy = maxAniso;
                tex.needsUpdate = true;
              }
            });
            // Deepen the saturated sky-blue knit into a moodier tone; leave the
            // near-neutral sole/laces alone.
            if (mat.color) {
              const c = mat.color;
              const sat = Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b);
              if (sat > 0.1) c.multiplyScalar(0.62);
            }
          }
        });
      };

      new GLTFLoader().load("/models/sneaker.glb", async (gltf) => {
        if (killed) return;
        model = gltf.scene;

        // This Khronos shoe ships material variants — switch to a dark one so
        // the colourway fits the stealth system instead of bright sky-blue.
        const ext = gltf.userData?.gltfExtensions?.[
          "KHR_materials_variants"
        ] as { variants: { name: string }[] } | undefined;
        if (ext?.variants?.length) {
          const parser = gltf.parser as {
            getDependency: (t: string, i: number) => Promise<THREE.Material>;
          };
          const prefs = ["midnight", "black", "dark", "street"];
          let vIndex = -1;
          for (const p of prefs) {
            vIndex = ext.variants.findIndex((v) =>
              v.name.toLowerCase().includes(p)
            );
            if (vIndex !== -1) break;
          }
          if (vIndex !== -1) {
            const p2 = parser as unknown as {
              getDependency: (t: string, i: number) => Promise<THREE.Material>;
              assignFinalMaterial?: (m: THREE.Mesh) => void;
            };
            const tasks: Promise<void>[] = [];
            model.traverse((object) => {
              const mesh = object as THREE.Mesh;
              const mv = (
                mesh.userData?.gltfExtensions as
                  | Record<string, { mappings: { variants: number[]; material: number }[] }>
                  | undefined
              )?.["KHR_materials_variants"];
              if (!mesh.isMesh || !mv) return;
              const mapping = mv.mappings.find((m) =>
                m.variants.includes(vIndex)
              );
              if (mapping)
                tasks.push(
                  p2.getDependency("material", mapping.material).then((m) => {
                    mesh.material = m;
                    p2.assignFinalMaterial?.(mesh);
                  })
                );
            });
            try {
              await Promise.all(tasks);
            } catch {}
            if (killed) return;
          }
        }

        applyMaterials();
        const box = new THREE.Box3().setFromObject(model);
        modelSize = box.getSize(new THREE.Vector3());
        baseY = model.rotation.y;
        scene.add(model);
        setupModel();
        ScrollTrigger.refresh();
      });

      // Continuous render — the scene is a single light model, so a steady
      // rAF loop is cheap and avoids the frame-stepping that render-on-demand
      // caused while easing the wheel through the scrub.
      let raf = 0;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        setupModel();
      };
      window.addEventListener("resize", onResize);

      (mount as HTMLElement & { __rotate?: (p: number) => void }).__rotate = (
        progress: number
      ) => {
        if (!model) return;
        // Absolute rotation from scroll progress — no accumulation, so jumping
        // via the menu and scrolling back never desyncs the model's angle.
        const rotationProgress = Math.max(0, (progress - 0.05) / 0.95);
        model.rotation.y = baseY + Math.PI * 2 * 3 * rotationProgress;
      };

      cleanupThree = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        if (renderer.domElement.parentNode)
          renderer.domElement.parentNode.removeChild(renderer.domElement);
      };
    })();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".kx-overview",
        start: "75% bottom",
        onEnter: () =>
          gsap.to(".kx-h1 .char > span", {
            y: "0%",
            duration: 1,
            ease: "power3.out",
            stagger: 0.04,
          }),
        onLeaveBack: () =>
          gsap.to(".kx-h1 .char > span", {
            y: "100%",
            duration: 1,
            ease: "power3.out",
            stagger: 0.04,
          }),
      });

      ScrollTrigger.create({
        trigger: ".kx-overview",
        start: "top top",
        end: `+=${window.innerHeight * (reduce ? 3 : mobile ? 3.5 : 5)}px`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
        refreshPriority: 30,
        // Force fixed pinning + anticipate so pins resolve consistently across
        // engines (Firefox/Gecko otherwise mis-spaces them → sections overlap).
        pinType: "fixed",
        anticipatePin: 1,
        onUpdate: ({ progress }) => {
          const headerProgress = Math.max(0, Math.min(1, (progress - 0.12) / 0.28));
          gsap.set(".kx-h1", {
            xPercent:
              progress < 0.12 ? 0 : progress > 0.4 ? -100 : -100 * headerProgress,
          });

          const maskSize =
            progress < 0.2
              ? 0
              : progress > 0.3
              ? 100
              : 100 * ((progress - 0.2) / 0.1);
          gsap.set(".kx-mask", { clipPath: `circle(${maskSize}% at 50% 50%)` });

          // AERO-01 slides in, HOLDS centred for a stretch (so it's readable),
          // then slides out — instead of continuously sweeping past.
          let header2XPercent: number;
          if (progress < 0.15) header2XPercent = 100;
          else if (progress < 0.3)
            header2XPercent = 100 - 100 * ((progress - 0.15) / 0.15); // in -> 0
          else if (progress < 0.5) header2XPercent = 0; // hold centred (readable)
          else if (progress < 0.62)
            header2XPercent = -200 * ((progress - 0.5) / 0.12); // out
          else header2XPercent = -200;
          gsap.set(".kx-h2", { xPercent: header2XPercent });

          const scaleX =
            progress < 0.45
              ? 0
              : progress > 0.65
              ? 100
              : 100 * ((progress - 0.45) / 0.2);
          gsap.set(".kx-tooltip .divider", { scaleX: `${scaleX}%` });

          // Tooltips reveal in the back third and hold to the end.
          [
            { trigger: 0.65, sel: ".kx-tooltip:nth-child(1) .reveal > span" },
            { trigger: 0.85, sel: ".kx-tooltip:nth-child(2) .reveal > span" },
          ].forEach(({ trigger, sel }) => {
            gsap.set(sel, { y: progress >= trigger ? "0%" : "125%" });
          });

          const rotate = (
            mount as HTMLElement & { __rotate?: (p: number) => void }
          ).__rotate;
          rotate?.(progress);
        },
      });
    }, el);

    const refreshSoon = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      killed = true;
      cancelAnimationFrame(refreshSoon);
      ctx.revert();
      cleanupThree?.();
    };
  }, []);

  return (
    <div ref={root}>
      {/* ---- editorial intro ---- */}
      <section className="relative isolate h-[100svh] w-screen overflow-hidden">
        <div className="kx-intro-frame absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden">
          {INTRO_IMAGES.map((src, i) => (
            <div key={src} className="kx-intro-img absolute inset-0">
              <Image
                src={src}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover grayscale"
              />
            </div>
          ))}
          {/* radial vignette + grade */}
          <div
            className="kx-intro-radial absolute inset-0 opacity-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 30%, rgba(10,10,11,0) 30%, rgba(10,10,11,0.55) 70%, rgba(10,10,11,0.92) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-ink/30" />
        </div>

        {/* top meta */}
        <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-between p-5 pt-24 sm:px-8 lg:px-12">
          <p className="eyebrow">KINETIK — SS26</p>
          <p className="eyebrow hidden sm:block">Calzado de Rendimiento</p>
        </div>

        {/* headline bottom-left */}
        <div className="absolute bottom-0 left-0 z-10 w-full p-5 sm:p-8 lg:p-12">
          <h1 className="font-display text-display-xl uppercase leading-[0.85]">
            {HEADLINE.map((line) => (
              <span
                key={line}
                className="kx-intro-word block overflow-hidden"
              >
                <span className="block">{line}</span>
              </span>
            ))}
          </h1>
          <div className="kx-intro-cta mt-8 flex flex-wrap items-center gap-5">
            <a href="#collections" className="pill-primary" data-cursor="Ver">
              Explora la colección
            </a>
            <span className="hidden max-w-xs text-sm text-cloud-dim sm:block">
              Calzado diseñado para devolverte tiempo. Desliza para conocer la
              AERO-01.
            </span>
          </div>
        </div>
      </section>

      {/* ---- pinned product overview ---- */}
      <section className="kx-overview relative isolate h-[100svh] w-screen overflow-hidden bg-ink">
        <div
          ref={modelMount}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[100] h-full w-full -translate-x-1/2 -translate-y-1/2"
        />

        <div className="kx-h1 absolute inset-0 flex w-[200vw] items-center px-6">
          <h1 className="font-display text-[15vw] uppercase leading-none text-cloud">
            {HEADER_1.split("").map((c, i) => (
              <span
                key={i}
                className="char inline-block overflow-hidden align-bottom"
              >
                <span className="block translate-y-full will-change-transform">
                  {c}
                </span>
              </span>
            ))}
          </h1>
        </div>

        {/* circular mask reveal — dark tonal panel */}
        <div
          className="kx-mask absolute inset-0 z-[1] bg-surface"
          style={{ clipPath: "circle(0% at 50% 50%)" }}
        />

        <div className="kx-h2 absolute inset-0 z-[2] flex w-[150vw] translate-x-full items-center px-6">
          <h1 className="font-display text-[15vw] uppercase leading-none text-cloud/95">
            AERO-01
          </h1>
        </div>

        <div className="absolute left-1/2 top-1/2 z-[3] flex h-[75%] w-[80%] -translate-x-1/2 -translate-y-1/2 flex-col justify-between gap-8 md:flex-row md:gap-[12rem]">
          {TOOLTIPS.map((t, i) => (
            <div
              key={t.tag}
              className={`kx-tooltip flex flex-1 flex-col gap-2 text-cloud ${
                i === 1 ? "md:items-end md:text-right" : ""
              }`}
            >
              <div className="font-mono text-sm text-cloud-dim">
                <span className="reveal block overflow-hidden">
                  <span className="block translate-y-[125%]">{t.tag}</span>
                </span>
              </div>
              <div className="divider my-2 h-px w-full origin-left scale-x-0 bg-cloud/25" />
              <div className="font-display text-2xl uppercase leading-none text-cloud md:max-w-[18ch]">
                <span className="reveal block overflow-hidden">
                  <span className="block translate-y-[125%]">{t.title}</span>
                </span>
              </div>
              <div className="mt-1 max-w-[34ch] text-sm text-cloud-dim">
                <span className="reveal block overflow-hidden">
                  <span className="block translate-y-[125%]">{t.desc}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
