"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * JN-W01 Section 04 — scoped, reversible native-scroll storytelling.
 * All content is readable before hydration, and no pin-spacers or scroll hijack
 * are introduced alongside the Hero, Ceremony and Royal Gateway controllers.
 */
export default function useJourneyMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = root.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const story = section.querySelector<HTMLElement>("[data-journey-story]");
      const path = section.querySelector<SVGPathElement>("[data-journey-thread]");
      if (story && path) {
        const length = path.getTotalLength();
        // All gold ornaments stay as separate responsive elements; only the
        // thread is stroke-drawn. In reverse scroll it retracts naturally.
        gsap.fromTo(path,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: story,
              start: "top 85%",
              end: "bottom 30%",
              scrub: 1.05,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      const title = section.querySelector<HTMLElement>("[data-journey-title]");
      if (title) {
        gsap.fromTo(title, { autoAlpha: 0.2, y: 28 },
          { autoAlpha: 1, y: 0, ease: "power2.out",
            scrollTrigger: { trigger: title, start: "top 95%", end: "top 57%", scrub: 0.7 } });
      }

      const chapters = gsap.utils.toArray<HTMLElement>("[data-memory]");
      chapters.forEach((chapter, index) => {
        const photo = chapter.querySelector<HTMLElement>("[data-memory-photo]");
        const copy = chapter.querySelector<HTMLElement>("[data-memory-copy]");
        const marker = section.querySelector<HTMLElement>(`[data-journey-marker="${index}"]`);
        if (photo) {
          gsap.fromTo(photo,
            { autoAlpha: 0.28, y: 45, rotation: index === 1 ? 2.1 : -1.6, scale: 0.97 },
            {
              autoAlpha: 1, y: 0, rotation: 0, scale: 1, ease: "power2.out",
              scrollTrigger: { trigger: chapter, start: "top 91%", end: "top 49%", scrub: 0.95 },
            }
          );
        }
        if (copy) {
          gsap.fromTo(copy, { autoAlpha: 0.1, y: 32 },
            {
              autoAlpha: 1, y: 0, ease: "power2.out",
              scrollTrigger: { trigger: copy, start: "top 97%", end: "top 68%", scrub: 0.7 },
            }
          );
        }
        if (marker) {
          gsap.fromTo(marker, { autoAlpha: 0.25, scale: 0.78 },
            {
              autoAlpha: 1, scale: 1, ease: "power2.out",
              scrollTrigger: { trigger: chapter, start: "top 78%", end: "top 44%", scrub: 0.85 },
            }
          );
        }
      });

      const botanical = gsap.utils.toArray<HTMLElement>("[data-journey-botanical]");
      botanical.forEach((piece, index) => {
        gsap.fromTo(piece, { y: index % 2 ? -14 : 19 }, {
          y: index % 2 ? 21 : -17, ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.8 },
        });
      });

      const flourish = section.querySelector<HTMLElement>("[data-journey-flourish]");
      const ending = section.querySelector<HTMLElement>("[data-journey-ending]");
      if (flourish && ending) {
        gsap.fromTo(flourish, { autoAlpha: 0.15, scale: 0.91 }, {
          autoAlpha: 1, scale: 1, ease: "power2.out",
          scrollTrigger: { trigger: ending, start: "top 89%", end: "top 58%", scrub: 0.8 },
        });
      }
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });
    ScrollTrigger.refresh();
    return () => {
      window.removeEventListener("load", refresh);
      context.revert();
    };
  }, [root]);
}
