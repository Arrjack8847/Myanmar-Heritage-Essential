"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Continuous parchment bridge and chapter reveal, without duplicated scenery. */
export default function RoyalUnfoldTransition() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const story = element?.closest<HTMLElement>(".royal-story");
    const intro = story?.querySelector<HTMLElement>(".heritage-story__intro");
    if (!element || !story || !intro || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: intro, start: "bottom bottom", end: "bottom 22%",
          scrub: 0.55, invalidateOnRefresh: true,
        },
      })
        .fromTo(".royal-unfold__sigil",
          { autoAlpha: 0, y: 18, scale: 0.84 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "none" }, 0)
        .to(".royal-unfold__sigil",
          { autoAlpha: 0, y: -20, duration: 0.5, ease: "none" }, 0.5);

      // The scene is exactly one viewport tall. Reveal each editorial group
      // as it enters rather than animating the full section (which shifts seams).
      for (const selector of [
        ".ceremony-one-screen__motif",
        ".ceremony-one-screen__eyebrow",
        ".ceremony-one-screen__heading",
        ".ceremony-one-screen__date",
        ".ceremony-one-screen__details",
      ]) {
        const node = story.querySelector<HTMLElement>(selector);
        if (!node) continue;
        gsap.fromTo(node,
          { autoAlpha: 0, y: 17 },
          {
            autoAlpha: 1, y: 0, ease: "none",
            scrollTrigger: {
              trigger: node, start: "top 96%", end: "top 74%",
              scrub: 0.45, invalidateOnRefresh: true,
            },
          },
        );
      }
    }, story);

    return () => context.revert();
  }, []);

  return (
    <div className="royal-unfold" ref={ref} aria-hidden="true">
      <div className="royal-unfold__veil" />
      <div className="royal-unfold__sigil">
        <span className="royal-unfold__line" />
        <svg viewBox="0 0 66 48" width="66" height="48" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" strokeLinecap="round">
            <path d="M33 34C24 27 26 16 33 8c7 8 9 19 0 26Z" />
            <path d="M31 35C18 33 13 24 13 17c9 1 18 7 20 17" />
            <path d="M35 35c13-2 18-11 18-18-9 1-18 7-20 17" />
            <path d="M33 37C21 41 12 36 7 30c12-4 20 0 26 7Z" />
            <path d="M33 37c12 4 21-1 26-7-12-4-20 0-26 7Z" />
            <path d="M17 43h32M33 4v3" />
          </g>
        </svg>
        <span className="royal-unfold__line" />
      </div>
    </div>
  );
}
