"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./ScrollDiscoveryIndicator.module.css";

const REVEAL_EVENT = "jn:scroll-discovery-revealed";

export interface ScrollDiscoveryIndicatorProps {
  /** ID of the destination section; with or without the leading #. */
  targetId: string;
  label?: string;
  supportingText?: string;
  className?: string;
  /** Set true when the parent hero owns the GSAP entrance timeline. */
  timelineControlled?: boolean;
}

/**
 * Adds a staggered, 1.16-second entrance to the parent's existing hero timeline.
 * The component remains visible without JavaScript or when reduced motion is set.
 *
 * In the parent:
 *   addScrollDiscoveryReveal(opening, indicator, "archReady+=2.78");
 */
export function addScrollDiscoveryReveal(
  parent: gsap.core.Timeline,
  element: HTMLElement,
  at: number | string,
): gsap.core.Timeline {
  const part = (name: string) =>
    element.querySelector<HTMLElement>(`[data-scroll-part="${name}"]`);

  const reveal = gsap.timeline({ defaults: { ease: "power2.out" } });

  function enter(name: string, time: number, duration: number, rise = 0) {
    const node = part(name);
    if (!node) return;
    reveal.fromTo(
      node,
      { autoAlpha: 0, y: rise },
      {
        autoAlpha: 1,
        y: 0,
        duration,
        immediateRender: true,
        clearProps: "opacity,visibility,transform",
      },
      time,
    );
  }

  enter("label", 0, 0.5, 5);
  const line = part("line");
  if (line) {
    reveal.fromTo(
      line,
      { autoAlpha: 0, scaleY: 0, transformOrigin: "top center" },
      {
        autoAlpha: 1,
        scaleY: 1,
        duration: 0.55,
        ease: "power1.inOut",
        immediateRender: true,
        clearProps: "opacity,visibility,transform,transformOrigin",
      },
      0.22,
    );
  }
  enter("arrow", 0.56, 0.34, -3);
  enter("lotus", 0.76, 0.38, 3);
  enter("supporting", 0.85, 0.3, 2);

  reveal.call(
    () => element.dispatchEvent(new Event(REVEAL_EVENT)),
    undefined,
    1.16,
  );
  parent.add(reveal, at);
  return reveal;
}

export default function ScrollDiscoveryIndicator({
  targetId,
  label = "SCROLL TO DISCOVER",
  supportingText = "A beautiful story awaits",
  className = "",
  timelineControlled = false,
}: ScrollDiscoveryIndicatorProps) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [inHero, setInHero] = useState(true);
  const destination = targetId.replace(/^#/, "").trim();

  useEffect(() => {
    const element = anchorRef.current;
    if (!element) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const arrow = element.querySelector<SVGSVGElement>("[data-scroll-idle-arrow]");
    const hero = element.closest<HTMLElement>(".hero") ?? element.closest<HTMLElement>("section");
    let visible = true;
    let introduced = !timelineControlled;

    // The animated element is separate from the wrapper revealed by the hero
    // timeline, so the two tweens never fight over the same transform.
    const idle = arrow
      ? gsap.to(arrow, {
          y: 5,
          opacity: 0.76,
          duration: 1.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        })
      : null;

    const syncMotion = () => {
      if (media.matches) {
        idle?.pause(0);
        if (arrow) gsap.set(arrow, { clearProps: "transform,opacity" });
      } else if (visible && introduced) {
        idle?.play();
      } else {
        idle?.pause();
      }
    };

    const onReveal = () => {
      introduced = true;
      syncMotion();
    };

    element.addEventListener(REVEAL_EVENT, onReveal);
    media.addEventListener("change", syncMotion);

    const observer = hero && "IntersectionObserver" in window
      ? new IntersectionObserver(
          ([entry]) => {
            if (!entry) return;
            visible =
              entry.isIntersecting &&
              entry.intersectionRatio > 0.12 &&
              entry.boundingClientRect.bottom > window.innerHeight * 0.2;
            setInHero(visible);
            syncMotion();
          },
          { threshold: [0, 0.12, 0.2] },
        )
      : null;

    if (hero && observer) observer.observe(hero);
    syncMotion();

    return () => {
      observer?.disconnect();
      element.removeEventListener(REVEAL_EVENT, onReveal);
      media.removeEventListener("change", syncMotion);
      idle?.kill();
    };
  }, [timelineControlled]);

  return (
    <a
      ref={anchorRef}
      data-scroll-discovery
      data-visible={inHero ? "true" : "false"}
      href={`#${destination}`}
      aria-label="Scroll to the wedding story"
      tabIndex={inHero ? 0 : -1}
      className={`${styles.root} ${className}`.trim()}
    >
      <span className={styles.label} data-scroll-part="label">
        {label}
      </span>
      <span className={styles.line} data-scroll-part="line" aria-hidden="true" />
      <span className={styles.arrow} data-scroll-part="arrow" aria-hidden="true">
        <svg
          data-scroll-idle-arrow
          viewBox="0 0 16 13"
          width="16"
          height="13"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m3 3.5 5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={styles.lotus} data-scroll-part="lotus" aria-hidden="true">
        <svg viewBox="0 0 66 25" width="66" height="25" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M33 20C26 16 27 8 33 2c6 6 7 14 0 18Z" />
            <path d="M32.7 20C23.5 20 18 14.5 17 8c7.4 1.2 13.6 6.1 15.7 12Z" />
            <path d="M33.3 20C42.5 20 48 14.5 49 8c-7.4 1.2-13.6 6.1-15.7 12Z" />
            <path d="M33 21C22 23 14 20 10 15c7-2 13-1 18 3" />
            <path d="M33 21c11 2 19-1 23-6-7-2-13-1-18 3" />
            <path d="M22 23h22" />
          </g>
          <path d="M3 22h13m34 0h13" stroke="currentColor" strokeWidth=".65" opacity=".6" />
        </svg>
      </span>
      {supportingText && (
        <span className={styles.supporting} data-scroll-part="supporting">
          {supportingText}
        </span>
      )}
    </a>
  );
}
