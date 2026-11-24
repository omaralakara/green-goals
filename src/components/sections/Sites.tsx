"use client";

import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Rise from "@/components/Rise";
import crew from "@/assets/site-turf-crew.jpg";
import pergola from "@/assets/site-pergola.jpg";
import metro from "@/assets/site-metro.jpg";
import rebar from "@/assets/site-rebar.jpg";
import roll from "@/assets/site-turf-roll.jpg";
import styles from "./Sites.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Photo = { image: StaticImageData; alt: string; name: string; text: string; position?: string };

const photos: Photo[] = [
  {
    image: crew,
    alt: "Two Green Goals workers in high-visibility vests joining two rolls of artificial grass",
    name: "PPP Schools",
    text: "Joining the seams of a sports pitch",
  },
  {
    image: pergola,
    alt: "A round steel pergola on the beach at Qetaifan Island North",
    name: "Qetaifan Island North",
    text: "Steel pergola on the beach",
  },
  {
    image: metro,
    alt: "The concourse of a Doha Metro Gold Line station, with escalators under a ribbed white ceiling",
    name: "Doha Metro, Gold Line",
    text: "Station concourse, with our steel at the lifts",
  },
  {
    image: rebar,
    alt: "Rebar and shuttering for a concrete slab on a building site, seen from above",
    name: "Rebar and shuttering",
    text: "Steel fixed and ready for the pour",
  },
  {
    image: roll,
    alt: "A Green Goals worker unrolling a seam strip beside new artificial grass",
    name: "Artificial grass",
    text: "Laying the seam strip by hand",
    position: "50% 62%",
  },
];

// The moving section. On a desktop the section stays in place while the page scrolls and the row of photographs
// slides sideways, each photograph shifting inside its frame. On a phone, or with reduced motion, the row is swiped.
export default function Sites() {
  const root = useRef<HTMLElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const row = track.current;
        const frame = view.current;
        if (!row || !frame) return;

        const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 68;
        const distance = () => Math.max(0, row.scrollWidth - frame.clientWidth);

        const slide = gsap.to(row, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: `top ${header}px`,
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.3,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
          },
        });

        // each photograph is a little larger than its frame and shifts across it as the frame crosses the screen
        gsap.utils.toArray<HTMLElement>("[data-photo]").forEach((el) => {
          gsap.fromTo(
            el.querySelector("img"),
            { xPercent: -7, scale: 1.16 },
            {
              xPercent: 7,
              scale: 1.16,
              ease: "none",
              scrollTrigger: { trigger: el, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`section ${styles.sites}`} id="sites" aria-labelledby="sites-title">
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.head}>
          <Rise id="sites-title">On site with our crews</Rise>
          <p className={`lead ${styles.lead}`}>Photographs from our own jobs in Qatar.</p>
        </div>

        <div className={styles.rail} aria-hidden="true">
          <span ref={bar} className={styles.bar} />
        </div>

        <div ref={view} className={styles.view}>
          <div ref={track} className={styles.track}>
            {photos.map((photo) => (
              <figure key={photo.name} className={styles.item}>
                <div
                  className={styles.frame}
                  data-photo
                  style={{ aspectRatio: `${photo.image.width} / ${photo.image.height}` }}
                >
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 900px) 50vw, 86vw"
                    placeholder="blur"
                    loading="eager"
                    style={{ objectPosition: photo.position ?? "50% 50%" }}
                  />
                </div>
                <figcaption className={styles.caption}>
                  <span className={styles.name}>{photo.name}</span>
                  <span className={styles.text}>{photo.text}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
