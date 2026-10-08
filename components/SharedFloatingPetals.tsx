"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";

// The SAME six artwork layers travel across BOTH chapters, rather than
// restarting or disappearing at the bottom edge of the first viewport.
const petals = [
  { file: "petal-01.png", left: "8%", top: "8svh", size: 78, drift: 46, duration: 30 },
  { file: "petal-02.png", left: "83%", top: "14svh", size: 65, drift: -43, duration: 36 },
  { file: "petal-03.png", left: "71%", top: "49svh", size: 53, drift: -38, duration: 33 },
  { file: "petal-04.png", left: "3%", top: "60svh", size: 63, drift: 42, duration: 37 },
  { file: "petal-05.png", left: "86%", top: "71svh", size: 53, drift: -36, duration: 34 },
  { file: "petal-06.png", left: "35%", top: "5svh", size: 47, drift: 42, duration: 40 },
] as const;

export default function SharedFloatingPetals() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const story = root.parentElement;
    if (!story) return;

    const animations: gsap.core.Timeline[] = [];
    let visible = true;

    const context = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(".royal-story__petal", root);
      elements.forEach((element, index) => {
        const petal = petals[index];
        if (!petal) return;
        const travel = () => Math.max(story.offsetHeight + window.innerHeight * 0.18, window.innerHeight * 2);
        const timeline = gsap.timeline({
          paused: true, repeat: -1, repeatDelay: 0.6 + (index % 3) * 0.55,
        });
        timeline
          .fromTo(element, {
            y: -70, x: -petal.drift * 0.25,
            rotation: index % 2 ? 26 : -18, opacity: 0,
          }, {
            y: () => travel() * 0.21,
            x: petal.drift * 0.12,
            rotation: index % 2 ? -10 : 19,
            opacity: 0.44,
            duration: petal.duration * 0.24,
            ease: "none",
            immediateRender: true,
          })
          .to(element, {
            y: () => travel() * 0.7,
            x: petal.drift * 0.86,
            rotation: index % 2 ? -84 : 92,
            opacity: 0.39,
            duration: petal.duration * 0.51,
            ease: "none",
          })
          .to(element, {
            y: () => travel(),
            x: petal.drift * 1.3,
            rotation: index % 2 ? -144 : 151,
            opacity: 0,
            duration: petal.duration * 0.25,
            ease: "none",
          });
        // Six individual starting phases: no synchronized rain or obvious reset.
        timeline.progress((index * 0.164 + 0.09) % 1).pause();
        animations.push(timeline);
      });
    }, root);

    const sync = () => {
      const play = visible && !document.hidden;
      animations.forEach((animation) => play ? animation.play() : animation.pause());
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      sync();
    }, { threshold: 0 });
    observer.observe(story);
    document.addEventListener("visibilitychange", sync);
    const onResize = () => animations.forEach((animation) => animation.invalidate());
    window.addEventListener("resize", onResize, { passive: true });
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", onResize);
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
