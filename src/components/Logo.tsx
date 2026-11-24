import Image from "next/image";
import logo from "@/assets/logo.png";
import { company } from "@/lib/site";
import styles from "./Logo.module.css";

// The client's own oval logo beside the name in type, so the name stays readable at header size.
export default function Logo({ className }: { className?: string }) {
  return (
    <a className={`${styles.logo} ${className ?? ""}`} href="#top">
      <Image className={styles.mark} src={logo} alt="" width={70} height={48} preload />
      <span className={styles.name}>{company.name}</span>
    </a>
  );
}
