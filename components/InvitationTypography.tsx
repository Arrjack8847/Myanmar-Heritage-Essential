import gsap from "gsap";
import styles from "./InvitationTypography.module.css";

export type InvitationLanguage = "en" | "my";

export interface InvitationTypographyProps {
  /** All wedding details remain real, selectable HTML text. */
  firstName: string;
  secondName: string;
  heading?: string;
  romanticMessage?: string;
  weekday: string;
  weddingDate: string;
  language?: InvitationLanguage;
  /** Set to the hero section's aria-labelledby target when used as its H1. */
  id?: string;
  className?: string;
}

/**
 * Add the typography reveal to the SAME timeline as the architectural arch.
 *
 * @example
 *   opening.addLabel("archReady", 0.65);
 *   addInvitationTypographyReveal(opening, typographyElement, "archReady+=0.15");
 *
 * Nothing is initially hidden in CSS, so content stays readable when JavaScript
 * is unavailable, the animation is skipped, or reduced motion is requested.
 * Call from the parent's gsap.context() and skip when reduced motion is enabled.
 */
export function addInvitationTypographyReveal(
  parent: gsap.core.Timeline,
  element: HTMLElement,
  at: number | string = 0,
): gsap.core.Timeline {
  const get = (part: string) =>
    element.querySelector<HTMLElement>(`[data-typography-part="${part}"]`);

  const reveal = gsap.timeline({ defaults: { ease: "power3.out" } });
  const fade = (part: string, start: number, rise = 0, duration = 0.82) => {
    const target = get(part);
    if (!target) return;
    reveal.fromTo(
      target,
      { autoAlpha: 0, y: rise },
      {
        autoAlpha: 1,
        y: 0,
        duration,
        immediateRender: true,
        clearProps: "opacity,visibility,transform",
      },
      start,
    );
  };

  fade("heading", 0, 0, 0.75);
  fade("first-name", 0.2, 16, 0.85);

  const ampersand = get("ampersand");
  if (ampersand) {
    reveal.fromTo(
      ampersand,
      { autoAlpha: 0, scale: 0.97 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.72,
        immediateRender: true,
        clearProps: "opacity,visibility,transform",
      },
      0.5,
    );
  }

  fade("second-name", 0.8, 16, 0.85);
  fade("message", 1.1, 12, 0.75);
  fade("weekday", 1.4, 8, 0.7);
  fade("date", 1.49, 8, 0.72);

  parent.add(reveal, at);
  return reveal;
}

export default function InvitationTypography({
  firstName,
  secondName,
  heading = "THE WEDDING CELEBRATION OF",
  romanticMessage = "Two hearts, one beautiful beginning",
  weekday,
  weddingDate,
  language = "en",
  id,
  className = "",
}: InvitationTypographyProps) {
  return (
    <div
      className={`relative z-[3] mx-auto flex w-full min-w-0 max-w-[420px] flex-col items-center justify-center px-[clamp(16px,4vw,34px)] py-[clamp(18px,3.2svh,42px)] text-center ${styles.root} ${className}`}
      data-language={language}
      lang={language}
    >
      <p className={styles.heading} data-typography-part="heading">
        {heading}
      </p>

      <h1 className={styles.names} id={id}>
        <span className={styles.name} data-typography-part="first-name">
          {firstName}
        </span>
        <span className={styles.ampersand} data-typography-part="ampersand">
          &amp;
        </span>
        <span className={styles.name} data-typography-part="second-name">
          {secondName}
        </span>
      </h1>

      <p className={styles.message} data-typography-part="message">
        {romanticMessage}
      </p>

      <div className={styles.dateGroup}>
        <p className={styles.weekday} data-typography-part="weekday">
          {weekday}
        </p>
        <time className={styles.date} data-typography-part="date">
          {weddingDate}
        </time>
      </div>
    </div>
  );
}
