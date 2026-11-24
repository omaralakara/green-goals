"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import design from "@/assets/service-design.jpg";
import bim from "@/assets/service-bim.jpg";
import construction from "@/assets/service-construction.jpg";
import landscape from "@/assets/service-landscape.jpg";
import styles from "./Services.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Service = { name: string; text: string; image: StaticImageData; alt: string; position: string };

// The four services, in the order a project runs.
const services: Service[] = [
  {
    name: "Design",
    text: "Architecture, structure and MEP, from schematic design to construction drawings and 3D renders.",
    image: design,
    alt: "Rendered reception hall with a stone feature wall between timber slats",
    position: "50% 50%",
  },
  {
    name: "BIM modelling",
    text: "Models from LOD 100 to LOD 500 for consultants and contractors, with clash checks and quantities.",
    image: bim,
    alt: "A coloured structural model beside its wireframe drawing",
    position: "45% 50%",
  },
  {
    name: "Construction",
    text: "Civil works, rebar and shuttering, steel structures, aluminium, gypsum, tiling and painting.",
    image: construction,
    alt: "A crew pouring a concrete slab on a building site at night",
    position: "62% 50%",
  },
  {
    name: "Landscape",
    text: "Hardscape, planting, pergolas and artificial grass, then maintenance contracts after handover.",
    image: landscape,
    alt: "Wide stone steps with a planted bed of flowers up the middle",
    position: "50% 60%",
  },
];

/** seconds each service stays chosen while the section plays by itself */
const HOLD = 3.8;

// The showpiece: four giant names on the green ground. The section plays by itself: a line runs under the chosen
// name, then the next name fills with the turf green and its photograph wipes in. Pointing at a name (or tapping
// it, or tabbing to it) chooses it and holds it there.
export default function Services() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const shown = useRef(0);
  const depth = useRef(1);
  const timer = useRef<gsap.core.Tween | null>(null);
  const still = useRef(false); // the visitor asked for reduced motion
  const held = useRef(false); // the pointer is on the list
  const inView = useRef(false);

  // The line under a name: it runs while that service is chosen and brings the next one when it is full.
  function hold(i: number) {
    timer.current?.kill();
    timer.current = null;
    bars.current.forEach((bar, j) => bar && gsap.set(bar, { scaleX: j === i && (still.current || held.current) ? 1 : 0 }));
    if (still.current || held.current) return;
    timer.current = gsap.to(bars.current[i], {
      scaleX: 1,
      duration: HOLD,
      ease: "none",
      paused: !inView.current,
      onComplete: () => show((i + 1) % services.length),
    });
  }

  // On entering the screen, once: the names rise out of their rows and the photograph opens.
  useGSAP(
    () => {
      still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      hold(0);

      // the section only plays while it is on screen
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 60%",
        end: "bottom 40%",
        onToggle: (self) => {
          inView.current = self.isActive;
          if (self.isActive && !held.current) timer.current?.play();
          else timer.current?.pause();
        },
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 62%", once: true } })
          .from("[data-rise]", { yPercent: 112, duration: 0.95, ease: "expo.out", stagger: 0.09 }, 0)
          .from(
            "[data-frame]",
            { clipPath: "inset(100% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut", clearProps: "clipPath" },
            0.1,
          );
      });
    },
    { scope: root },
  );

  useEffect(() => () => void timer.current?.kill(), []);

  function show(next: number) {
    if (next === shown.current) {
      hold(next);
      return;
    }
    const incoming = layers.current[next];
    if (!incoming) return;
    const fromBelow = next > shown.current;
    shown.current = next;
    setActive(next);

    depth.current += 1;
    gsap.killTweensOf([incoming, incoming.firstElementChild]);
    gsap.set(incoming, { zIndex: depth.current, visibility: "visible" });

    const hideOthers = () => {
      layers.current.forEach((layer) => {
        if (layer && layer !== incoming) gsap.set(layer, { visibility: "hidden" });
      });
    };

    hold(next);

    if (still.current) {
      gsap.set(incoming, { clipPath: "none" });
      hideOthers();
      return;
    }

    // the photograph wipes in from the side of the list the new name sits on
    gsap.fromTo(
      incoming,
      { clipPath: fromBelow ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "expo.inOut", onComplete: hideOthers },
    );
    gsap.fromTo(incoming.firstElementChild, { scale: 1.14 }, { scale: 1, duration: 1.3, ease: "expo.out" });
  }

  return (
    <section ref={root} className={`section ${styles.services}`} id="services" aria-labelledby="services-title">
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.head}>
          <h2 className={styles.title} id="services-title">
            What we do, in the order a project runs
          </h2>
          <p className={styles.lead}>Hire us for the whole job or for one part of it.</p>
        </div>

        <ol
          className={styles.list}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") held.current = true;
          }}
          onPointerLeave={(event) => {
            if (event.pointerType !== "mouse") return;
            held.current = false;
            hold(shown.current);
          }}
        >
          {services.map((service, i) => (
            <li key={service.name} className={styles.item} data-active={i === active || undefined}>
              <button
                className={styles.name}
                type="button"
                aria-pressed={i === active}
                aria-controls="service-panel"
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") show(i);
                }}
                onFocus={() => show(i)}
                onClick={() => show(i)}
              >
                <span className={styles.num} aria-hidden="true">
                  {i + 1}
                </span>
                <span className={styles.mask}>
                  <span className={styles.word} data-rise data-text={service.name}>
                    {service.name}
                  </span>
                </span>
              </button>
              <span
                ref={(el) => {
                  bars.current[i] = el;
                }}
                className={styles.bar}
                aria-hidden="true"
              />
            </li>
          ))}
        </ol>

        <div className={styles.panel} id="service-panel">
          <div className={styles.frame} data-frame>
            {services.map((service, i) => (
              <div
                key={service.name}
                ref={(el) => {
                  layers.current[i] = el;
                }}
                className={styles.layer}
                data-first={i === 0 || undefined}
              >
                <Image
                  src={service.image}
                  alt={i === active ? service.alt : ""}
                  fill
                  sizes="(min-width: 900px) 36vw, 100vw"
                  placeholder="blur"
                  style={{ objectPosition: service.position }}
                />
              </div>
            ))}
          </div>
          <p key={active} className={styles.text} aria-live="polite">
            {services[active].text}
          </p>
        </div>
      </div>
    </section>
  );
}
