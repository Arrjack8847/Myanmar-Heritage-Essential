"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Boundary-spanning ornament: the hero can remain one screen tall and clipped
 * while this sibling layer crosses into the celebration. No scroll hijacking,
 * no artificial page pinning, no second copy of the hero card.
 */
export default function RoyalUnfoldTransition() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const story = element?.closest<HTMLElement>(".royal-story");
    if (!element || !story || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const hero = story.querySelector<HTMLElement>("#welcome");
    const page = story.querySelector<HTMLElement>(".ceremony-page");
    if (!hero || !page) return;

    const context = gsap.context(() => {
      const ornament = element.querySelector<HTMLElement>(".royal-unfold__ornament");
      const thread = element.querySelector<HTMLElement>(".royal-unfold__thread");
      if (ornament && thread) {
        // Swipe position, not time, controls this entirely reversible handoff.
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        });
        timeline
          .fromTo(ornament, {
            autoAlpha: 0, y: 105, scale: 0.88,
          }, {
            autoAlpha: 1, y: -10, scale: 1,
            duration: 0.48, ease: "none",
          }, 0)
          .to(ornament, {
            autoAlpha: 0.25, y: -88,
            duration: 0.52, ease: "none",
          }, 0.48)
          .fromTo(thread, { scaleY: 0, transformOrigin: "top center" },
            { scaleY: 1, duration: 0.7, ease: "none" }, 0.15)
          .fromTo(page, { opacity: 0.6, y: 63 },
            { opacity: 1, y: 0, duration: 0.65, ease: "none" }, 0.35);
      }

      // The printed date and ceremony are real HTML, revealed as they approach
      // the viewport. Scroll back to reverse all the editorial reveals.
      const chapters = [
        ".ceremony-heading",
        ".ceremony-date",
        ".ceremony-timeline",
        ".ceremony-signoff",
      ];
      chapters.forEach((selector) => {
        const node = story.querySelector<HTMLElement>(selector);
        if (!node) return;
        gsap.fromTo(node,
          { autoAlpha: 0, y: 25 },
          {
            autoAlpha: 1, y: 0, ease: "none",
            scrollTrigger: {
              trigger: node,
              start: "top 96%",
              end: "top 66%",
              scrub: 0.45,
              invalidateOnRefresh: true,
            },
          });
      });

      const timeline = story.querySelector<HTMLElement>(".ceremony-timeline");
      const line = story.querySelector<HTMLElement>(".ceremony-timeline__thread");
      if (timeline && line) {
        gsap.fromTo(line, { scaleY: 0, transformOrigin: "top center" }, {
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

      const floral = story.querySelectorAll<HTMLElement>(".ceremony-scene__flower");
      floral.forEach((flower, index) => {
        gsap.fromTo(flower, { x: index ? 24 : -24, y: 30 }, {
          x: 0, y: 0, ease: "none",
          scrollTrigger: {
            trigger: "#celebration", start: "top 82%", end: "top 20%",
            scrub: 0.8,
          },
        });
      });
    }, story);

    return () => context.revert();
  }, []);

  return (
    <div className="royal-unfold" ref={ref} aria-hidden="true">
      <div className="royal-unfold__thread" />
      <div className="royal-unfold__ornament">
        <Image
          src="/heritage/ceremony/royal-transition-ornament.png"
          alt="" fill sizes="(max-width: 759px) 150px, 200px"
        />
      </div>
    </div>
  );
}
