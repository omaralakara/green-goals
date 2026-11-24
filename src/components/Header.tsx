"use client";

import { useEffect, useRef, useState } from "react";
import LangSwitch from "@/components/LangSwitch";
import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import { contactAction, navLinks } from "@/lib/site";
import styles from "./Header.module.css";

// Clear over the hero photograph, then a solid green bar once the page has scrolled.
export default function Header() {
  const [solid, setSolid] = useState(false);
  const top = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mark = top.current;
    if (!mark) return;
    const watch = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting));
    watch.observe(mark);
    return () => watch.disconnect();
  }, []);

  return (
    <>
      <span ref={top} className={styles.top} aria-hidden="true" />
      <header className={styles.header} data-solid={solid || undefined}>
        <div className={styles.inner}>
          <Logo />
          <nav className={styles.nav} aria-label="Main">
            <ul className={styles.links}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a className={styles.link} href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.end}>
            <LangSwitch />
            <a className={styles.action} href={contactAction.href}>
              {contactAction.label}
            </a>
          </div>
          <MobileMenu />
        </div>
      </header>
    </>
  );
}
