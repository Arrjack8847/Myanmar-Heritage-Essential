"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Royal Chronicle: scroll-native, reversible motion scoped to Section 04.
 * No scroll-jacking, forced snapping, animated layout properties or pinned
 * individual chapters. Still content remains visible when JS/motion is off.
 */
export default function useJourneyMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = root.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const intro = section.querySelector<HTMLElement>("[data-chronicle-intro]");
      const mist = section.querySelector<HTMLElement>("[data-chronicle-entry]");
      const crest = section.querySelector<HTMLElement>("[data-chronicle-crest]");
      const story = section.querySelector<HTMLElement>("[data-chronicle-story]");
      const thread = section.querySelector<HTMLElement>("[data-chronicle-thread]");

      if (mist) {
        gsap.fromTo(mist, { opacity: 0.28, y: 28 }, {
          opacity: 0.92, y: 0, ease: "none",
          scrollTrigger: {
            trigger: section, start: "top bottom", end: "top 30%", scrub: 0.8,
          },
        });
      }

      if (intro) {
        if (crest) {
          gsap.fromTo(crest, { autoAlpha: 0.6, y: 23, scale: 0.96 }, {
            autoAlpha: 1, y: 0, scale: 1, ease: "power2.out",
            scrollTrigger: {
              trigger: intro, start: "top 92%", end: "top 54%", scrub: 0.75,
            },
          });
        }
        gsap.utils.toArray<HTMLElement>("[data-chronicle-reveal]", intro).forEach((el, i) => {
          gsap.fromTo(el, { autoAlpha: 0.42, y: 17 + i * 3 }, {
            autoAlpha: 1, y: 0, ease: "power2.out",
            scrollTrigger: {
              trigger: intro,
              start: "top " + (85 - i * 6) + "%",
              end: "top " + (49 - i * 6) + "%",
              scrub: 0.65,
            },
          });
        });
      }

      if (story && thread) {
        // Reveal the ornamental vine from top to bottom without squashing it.
        gsap.fromTo(thread, { clipPath: "inset(0 0 100% 0)" }, {
          clipPath: "inset(0 0 0% 0)", ease: "none",
          scrollTrigger: {
            trigger: story, start: "top 76%", end: "bottom 43%",
            scrub: 0.85, invalidateOnRefresh: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-chronicle-chapter]", section)
        .forEach((chapter) => {
          const photo = chapter.querySelector<HTMLElement>("[data-chronicle-photo]");
          const copy = chapter.querySelector<HTMLElement>("[data-chronicle-copy]");
          const marker = chapter.querySelector<HTMLElement>("[data-chronicle-marker]");
          const photograph = photo?.querySelector<HTMLImageElement>(".photoWindow img")
            ?? photo?.querySelector<HTMLImageElement>("img");

          if (photo) {
            gsap.fromTo(photo, { autoAlpha: 0.7, y: 38, scale: 0.97 }, {
              autoAlpha: 1, y: 0, scale: 1, ease: "power2.out",
              scrollTrigger: {
                trigger: chapter, start: "top 88%", end: "top 46%", scrub: 0.8,
              },
            });
          }
          if (copy) {
            gsap.fromTo(copy, { autoAlpha: 0.48, y: 28 }, {
              autoAlpha: 1, y: 0, ease: "power2.out",
              scrollTrigger: {
                trigger: chapter, start: "top 78%", end: "top 38%", scrub: 0.75,
              },
            });
          }
          if (marker) {
            gsap.fromTo(marker, { autoAlpha: 0.4, scale: 0.87 }, {
              autoAlpha: 1, scale: 1, ease: "power2.out",
              scrollTrigger: {
                trigger: chapter, start: "top 78%", end: "top 40%", scrub: 0.6,
              },
            });
          }
          // Move only the photo within its clipping window, not its gold frame.
          if (photograph) {
            gsap.fromTo(photograph,
              { scale: 1.06, yPercent: -1.2 },
              { scale: 1.06, yPercent: 1.2, ease: "none",
                scrollTrigger: {
                  trigger: chapter, start: "top bottom", end: "bottom top", scrub: 1.5,
                },
              });
          }
        });

      gsap.utils.toArray<HTMLElement>("[data-chronicle-flower]", section).forEach((layer, i) => {
        gsap.fromTo(layer, { y: i % 2 === 0 ? 8 : -10 }, {
          y: i % 2 === 0 ? -12 : 12, ease: "none",
          scrollTrigger: {
            trigger: section, start: "top bottom", end: "bottom top", scrub: 1.5,
          },
        });
      });

      // One memorable sticky expansion, then a complete ivory wash into
      // the existing 04 -> 05 bridge. Never mutate the original photo.
      const runway = section.querySelector<HTMLElement>("[data-chronicle-finale]");
      const mount = runway?.querySelector<HTMLElement>("[data-chronicle-mount]");
      const mat = runway?.querySelector<HTMLElement>("[data-chronicle-mat]");
      const shade = runway?.querySelector<HTMLElement>("[data-chronicle-shade]");
      const words = runway?.querySelector<HTMLElement>("[data-chronicle-words]");
      const wash = runway?.querySelector<HTMLElement>("[data-chronicle-wash]");
      const petals = runway?.querySelector<HTMLElement>("[data-chronicle-petals]");

      if (runway && mount && mat && shade && words && wash) {
        gsap.set(mount, { scale: 0.83, yPercent: 3, transformOrigin: "center" });
        gsap.set(mat, { opacity: 1 });
        gsap.set(shade, { opacity: 0 });
        gsap.set(words, { autoAlpha: 0, y: 22 });
        gsap.set(wash, { opacity: 0 });
        if (petals) gsap.set(petals, { opacity: 0.12 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: runway, start: "top top", end: "bottom bottom",
            scrub: 0.85, invalidateOnRefresh: true,
          },
        });
        timeline
          .to(mount, { scale: 1, yPercent: 0, duration: 3.3 }, 0)
          .to(mat, { opacity: 0, duration: 2.2 }, 1.1)
          .to(shade, { opacity: 1, duration: 1.4 }, 2.9)
          .to(words, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 1.2 }, 3.7)
          .to({}, { duration: 1.7 }, 5.1)
          .to(words, { autoAlpha: 0, y: -14, duration: 0.9 }, 6.8)
          .to(wash, { opacity: 1, duration: 2.05 }, 6.8);
        if (petals) timeline.to(petals, { opacity: 0.33, duration: 3 }, 2.2);
      }

      const ending = section.querySelector<HTMLElement>("[data-chronicle-ending]");
      if (ending) {
        gsap.fromTo(ending, { autoAlpha: 0.68, y: 13 }, {
          autoAlpha: 1, y: 0, ease: "power2.out",
          scrollTrigger: {
            trigger: ending, start: "top 92%", end: "top 60%", scrub: 0.7,
          },
        });
      }
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    ScrollTrigger.refresh();
    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [root]);
}
