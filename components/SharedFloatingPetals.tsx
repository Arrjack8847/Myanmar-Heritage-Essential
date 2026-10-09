"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// One set of six petals moves continuously across Hero -> Ceremony -> Gateway.
// Their animation never restarts at the ceremony/gateway boundary; only the
// alpha of the overall overlay softens as venue information approaches.
const petals = [
  { file: "petal-01.png", left: "8%", top: "8%", size: 78, drift: 46, duration: 18 },
  { file: "petal-02.png", left: "83%", top: "14%", size: 65, drift: -43, duration: 21 },
  { file: "petal-03.png", left: "71%", top: "49%", size: 53, drift: -38, duration: 17 },
  { file: "petal-04.png", left: "3%", top: "60%", size: 63, drift: 42, duration: 22 },
  { file: "petal-05.png", left: "86%", top: "71%", size: 53, drift: -36, duration: 20 },
  { file: "petal-06.png", left: "35%", top: "5%", size: 47, drift: 42, duration: 24 },
] as const;

export default function SharedFloatingPetals() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const journey = root.closest<HTMLElement>(".heritage-journey");
    if (!journey) return;
    const gateway = journey.querySelector<HTMLElement>("#venue");
    gsap.registerPlugin(ScrollTrigger);

    const animations: gsap.core.Timeline[] = [];
    let visible = true;

    const context = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(".royal-story__petal", root);
      elements.forEach((element, index) => {
        const petal = petals[index];
        if (!petal) return;
        const timeline = gsap.timeline({
          paused: true, repeat: -1, repeatDelay: 0.6 + (index % 3) * 0.55,
        });
        timeline
          .fromTo(element, {
            y: -18, x: -petal.drift * 0.25,
            rotation: index % 2 ? 26 : -18, opacity: 0,
          }, {
            y: 50,
            x: petal.drift * 0.12,
            rotation: index % 2 ? -10 : 19,
            opacity: 0.68,
            duration: petal.duration * 0.24,
            ease: "none",
            immediateRender: true,
          })
          .to(element, {
            y: 148,
            x: petal.drift * 0.86,
            rotation: index % 2 ? -84 : 92,
            opacity: 0.54,
            duration: petal.duration * 0.51,
            ease: "none",
          })
          .to(element, {
            y: 230,
            x: petal.drift * 1.3,
            rotation: index % 2 ? -144 : 151,
            opacity: 0,
            duration: petal.duration * 0.25,
            ease: "none",
          });
        // Six individual starting phases: no synchronized rain or obvious reset.
        timeline.progress([0.13, 0.28, 0.48, 0.39, 0.19, 0.61][index] ?? 0.1).pause();
        animations.push(timeline);
      });

      // Keep the SAME falling petals visible over the seam; gradually reduce
      // their prominence during the gateway camera move so typography and the
      // Google Maps link remain unobstructed.
      if (gateway) {
        gsap.fromTo(root, { opacity: 1 }, {
          opacity: 0.27, ease: "none",
          scrollTrigger: {
            trigger: gateway,
            start: "top 26%",
            end: "top -105%",
            scrub: 0.7,
          },
        });
      }
    }, root);

    const sync = () => {
      const play = visible && !document.hidden;
      animations.forEach((animation) => play ? animation.play() : animation.pause());
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      sync();
    }, { threshold: 0 });
    observer.observe(journey);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      context.revert();
    };
  }, []);

  return (
    <div className="royal-story__petals" ref={rootRef} aria-hidden="true">
      {petals.map((petal, index) => (
        <div
          key={petal.file}
          className="royal-story__petal"
          style={{
            left: petal.left, top: petal.top,
            width: petal.size, height: petal.size,
          } as CSSProperties}
        >
          <Image
            src={"/heritage/petals/" + petal.file}
            alt=""
            fill
            priority={index < 3}
            sizes="(max-width: 759px) 96px, 120px"
          />
        </div>
      ))}
    </div>
  );
}
