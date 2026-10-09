"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Reversible album motion. Isolated to Section 04; no changes to gateway or blessing. */
export default function useJourneyMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = root.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const title = section.querySelector<HTMLElement>("[data-journey-title]");
      if (title) gsap.fromTo(title, { autoAlpha: .62, y: 22 }, {
        autoAlpha: 1, y: 0, ease: "power2.out",
        scrollTrigger: { trigger: title, start: "top 95%", end: "top 58%", scrub: .7 },
      });

      const story = section.querySelector<HTMLElement>("[data-journey-story]");
      const line = section.querySelector<HTMLElement>("[data-gold-progress]");
      if (story && line) {
        gsap.fromTo(line, { scaleY: 0 }, {
          scaleY: 1, transformOrigin: "top center", ease: "none",
          scrollTrigger: { trigger: story, start: "top 84%", end: "bottom 35%", scrub: .75,
            invalidateOnRefresh: true },
        });
      }
      gsap.utils.toArray<HTMLElement>("[data-memory]", section).forEach((chapter, i) => {
        const photo = chapter.querySelector<HTMLElement>("[data-memory-photo]");
        const copy = chapter.querySelector<HTMLElement>("[data-memory-copy]");
        const marker = chapter.querySelector<HTMLElement>("[data-journey-marker]");
        const img = photo?.querySelector<HTMLImageElement>("img");
        if (photo) gsap.fromTo(photo,
          { autoAlpha: .62, y: 32, rotation: i === 0 ? -1.35 : 1.2, scale: .985 },
          { autoAlpha: 1, y: 0, rotation: i === 0 ? -.55 : .65, scale: 1, ease: "power2.out",
            scrollTrigger: { trigger: photo, start: "top 94%", end: "top 57%", scrub: .8 } });
        if (img) gsap.fromTo(img, { yPercent: -2.5, scale: 1.05 }, {
          yPercent: 2.5, scale: 1.05, ease: "none",
          scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: 1.3 } });
        if (copy) gsap.fromTo(copy, { autoAlpha: .58, y: 20 }, {
          autoAlpha: 1, y: 0, ease: "power2.out",
          scrollTrigger: { trigger: copy, start: "top 94%", end: "top 60%", scrub: .7 } });
        if (marker) gsap.fromTo(marker, { autoAlpha: .28, scale: .86 }, {
          autoAlpha: 1, scale: 1, ease: "power2.out",
          scrollTrigger: { trigger: chapter, start: "top 83%", end: "top 47%", scrub: .65 } });
      });

      // The third photograph begins as an ivory print, expands to the full
      // phone viewport, receives editable HTML typography, then gives way
      // to the parchment blessing. No CSS width/height animation.
      const runway = section.querySelector<HTMLElement>("[data-finale-runway]");
      const mount = runway?.querySelector<HTMLElement>("[data-finale-mount]");
      const mat = runway?.querySelector<HTMLElement>("[data-finale-mat]");
      const shade = runway?.querySelector<HTMLElement>("[data-finale-shade]");
      const caption = runway?.querySelector<HTMLElement>("[data-finale-copy]");
      const wash = runway?.querySelector<HTMLElement>("[data-finale-wash]");
      if (runway && mount && mat && shade && caption && wash) {
        gsap.set(mount, { scale: .77, yPercent: 5, transformOrigin: "center center" });
        gsap.set(mat, { opacity: 1 });
        gsap.set(shade, { opacity: 0 });
        gsap.set(caption, { autoAlpha: 0, y: 24 });
        gsap.set(wash, { opacity: 0 });
        const cinematic = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: runway, start: "top top", end: "bottom bottom",
            scrub: .65, invalidateOnRefresh: true,
          },
        });
        cinematic
          .to(mount, { scale: .83, yPercent: 0, duration: 2.5 }, 0)
          .to(mount, { scale: 1, duration: 3 }, 2.5)
          .to(mat, { opacity: 0, duration: 2.4 }, 2.65)
          .to(shade, { opacity: 1, duration: 1.8 }, 5.2)
          .to(caption, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 1.4 }, 5.55)
          .to({}, { duration: 1.1 }, 7.45)
          .to(caption, { autoAlpha: 0, y: -13, duration: .85 }, 8.55)
          .to(wash, { opacity: 1, duration: 1.45 }, 8.55);
      }

      [
        { id: "sky", start: 10, end: -17, point: "[data-journey-title]" },
        { id: "mist", start: -9, end: 15, point: "[data-journey-title]" },
        { id: "exit", start: 12, end: -12, point: "[data-journey-ending]" },
      ].forEach(({ id, start, end, point }) => {
        const layer = section.querySelector<HTMLElement>('[data-journey-atmosphere="' + id + '"]');
        const anchor = section.querySelector<HTMLElement>(point);
        if (layer && anchor) gsap.fromTo(layer, { y: start }, {
          y: end, ease: "none",
          scrollTrigger: { trigger: anchor, start: "top bottom", end: "bottom top", scrub: 1.4 } });
      });
      const botanical = section.querySelector<HTMLElement>("[data-journey-botanical]");
      if (botanical) gsap.fromTo(botanical, { y: 9 }, { y: -13, ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.6 } });
      const ending = section.querySelector<HTMLElement>("[data-journey-ending]");
      if (ending) gsap.fromTo(ending, { autoAlpha: .55, y: 18 }, {
        autoAlpha: 1, y: 0, ease: "power2.out",
        scrollTrigger: { trigger: ending, start: "top 93%", end: "top 57%", scrub: .8 } });
    }, section);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [root]);
}
