"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { invitation } from "@/data/invitation";
import { HeritageCrest } from "@/components/Decorations";
import RoyalCeremonyFrame from "./RoyalCeremonyFrame";
import CeremonyTimeline from "./CeremonyTimeline";

/**
 * JN-W01: a real scrolling invitation, not a tabbed application.
 * One sticky royal page contains a date cover and the existing ornate event
 * timeline. The page holds its position while scroll reveals each event.
 */
export default function CelebrationSection() {
  const sceneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const runway = scene?.closest<HTMLElement>(".ceremony-story__scroll");
    if (!scene || !runway || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ambient: gsap.core.Animation[] = [];
    let visible = false;
    let lastCue = -1;
    const cue = scene.querySelector<HTMLElement>("[data-ceremony-scroll-cue]");
    const cueLabels = [
      "SCROLL TO UNFOLD THE DAY",
      "NEXT · " + invitation.ceremony[1].tabLabel.toUpperCase(),
      "NEXT · " + invitation.ceremony[2].tabLabel.toUpperCase(),
      "CONTINUE TO THE VENUE",
    ];

    const context = gsap.context(() => {
      const cover = scene.querySelector<HTMLElement>(".ceremony-cover");
      const program = scene.querySelector<HTMLElement>(".ceremony-program");
      const events = gsap.utils.toArray<HTMLElement>(".ceremony-timeline__event", scene);
      const thread = scene.querySelector<HTMLElement>(".ceremony-timeline__thread");
      const progress = scene.querySelector<HTMLElement>(".ceremony-scroll__progress-fill");

      if (!cover || !program || events.length !== invitation.ceremony.length) return;

      // The printed cover is visible without JavaScript. On an animated device,
      // prepare the unfolded schedule before making it visible.
      gsap.set(program, { autoAlpha: 0, y: 23 });
      gsap.set(events, { autoAlpha: 0, y: 22 });
      if (thread) gsap.set(thread, { scaleY: 0, transformOrigin: "top center" });
      if (progress) gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

      const scroll = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: runway,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
          onUpdate: ({ progress: value }) => {
            const nextCue = value < 0.25 ? 0 : value < 0.49 ? 1 : value < 0.73 ? 2 : 3;
            if (nextCue !== lastCue) {
              lastCue = nextCue;
              if (cue) cue.textContent = cueLabels[nextCue] ?? cueLabels[3];
            }
          },
        },
      });

      // Scene one: a full wedding date printed inside the original royal frame.
      // Scene two: the entire existing timeline physically unfolds below a
      // smaller title, one event at a time. Nothing requires clicking.
      scroll
        .to(cover, { autoAlpha: 0, y: -46, scale: 0.96, duration: 0.48, ease: "power1.inOut" }, 0.28)
        .to(program, { autoAlpha: 1, y: 0, duration: 0.37, ease: "power2.out" }, 0.64)
        .to(events[0], { autoAlpha: 1, y: 0, duration: 0.34, ease: "power2.out" }, 0.91)
        .to(events[1], { autoAlpha: 1, y: 0, duration: 0.34, ease: "power2.out" }, 1.74)
        .to(events[2], { autoAlpha: 1, y: 0, duration: 0.34, ease: "power2.out" }, 2.57)
        // Keep the complete ceremony readable at the end of the chapter.
        .to({}, { duration: 0.68 }, 2.95)
        .fromTo(".ceremony-scene__pagodas",
          { y: 28, scale: 1.045, opacity: 0.34 },
          { y: -23, scale: 1.005, opacity: 0.57, duration: 3.63 }, 0)
        .fromTo(".ceremony-scene__mist",
          { y: 22, opacity: 0.34 },
          { y: -26, opacity: 0.55, duration: 3.63 }, 0)
        .fromTo(".ceremony-scene__petals",
          { y: 17 },
          { y: -50, duration: 3.63 }, 0);

      if (thread) scroll.to(thread, { scaleY: 1, duration: 2.22 }, 0.9);
      if (progress) scroll.to(progress, { scaleX: 1, duration: 3.63 }, 0);

      // Ambient movements remain separate from scrub positioning and are
      // paused when the scene is offscreen or the tab is backgrounded.
      const ambientFloat = (selector: string, vars: gsap.TweenVars) => {
        const element = scene.querySelector<HTMLElement>(selector);
        if (!element) return;
        ambient.push(gsap.to(element, {
          ...vars,
          repeat: -1,
          yoyo: true,
          paused: true,
          ease: "sine.inOut",
          force3D: true,
        }));
      };
      ambientFloat(".ceremony-scene__mist img", { x: 8, duration: 12 });
      ambientFloat(".ceremony-scene__petal--a", { x: 11, rotation: 15, duration: 9 });
      ambientFloat(".ceremony-scene__petal--b", { x: -10, rotation: -16, duration: 10 });
      ambientFloat(".ceremony-scene__petal--c", { x: 8, rotation: 12, duration: 11 });
      ambientFloat(".ceremony-scene__petal--d", { x: -13, rotation: -10, duration: 8 });

    }, scene);

    const sync = () => {
      const run = visible && !document.hidden;
      ambient.forEach((animation) => run ? animation.play() : animation.pause());
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.04);
      sync();
    }, { threshold: [0, 0.04, 0.2] });
    observer.observe(scene);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      context.revert();
    };
  }, []);

  return (
    <div id="celebration" className="ceremony-story__scroll">
      <section
        ref={sceneRef}
        className="celebration celebration--royal ceremony-scene section-panel"
        aria-labelledby="celebration-title"
      >
        <div className="ceremony-scene__paper" aria-hidden="true">
          <Image src="/heritage/ivory-parchment.png" alt="" fill sizes="100vw" />
        </div>
        <div className="ceremony-scene__pagodas" aria-hidden="true">
          <Image src="/heritage/bagan-pagodas.png" alt="" fill sizes="(max-width: 760px) 100vw, 950px" />
        </div>
        <div className="ceremony-scene__mist" aria-hidden="true">
          <Image src="/heritage/golden-mist.png" alt="" fill sizes="100vw" />
        </div>
        <div className="ceremony-scene__light" aria-hidden="true" />
        <div className="ceremony-scene__petals" aria-hidden="true">
          {(["a", "b", "c", "d"] as const).map((key, index) => (
            <div className={"ceremony-scene__petal ceremony-scene__petal--" + key} key={key}>
              <Image src={"/heritage/petals/petal-0" + (index + 1) + ".png"} alt="" fill sizes="46px" />
            </div>
          ))}
        </div>

        <div className="ceremony-page">
          <RoyalCeremonyFrame />
          <div className="ceremony-cover">
            <HeritageCrest className="ceremony-cover__crest" aria-hidden="true" />
            <p className="ceremony-eyebrow">CHAPTER ONE · OUR CELEBRATION</p>
            <h2 id="celebration-title">A Union of <em>Two Hearts</em></h2>
            <p className="ceremony-cover__greeting">{invitation.greeting}</p>
            <div className="ceremony-cover__date" aria-label={"Wedding date " + invitation.dayOfWeek + ", " + invitation.displayDay + " " + invitation.displayMonth + " " + invitation.displayYear}>
              <strong className="ceremony-cover__day">{invitation.displayDay}</strong>
              <span className="ceremony-cover__date-divider" aria-hidden="true" />
              <span className="ceremony-cover__date-details">
                <span>{invitation.dayOfWeek}</span>
                <strong>{invitation.displayMonth}</strong>
                <span>{invitation.displayYear}</span>
              </span>
            </div>
          </div>

          <div className="ceremony-program">
            <HeritageCrest className="ceremony-program__crest" aria-hidden="true" />
            <p className="ceremony-eyebrow">OUR WEDDING DAY</p>
            <h3 className="ceremony-program__title">The Celebration <em>Unfolds</em></h3>
            <p className="ceremony-program__date">
              {invitation.dayOfWeek}, {invitation.displayDay} {invitation.displayMonth} {invitation.displayYear}
            </p>
            <CeremonyTimeline />
          </div>
        </div>

        <div className="ceremony-scroll" aria-hidden="true">
          <p className="ceremony-scroll__label" data-ceremony-scroll-cue>SCROLL TO UNFOLD THE DAY</p>
          <div className="ceremony-scroll__progress">
            <span className="ceremony-scroll__progress-fill" />
          </div>
          <span className="ceremony-scroll__arrow">↓</span>
        </div>
      </section>
    </div>
  );
}
