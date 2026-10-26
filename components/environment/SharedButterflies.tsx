"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Original vector artwork: individually flapping wings, no video or stock asset. */
function Butterfly({ second = false }: { second?: boolean }) {
  return (
    <svg viewBox="0 0 96 76" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g className="living-butterfly__wing living-butterfly__wing--left">
        <path d="M47 35 C37 6 5 1 8 22 C11 38 30 40 44 40 C18 37 12 61 28 65 C40 67 44 50 47 38Z"
          fill={second ? "#D9B4AE" : "#E9C48B"} stroke="#946B36" strokeWidth="2" />
        <path d="M40 34 C27 21 18 18 17 22 M41 43 C29 48 25 55 27 58" fill="none" stroke="#F8E9C5" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="18" cy="27" r="3.5" fill="#8A4B50"/><circle cx="29" cy="54" r="2.6" fill="#8A4B50"/>
      </g>
      <g className="living-butterfly__wing living-butterfly__wing--right">
        <path d="M49 35 C59 6 91 1 88 22 C85 38 66 40 52 40 C78 37 84 61 68 65 C56 67 52 50 49 38Z"
          fill={second ? "#E8CB91" : "#D9B4AE"} stroke="#946B36" strokeWidth="2" />
        <path d="M56 34 C69 21 78 18 79 22 M55 43 C67 48 71 55 69 58" fill="none" stroke="#F8E9C5" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="78" cy="27" r="3.5" fill="#8A4B50"/><circle cx="67" cy="54" r="2.6" fill="#8A4B50"/>
      </g>
      <path d="M48 29 Q44 17 40 16 M48 29 Q52 17 56 16" fill="none" stroke="#725342" strokeWidth="1.6" strokeLinecap="round"/>
      <ellipse cx="48" cy="39" rx="3.6" ry="17" fill="#674437"/>
      <circle cx="48" cy="25" r="4.5" fill="#674437"/>
    </svg>
  );
}

/**
 * Two butterflies share one journey-long, scrubbed scroll path.
 * A few still moments are deliberate "landings" near the floral margins.
 * Flight wrappers never compete with ambient wind transforms on the inner shell.
 */
export default function SharedButterflies() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const page = overlay?.closest<HTMLElement>(".invitation-page");
    if (!overlay || !page ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const idleTracks: gsap.core.Timeline[] = [];
    const context = gsap.context(() => {
      // Small independent loops continue even when the guest isn't scrolling.
      // Motion lives on an inner wrapper so it never overrides scroll flight.
      overlay.querySelectorAll<HTMLElement>("[data-butterfly-orbit]").forEach((orbit, i) => {
        idleTracks.push(gsap.timeline({ repeat: -1, yoyo: true, paused: true })
          .to(orbit, { x: i === 0 ? 23 : -17, y: -18, rotation: i === 0 ? -6 : 5,
            duration: i === 0 ? 4.1 : 5.2, ease: "sine.inOut" })
          .to(orbit, { x: i === 0 ? -15 : 14, y: 13, rotation: i === 0 ? 5 : -5,
            duration: i === 0 ? 4.9 : 4.5, ease: "sine.inOut" }));
      });

      const lead = overlay.querySelector<HTMLElement>('[data-butterfly-flight="lead"]');
      const companion = overlay.querySelector<HTMLElement>('[data-butterfly-flight="companion"]');
      if (!lead || !companion) return;

      const w = () => window.innerWidth;
      const h = () => window.innerHeight;
      gsap.set(lead, { x: () => w() * 0.76, y: () => h() * 0.65, autoAlpha: 0.85 });
      gsap.set(companion, { x: () => w() * 0.12, y: () => h() * 0.31, autoAlpha: 0 });

      const story = gsap.timeline({
        defaults: { ease: "sine.inOut" },
        scrollTrigger: {
          trigger: page, start: "top top", end: "bottom bottom",
          scrub: 1.25, invalidateOnRefresh: true,
        },
      });
      // Paths bend around the readable center, with short perches at the edges.
      story
        .to(lead, { x: () => w() * 0.85, y: () => h() * 0.38, rotation: -14, duration: 1.3 }, 0)
        .to(lead, { x: () => w() * 0.68, y: () => h() * 0.2, rotation: -22, duration: 1.0 }, 1.3)
        .to(lead, { x: () => w() * 0.68, y: () => h() * 0.2, rotation: 0, duration: 0.7 }, 2.3)
        .to(lead, { x: () => w() * 0.14, y: () => h() * 0.73, rotation: 17, duration: 2.1 }, 3.0)
        .to(lead, { x: () => w() * 0.23, y: () => h() * 0.45, rotation: -11, duration: 1.4 }, 5.1)
        .to(lead, { x: () => w() * 0.87, y: () => h() * 0.71, rotation: 12, duration: 2.5 }, 6.5)
        .to(lead, { x: () => w() * 0.83, y: () => h() * 0.26, rotation: -15, duration: 1.6 }, 9)
        .to(lead, { x: () => w() * 0.11, y: () => h() * 0.53, rotation: 8, duration: 2.2 }, 10.6)
        .to(lead, { x: () => w() * 0.12, y: () => h() * 0.53, rotation: 0, duration: 1 }, 12.8)
        .to(lead, { x: () => w() * 0.77, y: () => h() * 0.77, rotation: 16, duration: 2.5 }, 13.8)
        .to(lead, { autoAlpha: 0, duration: 0.8 }, 16.0);
      story
        .to(companion, { autoAlpha: 0.7, duration: 0.45 }, 1.1)
        .to(companion, { x: () => w() * 0.25, y: () => h() * 0.71, rotation: 10, duration: 2 }, 1.1)
        .to(companion, { x: () => w() * 0.18, y: () => h() * 0.71, rotation: 0, duration: 0.8 }, 3.1)
        .to(companion, { autoAlpha: 0, duration: 0.8 }, 4.0)
        .to(companion, { autoAlpha: 0.62, x: () => w() * 0.8, y: () => h() * 0.18, duration: 1.4 }, 7.8)
        .to(companion, { x: () => w() * 0.76, y: () => h() * 0.37, rotation: -12, duration: 1.2 }, 9.2)
        .to(companion, { autoAlpha: 0, duration: 1.1 }, 10.5);
    }, overlay);
    const sync = () => {
      idleTracks.forEach((track) => document.hidden ? track.pause() : track.play());
    };
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      document.removeEventListener("visibilitychange", sync);
      context.revert();
    };
  }, []);

  return (
    <div ref={overlayRef} className="living-butterflies" aria-hidden="true">
      <div className="living-butterflies__flight living-butterflies__flight--lead" data-butterfly-flight="lead">
        <span className="living-butterflies__wind" data-wind-butterfly><span className="living-butterflies__orbit" data-butterfly-orbit="lead"><Butterfly /></span></span>
      </div>
      <div className="living-butterflies__flight living-butterflies__flight--companion" data-butterfly-flight="companion">
        <span className="living-butterflies__wind" data-wind-butterfly><span className="living-butterflies__orbit" data-butterfly-orbit="companion"><Butterfly second /></span></span>
      </div>
    </div>
  );
}
