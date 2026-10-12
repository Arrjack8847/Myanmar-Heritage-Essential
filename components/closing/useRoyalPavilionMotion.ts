"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Reversible, transform-only motion.
 * Never pins the scroll or transforms readable content after its reveal.
 */
export default function useRoyalPavilionMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = root.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const scope = gsap.context(() => {
      const drift = (name: string, start: gsap.TweenVars, finish: gsap.TweenVars) => {
        const element = section.querySelector<HTMLElement>('[data-pavilion="' + name + '"]');
        if (!element) return;
        gsap.fromTo(element, start, {
          ...finish,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.3,
            invalidateOnRefresh: true,
          },
        });
      };
      // Architecture settles as it comes into view; columns remain outside the text.
      drift("arch", { y: -26, opacity: 0.6 }, { y: 8, opacity: 1 });
      drift("pillar-left", { x: -22, opacity: 0.55 }, { x: 0, opacity: 1 });
      drift("pillar-right", { x: 22, opacity: 0.55 }, { x: 0, opacity: 1 });
      drift("silk", { y: -9 }, { y: 13 });
      drift("flower-left", { x: -8, y: 8 }, { x: 0, y: -12 });
      drift("flower-right", { x: 8, y: 8 }, { x: 0, y: -12 });
      drift("garland-left", { rotation: -1.3, transformOrigin: "50% 0%" }, { rotation: 1.2 });
      drift("garland-right", { rotation: 1.3, transformOrigin: "50% 0%" }, { rotation: -1.2 });
      drift("pendant", { y: -12, rotation: -1, transformOrigin: "50% 0%" }, { y: 8, rotation: 1 });
      drift("scene", { y: 18 }, { y: -18 });
      drift("boat", { x: -18 }, { x: 20 });
      drift("lotus-left", { y: 18 }, { y: -9 });
      drift("lotus-right", { y: 18 }, { y: -9 });
      drift("petals", { x: -12, y: 12 }, { x: 15, y: -22 });

      // Editor-friendly wedding text remains visible on a static page.
      for (const item of gsap.utils.toArray<HTMLElement>(
        "[data-blessing-intro-item], [data-blessing-reveal]", section
      )) {
        gsap.fromTo(item, { autoAlpha: 0.3, y: 17 }, {
          autoAlpha: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top 95%",
            end: "top 77%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      }
      const bridge = section.querySelector<HTMLElement>("[data-blessing-entry]");
      if (bridge) {
        gsap.fromTo(bridge, { opacity: 0.48 }, {
          opacity: 0.05,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "top 50%", scrub: 0.8 },
        });
      }
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });
    return () => {
      window.removeEventListener("load", refresh);
      scope.revert();
    };
  }, [root]);
}
