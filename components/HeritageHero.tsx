"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { invitation } from "@/data/invitation";
import InvitationTypography, { addInvitationTypographyReveal } from "./InvitationTypography";
import ScrollDiscoveryIndicator, { addScrollDiscoveryReveal } from "./ScrollDiscoveryIndicator";

const ASSETS = "/heritage/";

/**
 * The entire first section is layered artwork, NOT one flattened poster.
 * Wedding information remains editable HTML, and every asset is independently
 * positionable for mobile tuning. This section intentionally has NO navigation.
 */
export default function HeritageHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    // Only animate on screen. On mobile this avoids wasting GPU cycles
    // after the visitor moves to the ceremony or backgrounds the browser.
    const ambientTweens: gsap.core.Animation[] = [];
    let sectionVisible = section.getBoundingClientRect().bottom > 0;
    let entranceFinished = false;
    const syncAmbient = () => {
      const shouldPlay = sectionVisible && !document.hidden && entranceFinished;
      ambientTweens.forEach((animation) => {
        if (shouldPlay) animation.play();
        else animation.pause();
      });
    };

    const context = gsap.context(() => {
      // Each layer enters on a different beat; the invitation text is HTML.
      const opening = gsap.timeline({ defaults: { ease: "power2.out" } });
      opening
        .from(".heritage-scene__pagodas", { opacity: 0, scale: 1.03, duration: 1.35 }, 0)
        .from(".heritage-scene__mist", { opacity: 0, y: 7, duration: 1.55 }, 0.1)
        .from(".heritage-scene__hanging", { opacity: 0, x: -12, y: -12, duration: 1.25 }, 0.28)
        .from(".heritage-scene__foliage", { opacity: 0, y: -7, duration: 1.15 }, 0.39)
        .from(".heritage-scene__prelude", { opacity: 0, y: 9, duration: 0.75 }, 0.38)
        // Animate the inner card only. The outer frame owns scroll parallax;
        // names and date are children and never drift off the ivory paper.
        .from(".heritage-scene__card-content", {
          opacity: 0, y: 17, scale: 0.984, duration: 1.12, ease: "power3.out",
        }, 0.68)
        .from(".heritage-scene__floral--left", {
          opacity: 0, x: -13, y: 17, duration: 1.1,
        }, 0.95)
        .from(".heritage-scene__floral--right", {
          opacity: 0, x: 13, y: 17, duration: 1.1,
        }, 1.07);

      const typography = section.querySelector<HTMLElement>(".heritage-scene__typography");
      if (typography) addInvitationTypographyReveal(opening, typography, 0.98);

      opening.from(".heritage-scene__signoff", { opacity: 0, y: 7, duration: 0.7 }, 1.9);
      const scrollCue = section.querySelector<HTMLElement>("[data-scroll-discovery]");
      if (scrollCue) addScrollDiscoveryReveal(opening, scrollCue, 2.13);

      opening.eventCallback("onComplete", () => {
        entranceFinished = true;
        syncAmbient();
      });

      // Scrubbed, reversible depth. Motion on OUTER planes never competes
      // with the subtle idle animation on their INNER image surfaces.
      const scrollDepth = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      scrollDepth
        .to(".heritage-scene__pagodas", {
          y: () => -Math.min(section.clientHeight * 0.045, 40),
          scale: 1.024, ease: "none",
        }, 0)
        .to(".heritage-scene__mist", {
          y: () => -Math.min(section.clientHeight * 0.072, 59),
          ease: "none",
        }, 0)
        .to(".heritage-scene__hanging", {
          y: () => -Math.min(section.clientHeight * 0.09, 72),
          x: -7, ease: "none",
        }, 0)
        .to(".heritage-scene__foliage", {
          y: () => -Math.min(section.clientHeight * 0.055, 45),
          x: 6, ease: "none",
        }, 0)
        .to(".heritage-scene__card", {
          y: () => -Math.min(section.clientHeight * 0.055, 43),
          ease: "none",
        }, 0)
        .to(".heritage-scene__floral--left", {
          y: () => -Math.min(section.clientHeight * 0.11, 85),
          x: -13, ease: "none",
        }, 0)
        .to(".heritage-scene__floral--right", {
          y: () => -Math.min(section.clientHeight * 0.10, 75),
          x: 13, ease: "none",
        }, 0);

      const idle = (selector: string, vars: gsap.TweenVars) => {
        const element = section.querySelector<HTMLElement>(selector);
        if (!element) return;
        ambientTweens.push(gsap.to(element, {
          ...vars, paused: true, repeat: -1, yoyo: true,
          ease: "sine.inOut", force3D: true,
        }));
      };

      // Slow, independent ambient motion while the card stays still.
      // Use only transform/opacity, never animated blur or backdrop filters.
      idle(".heritage-scene__mist img", { x: 8, duration: 11 });
      idle(".heritage-scene__hanging img", { y: 3, rotation: 0.18, duration: 6.4 });
      idle(".heritage-scene__foliage img", { y: 2, rotation: -0.16, duration: 7.6 });
      idle(".heritage-scene__floral--left img", { y: -3, rotation: 0.24, duration: 5.7 });
      idle(".heritage-scene__floral--right img", { y: -2, rotation: -0.22, duration: 6.6 });


    }, section);

    const observer = new IntersectionObserver(([entry]) => {
      sectionVisible = Boolean(entry?.isIntersecting) && entry.intersectionRatio > 0.03;
      syncAmbient();
    }, { threshold: [0, 0.03, 0.2] });
    observer.observe(section);
    document.addEventListener("visibilitychange", syncAmbient);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncAmbient);
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="welcome" className="hero section-panel heritage-scene" aria-labelledby="hero-title">
      {/* 01 + 02: paper and its fine grain, optimised automatically by Next/Image */}
      <div className="heritage-scene__paper" aria-hidden="true">
        <Image src={ASSETS + "ivory-parchment.png"} alt="" fill priority sizes="100vw" />
      </div>
      {/* 03: distant Bagan scenery */}
      <div className="heritage-scene__pagodas" aria-hidden="true">
        <Image src={ASSETS + "bagan-pagodas.png"} alt="" fill priority sizes="(max-width: 700px) 100vw, 760px" />
      </div>
      {/* 04: separately drifting warm mist */}
      <div className="heritage-scene__mist" aria-hidden="true">
        <Image src={ASSETS + "golden-mist.png"} alt="" fill sizes="(max-width: 700px) 100vw, 760px" />
      </div>
      {/* 05 + 06: independent hanging flowers and botanical goldwork */}
      <div className="heritage-scene__hanging" aria-hidden="true">
        <Image src={ASSETS + "hanging-magnolias.png"} alt="" fill sizes="(max-width: 700px) 100vw, 760px" />
      </div>
      <div className="heritage-scene__foliage" aria-hidden="true">
        <Image src={ASSETS + "botanical-gold.png"} alt="" fill sizes="(max-width: 700px) 100vw, 760px" />
      </div>

      <div className="heritage-scene__prelude">
        <span className="heritage-scene__prelude-rule" aria-hidden="true">✧</span>
        <p>A CELEBRATION OF TWO HEARTS</p>
        <p className="heritage-scene__burmese" lang="my">မင်္ဂလာပွဲ ဖိတ်ကြားလွှာ</p>
      </div>

      {/* Luxury card and all editable typography form ONE physical motion plane. */}
      <div className="heritage-scene__card">
        <div className="heritage-scene__card-content">
          <Image src={ASSETS + "royal-card.png"} alt="" fill priority sizes="(max-width: 700px) 88vw, 440px" />
          <div className="heritage-scene__typography">
            <InvitationTypography
              id="hero-title"
              firstName={invitation.couple.first}
              secondName={invitation.couple.second}
              heading={invitation.heroTypography.heading}
              romanticMessage={invitation.heroTypography.romanticMessage}
              weekday={invitation.dayOfWeek}
              weddingDate={invitation.displayDay + " " + invitation.displayMonth + " " + invitation.displayYear}
              language={invitation.heroTypography.language}
            />
          </div>
        </div>
      </div>

      {/* 11: two independently art-directed foreground bouquets */}
      <div className="heritage-scene__floral heritage-scene__floral--left" aria-hidden="true">
        <Image src={ASSETS + "floral-left.png"} alt="" fill sizes="(max-width: 700px) 66vw, 430px" />
      </div>
      <div className="heritage-scene__floral heritage-scene__floral--right" aria-hidden="true">
        <Image src={ASSETS + "floral-right.png"} alt="" fill sizes="(max-width: 700px) 66vw, 430px" />
      </div>

      <p className="heritage-scene__signoff">Honouring tradition. <span>Beginning forever.</span></p>

      {/* 13: real anchor works even without JS; no header or navigation bar */}
      <ScrollDiscoveryIndicator targetId="celebration" supportingText="" timelineControlled />
    </section>
  );
}
