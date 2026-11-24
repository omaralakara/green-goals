"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import turf from "@/assets/ppp-schools-pitch.jpg";
import metro from "@/assets/doha-metro.jpg";
import pergola from "@/assets/qetaifan-pergola.jpg";
import { projectsAction } from "@/lib/site";
import styles from "./Hero.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Slide = { name: string; work: string; image: StaticImageData; alt: string; position: string };

// Three real projects. The photograph fills the screen; the row at the foot says which project it is and switches it.
const slides: Slide[] = [
  {
    name: "PPP Schools, Package 1",
    work: "FIFA-quality turf and landscaping",
    image: turf,
    alt: "New artificial grass laid in front of a school building, with the crew finishing at night",
    position: "50% 40%",
  },
  {
    name: "Doha Metro, Gold Line",
    work: "Structural steel at seven stations",
    image: metro,
    alt: "A Doha Metro station with a curved copper-coloured canopy",
    position: "50% 50%",
  },
  {
    name: "Qetaifan Island North",
    work: "Roof steelwork and aluminium details",
    image: pergola,
    alt: "A timber pergola in front of a hotel at Qetaifan Island North",
    position: "40% 45%",
  },
];

/** seconds each project stays on screen before the next one comes */
const HOLD = 6.5;

// The hero is never still: the photograph drifts, and a ring runs round the small preview of the next project
// (and a line along the project row) while a project is on show; then the next project wipes in.
// Scrolling away moves the photograph slower than the page.
export default function Hero() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const ring = useRef<SVGRectElement>(null);
  const shown = useRef(0);
  const wipeEnd = useRef(0); // when the wipe now running is over
  const timer = useRef<gsap.core.Timeline | null>(null);
  const still = useRef(false); // the visitor asked for reduced motion
  const held = useRef(false); // the pointer is on the project row
  const inView = useRef(true);

  // Get a photograph ready shortly before it comes in. A photograph that sits under another one is not kept
  // painted by the browser, so the first frame of a change had to wait for it to be decoded and painted: that was
  // the stutter. Here it is put on top, almost fully transparent (1%, which cannot be seen), so the browser paints
  // it now, while nothing is moving.
  function warm(i: number) {
    const layer = layers.current[i];
    if (!layer || i === shown.current || still.current || performance.now() < wipeEnd.current) return;
    const img = layer.querySelector("img");
    if (!img) return;
    img.decode().catch(() => {});
    img.style.opacity = "0.01";
    layer.style.zIndex = "4";
  }

  // The line on a project's tab: it fills while that project is on show and brings the next one when it is full.
  function hold(i: number) {
    timer.current?.kill();
    timer.current = null;
    const full = still.current || held.current;
    bars.current.forEach((bar, j) => bar && gsap.set(bar, { scaleX: j === i && full ? 1 : 0 }));
    gsap.set(ring.current, { strokeDashoffset: full ? 0 : 1 });
    if (full) return;
    timer.current = gsap
      .timeline({ paused: !inView.current, onComplete: () => show((i + 1) % slides.length) })
      .to(bars.current[i], { scaleX: 1, duration: HOLD, ease: "none" }, 0)
      .to(ring.current, { strokeDashoffset: 0, duration: HOLD, ease: "none" }, 0)
      .call(warm, [(i + 1) % slides.length], HOLD - 0.8);
  }

  function show(next: number) {
    if (next === shown.current) {
      hold(next);
      return;
    }
    const incoming = layers.current[next];
    if (!incoming) return;
    const fromRight = next > shown.current;
    const outgoing = layers.current[shown.current];
    shown.current = next;
    setActive(next);

    const slide = incoming.firstElementChild;
    const photo = slide?.firstElementChild ?? null;
    gsap.killTweensOf([incoming, slide, photo]);
    // All three photographs stay drawn, one above the other, so nothing has to be painted when one comes in:
    // the new one goes on top, the one it covers stays right under it.
    layers.current.forEach((layer) => {
      if (!layer) return;
      layer.style.zIndex = layer === incoming ? "3" : layer === outgoing ? "2" : "1";
      const img = layer.querySelector("img");
      if (img) img.style.opacity = "";
    });

    if (still.current) {
      gsap.set([incoming, slide], { xPercent: 0 });
      hold(next);
      return;
    }

    // The new photograph wipes in from the side its button sits on, then keeps drifting until the next one.
    // The wipe is two moves that cancel out: the frame slides in while the photograph inside it slides back,
    // so the photograph stays put and only its edge travels. Moving layers is much cheaper than redrawing a clip.
    const from = fromRight ? 100 : -100;
    wipeEnd.current = performance.now() + 1100;
    gsap.fromTo(incoming, { xPercent: from }, { xPercent: 0, duration: 1.05, ease: "expo.inOut" });
    gsap.fromTo(slide, { xPercent: -from }, { xPercent: 0, duration: 1.05, ease: "expo.inOut" });
    gsap.fromTo(photo, { scale: 1.16 }, { scale: 1.03, duration: HOLD + 2.5, ease: "power2.out" });
    hold(next);
  }

  useGSAP(
    () => {
      still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (still.current) {
        hold(0);
        return;
      }

      // the first photograph drifts from the moment the page opens
      gsap.fromTo(
        layers.current[0]?.firstElementChild?.firstElementChild ?? null,
        { scale: 1.16 },
        { scale: 1.03, duration: HOLD + 2.5, ease: "power2.out" },
      );
      gsap.delayedCall(1.2, () => hold(shown.current));

      // scrolling away: the photograph moves slower than the page and the words lift off it
      gsap.to(media.current, {
        yPercent: 16,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(content.current, {
        yPercent: -16,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });

      // the projects only change while the hero is on screen
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom 35%",
        onToggle: (self) => {
          inView.current = self.isActive;
          if (self.isActive && !held.current) timer.current?.play();
          else timer.current?.pause();
        },
      });
    },
    { scope: root },
  );

  useEffect(() => () => void timer.current?.kill(), []);

  const next = (active + 1) % slides.length;

  return (
    <section ref={root} className={styles.hero} id="top" aria-labelledby="hero-title">
      <div ref={media} className={styles.media}>
        {slides.map((slide, i) => (
          <div
            key={slide.name}
            ref={(el) => {
              layers.current[i] = el;
            }}
            className={styles.layer}
            data-first={i === 0 || undefined}
          >
            <div className={styles.slide}>
              <Image
                className={styles.photo}
                src={slide.image}
                alt={i === active ? slide.alt : ""}
                fill
                sizes="100vw"
                quality={80}
                placeholder="blur"
                preload={i === 0}
                loading="eager"
                style={{ objectPosition: slide.position }}
              />
            </div>
          </div>
        ))}
        <div className={styles.shade} />
      </div>

      <div ref={content} className={styles.content}>
        <h1 className={styles.title} id="hero-title">
          <span className={styles.line}>
            <span style={{ "--d": "80ms" } as React.CSSProperties}>From first drawing</span>
          </span>
          <span className={styles.line}>
            <span style={{ "--d": "170ms" } as React.CSSProperties}>to finished landscape.</span>
          </span>
        </h1>
        <p className={styles.lead}>
          Green Goals is a design and build contractor in Doha. One team handles the architecture, BIM, construction,
          landscaping and artificial grass, backed by 25 years in the GCC.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href={projectsAction.href}>
            {projectsAction.label}
          </a>
          <button
            className={styles.next}
            type="button"
            aria-label={`Show the next project: ${slides[next].name}`}
            onPointerEnter={() => warm((shown.current + 1) % slides.length)}
            onFocus={() => warm((shown.current + 1) % slides.length)}
            onClick={() => show((shown.current + 1) % slides.length)}
          >
            <span className={styles.nextFrame}>
              {slides.map((slide, i) => (
                <span key={slide.name} className={styles.nextThumb} data-on={i === next || undefined}>
                  <Image src={slide.image} alt="" fill sizes="160px" style={{ objectPosition: slide.position }} />
                </span>
              ))}
              <svg className={styles.ring} viewBox="0 0 152 92" aria-hidden="true">
                <rect className={styles.ringTrack} x="1.5" y="1.5" width="149" height="89" rx="44.5" />
                <rect ref={ring} className={styles.ringFill} x="1.5" y="1.5" width="149" height="89" rx="44.5" pathLength={1} />
              </svg>
            </span>
            <span className={styles.nextText}>
              <span className={styles.nextLabel}>Next project</span>
              <span className={styles.nextName}>{slides[next].name}</span>
            </span>
          </button>
        </div>
      </div>

      <div
        className={styles.switcher}
        role="group"
        aria-label="Project shown in the photograph"
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          held.current = true;
          timer.current?.pause();
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "mouse") return;
          held.current = false;
          if (timer.current) timer.current.play();
          else hold(shown.current);
        }}
      >
        {slides.map((slide, i) => (
          <button
            key={slide.name}
            className={styles.tab}
            type="button"
            aria-pressed={i === active}
            onPointerEnter={() => warm(i)}
            onFocus={() => warm(i)}
            onClick={() => show(i)}
          >
            <span
              ref={(el) => {
                bars.current[i] = el;
              }}
              className={styles.bar}
              aria-hidden="true"
            />
            <span className={styles.thumb}>
              <Image src={slide.image} alt="" fill sizes="72px" style={{ objectPosition: slide.position }} />
            </span>
            <span className={styles.tabText}>
              <span className={styles.tabName}>{slide.name}</span>
              <span className={styles.tabWork}>{slide.work}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
