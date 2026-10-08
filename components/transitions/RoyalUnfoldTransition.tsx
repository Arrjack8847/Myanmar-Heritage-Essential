"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * A short, mist-soft bridge hides the hard boundary between two independent
 * image crops. The small gold lotus moves with scroll instead of repeating
 * the oversized hero crown or adding a third floral composition.
 */
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
          trigger: intro,
          start: "bottom bottom",
          end: "bottom 22%",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(".royal-unfold__sigil",
          { autoAlpha: 0, y: 22, scale: 0.85 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "none" }, 0)
        .to(".royal-unfold__sigil",
          { autoAlpha: 0, y: -26, duration: 0.5, ease: "none" }, 0.5);
      
      // Ceremony details appear individually after the bridge, not by moving
      // the ENTIRE inner page (which caused the visible sliding card seam).
      for (const selector of [
        ".ceremony-heading", ".ceremony-date",
        ".ceremony-timeline", ".ceremony-signoff",
      ]) {
        const node = story.querySelector<HTMLElement>(selector);
        if (!node) continue;
        gsap.fromTo(node, { autoAlpha: 0, y: 21 }, {
          autoAlpha: 1, y: 0, ease: "none",
          scrollTrigger: {
            trigger: node, start: "top 94%", end: "top 67%",
            scrub: 0.45, invalidateOnRefresh: true,
          },
        });
      }

      const timeline = story.querySelector<HTMLElement>(".ceremony-timeline");
      const thread = story.querySelector<HTMLElement>(".ceremony-timeline__thread");
      if (timeline && thread) {
        gsap.fromTo(thread, { scaleY: 0, transformOrigin: "top center" }, {
          scaleY: 1, ease: "none",
          scrollTrigger: {
            trigger: timeline, start: "top 80%", end: "bottom 73%",
            scrub: 0.65, invalidateOnRefresh: true,
          },
        });
      }

      story.querySelectorAll<HTMLElement>(".ceremony-timeline__event").forEach((event) => {
        gsap.fromTo(event, { autoAlpha: 0, x: 13 }, {
          autoAlpha: 1, x: 0, ease: "none",
          scrollTrigger: {
            trigger: event, start: "top 94%", end: "top 76%",
            scrub: 0.4,
          },
        });
      });
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
