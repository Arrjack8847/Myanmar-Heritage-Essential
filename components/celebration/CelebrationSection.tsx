"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { invitation } from "@/data/invitation";

/**
 * One-screen inner leaf for the Royal Myanmar invitation.
 * All times, titles and descriptions come from data/invitation.ts.
 * Only one event is shown at a time; tabs remain usable without motion.
 */
export default function CelebrationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const events = invitation.ceremony;
  const activeEvent = events[activeIndex] ?? events[0];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ambient: gsap.core.Tween[] = [];
    let onScreen = false;

    const context = gsap.context(() => {
      const slowlyFloat = (selector: string, variables: gsap.TweenVars) => {
        const node = section.querySelector<HTMLElement>(selector);
        if (!node) return;
        ambient.push(gsap.to(node, {
          ...variables, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true,
          force3D: true,
        }));
      };

      slowlyFloat(".ceremony-one-screen__mist img", { x: 12, y: -5, duration: 12 });
      slowlyFloat(".ceremony-one-screen__petal--one", { x: 16, y: 22, rotation: 19, duration: 8.5 });
      slowlyFloat(".ceremony-one-screen__petal--two", { x: -14, y: 26, rotation: -24, duration: 10 });
      slowlyFloat(".ceremony-one-screen__petal--three", { x: 10, y: -17, rotation: 16, duration: 9.3 });
      slowlyFloat(".ceremony-one-screen__petal--four", { x: -11, y: 19, rotation: -18, duration: 10.5 });

      // The landscape moves at its own depth without disturbing the live text.
      gsap.to(".ceremony-one-screen__pagodas", {
        y: -18, ease: "none",
        scrollTrigger: {
          trigger: section, start: "top bottom", end: "bottom top",
          scrub: 1.1, invalidateOnRefresh: true,
        },
      });
    }, section);

    const sync = () => {
      const play = onScreen && !document.hidden;
      ambient.forEach((animation) => play ? animation.play() : animation.pause());
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting) && (entry?.intersectionRatio ?? 0) > 0.04;
      sync();
    }, { threshold: [0, 0.04, 0.2] });

    observer.observe(section);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      context.revert();
    };
  }, []);

  function handleTabKeys(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    const max = events.length;
    if (!max) return;

    let next = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (currentIndex + 1) % max;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (currentIndex - 1 + max) % max;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = max - 1;
    else return;

    event.preventDefault();
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section
      ref={sectionRef}
      id="celebration"
      className="celebration celebration--royal ceremony-one-screen section-panel"
      aria-labelledby="celebration-title"
    >
      <div className="ceremony-one-screen__paper" aria-hidden="true">
        <Image src="/heritage/ivory-parchment.png" alt="" fill sizes="100vw" />
      </div>
      <div className="ceremony-one-screen__pagodas" aria-hidden="true">
        <Image src="/heritage/bagan-pagodas.png" alt="" fill sizes="(max-width: 759px) 100vw, 900px" />
      </div>
      <div className="ceremony-one-screen__mist" aria-hidden="true">
        <Image src="/heritage/golden-mist.png" alt="" fill sizes="100vw" />
      </div>
      <div className="ceremony-one-screen__golden-haze" aria-hidden="true" />

      {/* Real lotus-petal silhouettes, never sparkle dots or particle glitter. */}
      <div className="ceremony-one-screen__petals" aria-hidden="true">
        {[1, 2, 3, 4].map((number) => (
          <svg
            key={number}
            className={"ceremony-one-screen__petal ceremony-one-screen__petal--" + ["one", "two", "three", "four"][number - 1]}
            viewBox="0 0 62 90"
            fill="none"
          >
            <path d="M31 4C12 20 8 51 26 79c3 5 7 5 10 0C54 51 50 20 31 4Z" fill="#FFF6E7" fillOpacity=".89" stroke="#D9BC86" strokeWidth="1.2" />
            <path d="M31 13c-5 24-5 43 0 63M31 36c-9-6-13-9-16-15M31 49c9-8 13-11 16-18" stroke="#D7B98A" strokeWidth=".85" strokeOpacity=".74" />
          </svg>
        ))}
      </div>

      <div className="ceremony-one-screen__inner">
        <div className="ceremony-one-screen__motif" aria-hidden="true">
          <span className="ceremony-one-screen__motif-rule" />
          <svg viewBox="0 0 76 42" fill="none">
            <g stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
              <path d="M38 33C31 27 32 15 38 5c6 10 7 22 0 28Z" />
              <path d="M37 32C26 29 20 24 19 15c10 2 17 8 19 18M39 32c11-3 17-8 18-17-10 2-17 8-19 18" />
              <path d="M38 35C25 38 17 34 11 28c11-2 21 1 27 7ZM38 35c13 3 21-1 27-7-11-2-21 1-27 7ZM21 39h34" />
            </g>
          </svg>
          <span className="ceremony-one-screen__motif-rule" />
        </div>

        <p className="ceremony-one-screen__eyebrow">
          CHAPTER ONE <span aria-hidden="true">·</span> CEREMONY DETAILS
        </p>

        <header className="ceremony-one-screen__heading">
          <h2 id="celebration-title">A Union of <em>Two Hearts</em></h2>
          <p>{invitation.greeting}</p>
        </header>

        <div
          className="ceremony-one-screen__date"
          aria-label={"Wedding date: " + invitation.dayOfWeek + ", " + invitation.displayDay + " " + invitation.displayMonth + " " + invitation.displayYear}
        >
          <span className="ceremony-one-screen__date-rule" aria-hidden="true" />
          <strong className="ceremony-one-screen__day">{invitation.displayDay}</strong>
          <span className="ceremony-one-screen__date-divider" aria-hidden="true" />
          <span className="ceremony-one-screen__date-caption">
            <span>{invitation.dayOfWeek}</span>
            <strong>{invitation.displayMonth}</strong>
            <span>{invitation.displayYear}</span>
          </span>
          <span className="ceremony-one-screen__date-rule" aria-hidden="true" />
        </div>

        <div className="ceremony-one-screen__details" aria-label="Order of celebration">
          <div className="ceremony-one-screen__tabs" role="tablist" aria-label="Wedding celebration events">
            {events.map((item, index) => (
              <button
                key={item.title + index}
                ref={(node) => { tabRefs.current[index] = node; }}
                id={"ceremony-tab-" + index}
                type="button"
                className="ceremony-one-screen__tab"
                role="tab"
                aria-selected={index === activeIndex}
                aria-controls="ceremony-details-panel"
                tabIndex={index === activeIndex ? 0 : -1}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => handleTabKeys(event, index)}
              >
                {item.tabLabel}
              </button>
            ))}
          </div>

          <div className="ceremony-one-screen__detail-shell">
            <div
              key={activeIndex}
              className="ceremony-one-screen__panel"
              id="ceremony-details-panel"
              role="tabpanel"
              aria-labelledby={"ceremony-tab-" + activeIndex}
              tabIndex={0}
            >
              <span className="ceremony-one-screen__event-time">{activeEvent.time}</span>
              <h3>{activeEvent.title}</h3>
              <p>{activeEvent.detail}</p>
            </div>
          </div>
          <p className="ceremony-one-screen__hint">Select an event to explore the celebration</p>
        </div>
      </div>
    </section>
  );
}
