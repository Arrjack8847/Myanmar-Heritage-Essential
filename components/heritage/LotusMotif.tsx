import styles from "./LotusMotif.module.css";

/**
 * A lightweight CSS sprite of the already-approved lotus-ornaments.png sheet.
 * Never reloads or duplicates the PNG: marker crops the smallest lotus, divider
 * crops its horizontal central ornament. No new vector or image file is needed.
 */
export default function LotusMotif({ variant = "marker", className = "" }: {
  variant?: "marker" | "divider";
  className?: string;
}) {
  return (
    <span aria-hidden="true"
      className={[styles.motif, variant === "divider" ? styles.divider : styles.marker, className].join(" ")}
    />
  );
}
