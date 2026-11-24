import Image from "next/image";
import Logo from "@/components/Logo";
import synergi from "@/assets/synergi-logo-white.png";
import { company, contactAction, navLinks, offices } from "@/lib/site";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.line}>
            Design and build, landscaping and artificial grass from Doha, with offices in Saudi Arabia, the UAE and
            Lebanon.
          </p>
        </div>

        <nav className={styles.col} aria-label="Footer">
          <h2 className={styles.h}>On this page</h2>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
            <li>
              <a href={contactAction.href}>{contactAction.label}</a>
            </li>
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.h}>Offices</h2>
          <ul>
            {offices.map((office) => (
              <li key={office.country}>{office.country}</li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h2 className={styles.h}>Contact</h2>
          <ul>
            <li>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </li>
            {company.phones.map((phone) => (
              <li key={phone.href}>
                <a href={phone.href}>{phone.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <p className={styles.legal}>
          <span>&copy; 2026 {company.legalName}</span>
          <a className={styles.credit} href="https://synergibpo.com" target="_blank" rel="noopener">
            <span>Designed by</span>
            <Image className={styles.creditLogo} src={synergi} alt="Synergi" width={64} height={20} />
          </a>
        </p>
      </div>
    </footer>
  );
}
