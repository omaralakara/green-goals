"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// A section heading that rises out of its own line the first time it scrolls into view, the way the hero headline does.
export default function Rise({ children, className = "h2", id }: { children: ReactNode; className?: string; id?: string }) {
  const heading = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-rise-inner]", {
          yPercent: 108,
          duration: 1.05,
          ease: "expo.out",
          clearProps: "transform",
          scrollTrigger: { trigger: heading.current, start: "top 90%", once: true },
        });
      });
    },
    { scope: heading },
  );

  return (
    <h2 ref={heading} className={className} id={id}>
      <span className="rise-mask">
        <span className="rise-inner" data-rise-inner>
          {children}
        </span>
      </span>
    </h2>
  );
}
