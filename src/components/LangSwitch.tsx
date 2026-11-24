import styles from "./LangSwitch.module.css";

// The language button in the header and the phone menu. English is the only version so far: the button is
// in place and does nothing yet. When the Arabic pages exist, turn it into a link to them.
export default function LangSwitch({ className }: { className?: string }) {
  return (
    <button
      className={`${styles.lang} ${className ?? ""}`}
      type="button"
      lang="ar"
      dir="rtl"
      title="Arabic version coming soon"
    >
      العربية
    </button>
  );
}
