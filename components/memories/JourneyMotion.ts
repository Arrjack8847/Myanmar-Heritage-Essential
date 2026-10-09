"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Calm, reversible album motion scoped to Section 04 only. */
export default function useJourneyMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = root.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const title = section.querySelector<HTMLElement>("[data-journey-title]");
      if (title) {
        const eyebrow = title.querySelector<HTMLElement>("[data-journey-eyebrow]");
        const first = title.querySelector<HTMLElement>("[data-journey-title-main]");
        const accent = title.querySelector<HTMLElement>("[data-journey-title-accent]");
        const lead = title.querySelector<HTMLElement>("[data-journey-lead]");

        if (eyebrow) gsap.fromTo(eyebrow, { autoAlpha: .5, y: 10 }, {
          autoAlpha: 1, y: 0, ease: "power2.out",
          scrollTrigger: { trigger: title, start: "top 93%", end: "top 74%", scrub: .65 },
        });
        if (first) gsap.fromTo(first, { autoAlpha: .55, y: 21 }, {
          autoAlpha: 1, y: 0, ease: "power2.out",
          scrollTrigger: { trigger: title, start: "top 85%", end: "top 58%", scrub: .65 },
        });
        if (accent) gsap.fromTo(accent, { autoAlpha: .5, y: 27 }, {
          autoAlpha: 1, y: 0, ease: "power2.out",
          scrollTrigger: { trigger: title, start: "top 79%", end: "top 47%", scrub: .75 },
        });
        if (lead) gsap.fromTo(lead, { autoAlpha: .52, y: 13 }, {
          autoAlpha: 1, y: 0, ease: "power2.out",
          scrollTrigger: { trigger: title, start: "top 72%", end: "top 39%", scrub: .75 },
        });
      }

      const story = section.querySelector<HTMLElement>("[data-journey-story]");
      const line = section.querySelector<HTMLElement>("[data-gold-progress]");
      if (story && line) {
        gsap.fromTo(line, { scaleY: 0 }, {
          scaleY: 1, transformOrigin: "top center", ease: "none",
          scrollTrigger: {
            trigger: story, start: "top 86%", end: "bottom 34%", scrub: .7,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-memory]", section).forEach((chapter, i) => {
        const photo = chapter.querySelector<HTMLElement>("[data-memory-photo]");
        const copy = chapter.querySelector<HTMLElement>("[data-memory-copy]");
        const marker = chapter.querySelector<HTMLElement>("[data-journey-marker]");
        const img = photo?.querySelector<HTMLImageElement>("img");
        if (photo) gsap.fromTo(photo,
          { autoAlpha: .68, y: 30, rotation: i === 0 ? -1.55 : 1.3, scale: .982 },
          {
            autoAlpha: 1, y: 0, rotation: i === 0 ? -.5 : .58, scale: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: photo, start: "top 95%", end: "top 56%", scrub: .75 },
          });
        if (img) gsap.fromTo(img, { yPercent: -2, scale: 1.045 }, {
          yPercent: 2, scale: 1.045, ease: "none",
          scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: 1.4 },
        });
        if (copy) gsap.fromTo(copy, { autoAlpha: .55, y: 18 }, {
          autoAlpha: 1, y: 0, ease: "power2.out",
          scrollTrigger: { trigger: copy, start: "top 93%", end: "top 62%", scrub: .7 },
        });
        if (marker) gsap.fromTo(marker, { autoAlpha: .32, scale: .9 }, {
          autoAlpha: 1, scale: 1, ease: "power2.out",
          scrollTrigger: { trigger: chapter, start: "top 82%", end: "top 48%", scrub: .65 },
        });
      });

      // One sticky, transform-only expansion. The couple's original image is
      // never changed; its paper mount yields to the immersive final frame.
      const runway = section.querySelector<HTMLElement>("[data-finale-runway]");
      const mount = runway?.querySelector<HTMLElement>("[data-finale-mount]");
      const mat = runway?.querySelector<HTMLElement>("[data-finale-mat]");
      const shade = runway?.querySelector<HTMLElement>("[data-finale-shade]");
      const caption = runway?.querySelector<HTMLElement>("[data-finale-copy]");
      const wash = runway?.querySelector<HTMLElement>("[data-finale-wash]");
      if (runway && mount && mat && shade && caption && wash) {
        gsap.set(mount, { scale: .79, yPercent: 4, transformOrigin: "center center" });
        gsap.set(mat, { opacity: 1 });
        gsap.set(shade, { opacity: 0 });
        gsap.set(caption, { autoAlpha: 0, y: 23 });
        gsap.set(wash, { opacity: 0 });

        gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: runway, start: "top top", end: "bottom bottom",
            scrub: .7, invalidateOnRefresh: true,
          },
        })
          .to(mount, { scale: .84, yPercent: 0, duration: 2.3 }, 0)
          .to(mount, { scale: 1, duration: 2.8 }, 2.3)
          .to(mat, { opacity: 0, duration: 2.3 }, 2.5)
          .to(shade, { opacity: 1, duration: 1.6 }, 5.1)
          .to(caption, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 1.45 }, 5.45)
          .to({}, { duration: 1.15 }, 7.35)
          .to(caption, { autoAlpha: 0, y: -12, duration: .8 }, 8.5)
          .to(wash, { opacity: 1, duration: 1.5 }, 8.5);
      }

      [
        { id: "sky", start: 10, end: -16, point: "[data-journey-title]" },
        { id: "mist", start: -9, end: 15, point: "[data-journey-title]" },
        { id: "exit", start: 12, end: -12, point: "[data-journey-ending]" },
      ].forEach(({ id, start, end, point }) => {
        const layer = section.querySelector<HTMLElement>('[data-journey-atmosphere="' + id + '"]');
        const anchor = section.querySelector<HTMLElement>(point);
        if (layer && anchor) gsap.fromTo(layer, { y: start }, {
          y: end, ease: "none",
          scrollTrigger: { trigger: anchor, start: "top bottom", end: "bottom top", scrub: 1.5 },
        });
      });
      const botanical = section.querySelector<HTMLElement>("[data-journey-botanical]");
      if (botanical) gsap.fromTo(botanical, { y: 10 }, {
        y: -13, ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.6 },
      });
      const ending = section.querySelector<HTMLElement>("[data-journey-ending]");
      if (ending) gsap.fromTo(ending, { autoAlpha: .58, y: 16 }, {
        autoAlpha: 1, y: 0, ease: "power2.out",
        scrollTrigger: { trigger: ending, start: "top 93%", end: "top 60%", scrub: .7 },
      });
    }, section);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [root]);
}
