"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { invitation } from "@/data/invitation";
import InvitationTypography, { addInvitationTypographyReveal } from "./InvitationTypography";
import ScrollDiscoveryIndicator, { addScrollDiscoveryReveal } from "./ScrollDiscoveryIndicator";

const ASSETS = "/heritage/";
const petals = [
  { file: "petals/petal-01.png", left: "8%", top: "8%", size: 78, drift: 32, duration: 14, delay: -6 },
  { file: "petals/petal-02.png", left: "81%", top: "10%", size: 65, drift: -24, duration: 17, delay: -11 },
  { file: "petals/petal-03.png", left: "70%", top: "48%", size: 53, drift: -32, duration: 13, delay: -3 },
  { file: "petals/petal-04.png", left: "2%", top: "58%", size: 63, drift: 25, duration: 18, delay: -14 },
  { file: "petals/petal-05.png", left: "86%", top: "71%", size: 53, drift: -22, duration: 15, delay: -9 },
  { file: "petals/petal-06.png", left: "35%", top: "5%", size: 47, drift: 28, duration: 19, delay: -1 },
] as const;

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
    const petalTweens: gsap.core.Tween[] = [];

    const context = gsap.context(() => {
      const opening = gsap.timeline({ defaults: { ease: "power2.out" } });

      opening
        .from(".heritage-scene__pagodas", { opacity: 0, scale: 1.025, duration: 1.8 }, 0)
        .from(".heritage-scene__mist", { opacity: 0, duration: 1.9 }, 0.2)
        .from(".heritage-scene__hanging", { opacity: 0, x: -18, y: -14, duration: 1.5 }, 0.2)
        .from(".heritage-scene__foliage", { opacity: 0, duration: 1.35 }, 0.45)
        .from(".heritage-scene__prelude", { opacity: 0, y: 13, duration: 0.95 }, 0.35)
        .from(".heritage-scene__card", { opacity: 0, y: 19, scale: 0.985, duration: 1.35, ease: "power3.out" }, 0.42)
        .from(".heritage-scene__floral--left", { opacity: 0, x: -18, y: 22, duration: 1.35 }, 0.9)
        .from(".heritage-scene__floral--right", { opacity: 0, x: 18, y: 22, duration: 1.35 }, 1.05);

      const typography = section.querySelector<HTMLElement>(".heritage-scene__typography");
      if (typography) addInvitationTypographyReveal(opening, typography, 0.95);

      opening.from(".heritage-scene__signoff", { opacity: 0, y: 10, duration: 0.8 }, 2.15);

      const scrollCue = section.querySelector<HTMLElement>("[data-scroll-discovery]");
      if (scrollCue) addScrollDiscoveryReveal(opening, scrollCue, 2.3);

      // Individual depth planes. CSS stays static if animations are disabled.
      const scroll = { trigger: section, start: "top top", end: "bottom top", scrub: 1.15 };
      gsap.to(".heritage-scene__pagodas", { yPercent: -5, ease: "none", scrollTrigger: scroll });
      gsap.to(".heritage-scene__mist", { yPercent: -9, xPercent: 2, ease: "none", scrollTrigger: scroll });
      gsap.to(".heritage-scene__hanging", { yPercent: -12, xPercent: -3, ease: "none", scrollTrigger: scroll });
      gsap.to(".heritage-scene__foliage", { yPercent: -6, ease: "none", scrollTrigger: scroll });
      gsap.to(".heritage-scene__card", { yPercent: -6, ease: "none", scrollTrigger: scroll });
      gsap.to(".heritage-scene__typography", { yPercent: -9, ease: "none", scrollTrigger: scroll });
      gsap.to(".heritage-scene__floral--left", { yPercent: -15, xPercent: -4, ease: "none", scrollTrigger: scroll });
      gsap.to(".heritage-scene__floral--right", { yPercent: -12, xPercent: 3, ease: "none", scrollTrigger: scroll });

      const petalElements = gsap.utils.toArray<HTMLElement>(".heritage-scene__petal", section);
      petalElements.forEach((element, index) => {
        const settings = petals[index];
        if (!settings) return;
        petalTweens.push(gsap.fromTo(element,
          { x: 0, y: -24, rotation: index % 2 ? 18 : -20, opacity: 0 },
          {
            x: settings.drift, y: 135, rotation: index % 2 ? -105 : 105,
            opacity: 0.74, duration: settings.duration, delay: settings.delay,
            repeat: -1, ease: "sine.inOut", paused: true,
          }
        ));
      });
    }, section);

    const observer = new IntersectionObserver(([entry]) => {
      const active = Boolean(entry?.isIntersecting) && !document.hidden;
      petalTweens.forEach((tween) => active ? tween.play() : tween.pause());
    }, { threshold: 0.03 });
    observer.observe(section);

    const onVisibility = () => {
      if (document.hidden) petalTweens.forEach((tween) => tween.pause());
      else if (section.getBoundingClientRect().bottom > 0 &&
               section.getBoundingClientRect().top < window.innerHeight)
        petalTweens.forEach((tween) => tween.play());
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
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

      {/* NEW CARD: isolated ivory surface + real editable text, never baked into artwork. */}
      <div className="heritage-scene__card">
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

      {/* 11: two independently art-directed foreground bouquets */}
      <div className="heritage-scene__floral heritage-scene__floral--left" aria-hidden="true">
        <Image src={ASSETS + "floral-left.png"} alt="" fill sizes="(max-width: 700px) 66vw, 430px" />
      </div>
      <div className="heritage-scene__floral heritage-scene__floral--right" aria-hidden="true">
        <Image src={ASSETS + "floral-right.png"} alt="" fill sizes="(max-width: 700px) 66vw, 430px" />
      </div>

      <p className="heritage-scene__signoff">Honouring tradition. <span>Beginning forever.</span></p>

      {/* 12: real cut-out petal assets; small independent GSAP planes */}
      <div className="heritage-scene__petals" aria-hidden="true">
        {petals.map((petal) => (
          <div
            className="heritage-scene__petal"
            key={petal.file}
            style={{ left: petal.left, top: petal.top, width: petal.size, height: petal.size } as CSSProperties}
          >
            <Image src={ASSETS + petal.file} alt="" fill sizes="110px" />
          </div>
        ))}
      </div>

      {/* 13: real anchor works even without JS; no header or navigation bar */}
      <ScrollDiscoveryIndicator targetId="celebration" supportingText="" timelineControlled />
    </section>
  );
}
