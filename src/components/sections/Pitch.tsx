"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Rise from "@/components/Rise";
import styles from "./Pitch.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// The four layers of a pitch, in the order they go down. The figures are the ones on green-goals.com.
const steps = [
  { name: "Shock pad", text: "Laid first, in the thickness the sport needs." },
  { name: "Grass", text: "Rolled out and seamed by hand. 20 to 60 mm pile for sport, 18 to 50 mm for gardens." },
  { name: "Infill", text: "Washed silica sand and SBR rubber, brushed into the pile." },
  { name: "Lines and testing", text: "Marked out and ready to play. Every grass is laboratory tested." },
];

// The drawing is a full-size pitch seen from above, 10 units to the metre: 105 by 68 m of play inside a 4 m margin.
const W = 1130;
const H = 760;
const STRIPS = 7;
const STRIP = W / STRIPS;
const strips = Array.from({ length: STRIPS }, (_, i) => i);

/** when each step begins on the scene's clock, in seconds */
const AT = { pad: 0, grass: 1.1, infill: 4.3, lines: 5.45, ball: 7 };

// The scene section. When the section comes on screen the scene plays by itself, so a visitor who stops
// scrolling never looks at a half-laid pitch:
// the shock pad slides on, seven rolls of grass unroll, a brush works the infill in and the white lines are
// drawn. It ends on the finished pitch, with the ball on the centre spot. Scrolling back above the section
// resets it, so it plays again on the way down. The drawing is
// written in its finished state, so without the script (or with reduced motion) the finished pitch is shown.
export default function Pitch() {
  const [step, setStep] = useState(0);
  const root = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const current = useRef(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      const build = () => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

        // 1. the shock pad slides across the base
        tl.fromTo(q("[data-pad]"), { attr: { width: 0 } }, { attr: { width: W }, duration: 1 }, AT.pad);

        // 2. the rolls of grass unroll one after another, each from the opposite end to the one before
        strips.forEach((i) => {
          const at = AT.grass + i * 0.36;
          const strip = q(`[data-strip="${i}"]`);
          const roll = q(`[data-roll="${i}"]`);
          const up = i % 2 === 1;
          tl.fromTo(
            strip,
            { attr: up ? { y: H, height: 0 } : { y: 0, height: 0 } },
            { attr: { y: 0, height: H }, duration: 0.9 },
            at,
          );
          // the roll shows only while it is unrolling, and gets thinner as the grass leaves it
          tl.set(roll, { opacity: 1 }, at);
          tl.fromTo(
            roll,
            { attr: up ? { y: H - 18, height: 36 } : { y: -18, height: 36 } },
            { attr: up ? { y: -4, height: 10 } : { y: H - 6, height: 10 }, duration: 0.9, immediateRender: false },
            at,
          );
          tl.set(roll, { opacity: 0 }, at + 0.9);
        });

        // 3. a brush crosses the pitch and leaves the infill behind it
        tl.set(q("[data-brush]"), { opacity: 1 }, AT.infill);
        tl.fromTo(q("[data-brush]"), { attr: { x: -24 } }, { attr: { x: W }, duration: 1, immediateRender: false }, AT.infill);
        tl.fromTo(q("[data-infill]"), { attr: { width: 0 } }, { attr: { width: W }, duration: 1 }, AT.infill);
        tl.set(q("[data-brush]"), { opacity: 0 }, AT.infill + 1);

        // 4. the white lines are drawn, then the spots
        tl.fromTo(q("[data-line]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.035 }, AT.lines);
        tl.fromTo(q("[data-goal]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, AT.lines);
        tl.fromTo(q("[data-spot]"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, AT.lines + 1);

        // the pitch is done: the ball is put on the centre spot, and the scene rests there
        tl.fromTo(
          q("[data-ball]"),
          { x: 565, y: 380, scale: 0, transformOrigin: "50% 50%" },
          { x: 565, y: 380, scale: 1, duration: 0.3, ease: "back.out(2)" },
          AT.ball,
        );
        tl.to({}, { duration: 0.9 });

        // the list beside the scene follows the scene's clock
        tl.eventCallback("onUpdate", () => {
          const t = tl.time();
          const now = t < AT.grass - 0.05 ? 0 : t < AT.infill - 0.05 ? 1 : t < AT.lines - 0.05 ? 2 : 3;
          if (now !== current.current) {
            current.current = now;
            setStep(now);
          }
        });
        return tl;
      };

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          animation: build().timeScale(1.3),
          trigger: scene.current,
          start: "top 62%",
          // play on the way down; leaving back over the top resets it for the next visit
          toggleActions: "play none none reset",
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`section ${styles.turf}`} id="turf" aria-labelledby="turf-title">
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.copy}>
          <Rise id="turf-title" className={`h2 ${styles.title}`}>Artificial grass for pitches and gardens</Rise>
          <p className={`lead ${styles.lead}`}>
            We supply and lay sports and landscape grass for private clients and for Ashghal. This is how a pitch
            goes down.
          </p>

          <ol className={styles.steps}>
            {steps.map((item, i) => (
              <li key={item.name} className={styles.step} data-active={i === step || undefined}>
                <span className={styles.num} aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className={styles.stepName}>{item.name}</h3>
                <p className={styles.stepText}>{item.text}</p>
              </li>
            ))}
          </ol>

        </div>

        <div ref={scene} className={styles.scene}>
          <svg
            className={styles.pitch}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="A football pitch seen from above, laid in four steps: the shock pad, the grass in rolls, the infill, then the white lines"
          >
            <defs>
              <clipPath id="pitch-edge">
                <rect width={W} height={H} rx="12" />
              </clipPath>
              <clipPath id="pitch-pad">
                <rect data-pad width={W} height={H} />
              </clipPath>
              <clipPath id="pitch-infill">
                <rect data-infill width={W} height={H} />
              </clipPath>
              <pattern id="pitch-pad-joints" width="94" height="95" patternUnits="userSpaceOnUse">
                <path d="M94 0V95M0 95H94" fill="none" stroke="#3d4a41" strokeWidth="2" />
              </pattern>
              <pattern id="pitch-grains" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="4" r="1.3" fill="#0e2416" />
                <circle cx="10" cy="11" r="1.3" fill="#f2efe6" />
              </pattern>
              <pattern id="pitch-net" width="6" height="6" patternUnits="userSpaceOnUse">
                <path d="M0 6L6 0M0 0L6 6" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.75" />
              </pattern>
              <linearGradient id="pitch-roll" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0c1610" />
                <stop offset="0.32" stopColor="#3f7a3c" />
                <stop offset="0.5" stopColor="#a5e08a" />
                <stop offset="0.68" stopColor="#3f7a3c" />
                <stop offset="1" stopColor="#0c1610" />
              </linearGradient>
            </defs>

            <g clipPath="url(#pitch-edge)">
              {/* the compacted base */}
              <rect width={W} height={H} fill="#c8b68f" />

              {/* the shock pad, in sheets */}
              <g clipPath="url(#pitch-pad)">
                <rect width={W} height={H} fill="#27312b" />
                <rect width={W} height={H} fill="url(#pitch-pad-joints)" />
              </g>

              {/* seven rolls of grass, in two greens like a mown pitch */}
              {strips.map((i) => (
                <rect
                  key={`strip-${i}`}
                  data-strip={i}
                  x={i * STRIP - 0.5}
                  y="0"
                  width={STRIP + 1}
                  height={H}
                  fill={i % 2 ? "#4b993b" : "#58a946"}
                />
              ))}

              {/* the sand and rubber infill */}
              <rect width={W} height={H} fill="url(#pitch-grains)" opacity="0.28" clipPath="url(#pitch-infill)" />
              <rect data-brush x="-24" y="0" width="24" height={H} fill="#efe7d2" opacity="0" />

              {/* the goals */}
              <rect data-goal x="20" y="343.4" width="20" height="73.2" fill="url(#pitch-net)" stroke="#fff" strokeWidth="2.5" />
              <rect
                data-goal
                x="1090"
                y="343.4"
                width="20"
                height="73.2"
                fill="url(#pitch-net)"
                stroke="#fff"
                strokeWidth="2.5"
              />

              {/* the white lines, to the real proportions */}
              <g className={styles.lines}>
                <rect data-line pathLength={1} x="40" y="40" width="1050" height="680" />
                <line data-line pathLength={1} x1="565" y1="40" x2="565" y2="720" />
                <circle data-line pathLength={1} cx="565" cy="380" r="91.5" />
                <rect data-line pathLength={1} x="40" y="178.5" width="165" height="403" />
                <rect data-line pathLength={1} x="925" y="178.5" width="165" height="403" />
                <rect data-line pathLength={1} x="40" y="288.5" width="55" height="183" />
                <rect data-line pathLength={1} x="1035" y="288.5" width="55" height="183" />
                <path data-line pathLength={1} d="M205 306.9A91.5 91.5 0 0 1 205 453.1" />
                <path data-line pathLength={1} d="M925 306.9A91.5 91.5 0 0 0 925 453.1" />
                <path data-line pathLength={1} d="M50 40A10 10 0 0 1 40 50" />
                <path data-line pathLength={1} d="M1080 40A10 10 0 0 0 1090 50" />
                <path data-line pathLength={1} d="M40 710A10 10 0 0 1 50 720" />
                <path data-line pathLength={1} d="M1090 710A10 10 0 0 0 1080 720" />
              </g>
              <g fill="#fff">
                <circle data-spot cx="565" cy="380" r="5" />
                <circle data-spot cx="150" cy="380" r="5" />
                <circle data-spot cx="980" cy="380" r="5" />
              </g>

              {/* the rolls themselves, on top of everything while they unroll */}
              {strips.map((i) => (
                <rect
                  key={`roll-${i}`}
                  data-roll={i}
                  x={i * STRIP + 4}
                  y="0"
                  width={STRIP - 8}
                  height="36"
                  rx="14"
                  fill="url(#pitch-roll)"
                  opacity="0"
                />
              ))}

              {/* the ball */}
              <g data-ball transform="translate(565 380)">
                <ellipse cx="3" cy="5" rx="13" ry="11" fill="#0e2416" opacity="0.35" />
                <g>
                  <circle r="13" fill="#fff" stroke="#101a13" strokeWidth="1.5" />
                  <path d="M0 -5.5L5.2 -1.7L3.2 4.5H-3.2L-5.2 -1.7Z" fill="#101a13" />
                  <path d="M0 -5.5V-13M5.2 -1.7L12.4 -4M3.2 4.5L7.6 10.5M-3.2 4.5L-7.6 10.5M-5.2 -1.7L-12.4 -4" stroke="#101a13" strokeWidth="1.5" />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
