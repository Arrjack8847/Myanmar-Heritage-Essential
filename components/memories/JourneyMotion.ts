"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll animations stay scoped to Section 04. No pinning, horizontal scroll,
 * or body-level controls compete with the Royal Gateway scene before it.
 */
export default function useJourneyMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = root.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const title = section.querySelector<HTMLElement>("[data-journey-title]");
      if (title) {
        gsap.fromTo(title, { autoAlpha: .45, y: 25 }, {
          autoAlpha: 1, y: 0, ease: "power2.out",
          scrollTrigger: { trigger: title, start: "top 93%", end: "top 55%", scrub: .7 },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-memory]").forEach((chapter) => {
        const photo = chapter.querySelector<HTMLElement>("[data-memory-photo]");
        const copy = chapter.querySelector<HTMLElement>("[data-memory-copy]");
        const progress = chapter.querySelector<HTMLElement>("[data-journey-progress]");
        const marker = chapter.querySelector<HTMLElement>("[data-journey-marker]");

        if (progress) {
          gsap.fromTo(progress, { scaleY: 0 }, {
            scaleY: 1, ease: "none",
            scrollTrigger: { trigger: chapter, start: "top 83%", end: "bottom 24%", scrub: .9 },
          });
        }
        if (marker) {
          gsap.fromTo(marker, { autoAlpha: .2, scale: .82 }, {
            autoAlpha: 1, scale: 1, ease: "power2.out",
            scrollTrigger: { trigger: chapter, start: "top 81%", end: "top 44%", scrub: .7 },
          });
        }
        if (photo) {
          gsap.fromTo(photo, { autoAlpha: .55, y: 30, scale: .985 }, {
            autoAlpha: 1, y: 0, scale: 1, ease: "power2.out",
            scrollTrigger: { trigger: photo, start: "top 94%", end: "top 55%", scrub: .8 },
          });
        }
        if (copy) {
          gsap.fromTo(copy, { autoAlpha: .45, y: 20 }, {
            autoAlpha: 1, y: 0, ease: "power2.out",
            scrollTrigger: { trigger: copy, start: "top 93%", end: "top 63%", scrub: .65 },
          });
        }
      });

      // Parallax only on the large atmosphere layers, never the full section.
      [
        { id: "sky", from: 11, to: -20, trigger: "[data-journey-title]" },
        { id: "mist", from: -10, to: 21, trigger: "[data-journey-title]" },
        { id: "exit", from: 15, to: -16, trigger: "[data-journey-ending]" },
      ].forEach(({ id, from, to, trigger }) => {
        const layer = section.querySelector<HTMLElement>(
          '[data-journey-atmosphere="' + id + '"]'
        );
        const anchor = section.querySelector<HTMLElement>(trigger);
        if (layer && anchor) {
          gsap.fromTo(layer, { y: from }, {
            y: to, ease: "none",
            scrollTrigger: { trigger: anchor, start: "top bottom", end: "bottom top", scrub: 1.5 },
          });
        }
      });

      const botanical = section.querySelector<HTMLElement>("[data-journey-botanical]");
      if (botanical) {
        gsap.fromTo(botanical, { y: 12 }, { y: -17, ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.6 } });
      }
      const ending = section.querySelector<HTMLElement>("[data-journey-ending]");
      if (ending) {
        gsap.fromTo(ending, { autoAlpha: .52, y: 22 }, {
          autoAlpha: 1, y: 0, ease: "power2.out",
          scrollTrigger: { trigger: ending, start: "top 90%", end: "top 58%", scrub: .8 },
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
