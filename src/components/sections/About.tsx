"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./About.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const statement =
  "For 25 years Green Goals has designed, built and landscaped across the GCC. From Doha, one team takes a project from the first drawing to the finished landscape.";

// Figures from green-goals.com and the company profile.
const figures = [
  { value: 25, label: "Years building in the GCC" },
  { value: 4, label: "Offices: Qatar, Saudi Arabia, the UAE and Lebanon" },
  { value: 7, label: "Doha Metro stations with our structural steel" },
  { value: 500, before: "LOD ", label: "BIM models taken to as-built detail" },
];

// Who the company is, in one sentence and four numbers. The sentence lights up word by word as the section
// scrolls into place, and the numbers count up once. Without the script, or with reduced motion, it all just reads.
export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: root.current, start: "top 82%", end: "top 14%", scrub: 0.3 },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el, i) => {
          const end = Number(el.dataset.count);
          const count = { value: 0 };
          gsap.to(count, {
            value: end,
            duration: 1.6,
            delay: i * 0.12,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(count.value));
            },
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`section ${styles.about}`} id="about" aria-labelledby="about-title">
      <div className={`wrap ${styles.inner}`}>
        <h2 className={styles.statement} id="about-title">
          {statement.split(" ").map((word, i) => (
            <span key={i} data-word>
              {word}{" "}
            </span>
          ))}
        </h2>

        <dl className={styles.figures}>
          {figures.map((figure) => (
            <div key={figure.label} className={styles.figure}>
              <dt className={styles.value}>
                {figure.before}
                <span data-count={figure.value}>{figure.value}</span>
              </dt>
              <dd className={styles.label}>{figure.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
