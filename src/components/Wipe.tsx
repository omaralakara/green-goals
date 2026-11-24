"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const closed = {
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  bottom: "inset(100% 0% 0% 0%)",
};

type Props = {
  children: ReactNode;
  className?: string;
  /** the edge the photograph opens from */
  from?: keyof typeof closed;
  /** seconds to wait, for photographs that sit in a row */
  delay?: number;
};

// A frame whose photograph wipes open once, the first time it scrolls into view.
// It is the same wipe the hero uses when the project changes. Without JavaScript, or with reduced motion, the photograph is simply there.
export default function Wipe({ children, className, from = "left", delay = 0 }: Props) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = frame.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } })
          .fromTo(
            el,
            { clipPath: closed[from] },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.05, ease: "expo.inOut", clearProps: "clipPath" },
            delay,
          )
          .fromTo(
            el.firstElementChild,
            { scale: 1.12 },
            { scale: 1, duration: 1.5, ease: "expo.out", clearProps: "transform" },
            delay,
          );
      });
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={className}>
      {children}
    </div>
  );
}
