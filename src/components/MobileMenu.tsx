"use client";

import { useEffect, useId, useRef, useState } from "react";
import { mainAction, navLinks } from "@/lib/site";
import styles from "./MobileMenu.module.css";

// The phone menu for both headers: a button that opens a full-screen sheet. Esc or any link closes it.
export default function MobileMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={`${styles.root} ${className ?? ""}`}>
      <button
        ref={button}
        className={styles.toggle}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.bars} data-open={open} aria-hidden="true" />
        <span>{open ? "Close" : "Menu"}</span>
      </button>

      <div id={id} className={styles.sheet} hidden={!open}>
        <ul className={styles.links}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a className={styles.action} href={mainAction.href} onClick={() => setOpen(false)}>
          {mainAction.label}
        </a>
      </div>
    </div>
  );
}
