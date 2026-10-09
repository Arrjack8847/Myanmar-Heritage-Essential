"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { invitation } from "@/data/invitation";
import Image from "next/image";
import RoyalBlessing from "@/components/closing/RoyalBlessing";
import HeritageHero from "@/components/HeritageHero";
import RoyalGateway from "@/components/gateway/RoyalGateway";
import JourneySection from "@/components/memories/JourneySection";
import CelebrationSection from "@/components/celebration/CelebrationSection";
import RoyalUnfoldTransition from "@/components/transitions/RoyalUnfoldTransition";
import CourtyardMistTransition from "@/components/transitions/CourtyardMistTransition";
import HeirloomBlessingTransition from "@/components/transitions/HeirloomBlessingTransition";
import SharedFloatingPetals from "@/components/SharedFloatingPetals";
import MotionStability from "@/components/MotionStability";
import MotionDebug from "@/components/MotionDebug";
import {
  GoldenThread,
  HeritageCrest,
} from "@/components/Decorations";

function useHeritageMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const node = root.current;
    if (!node) return;

    // Respect visitors who prefer still layouts; all content is visible by default.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      // Each chapter appears gently; the shared ornamental motif links chapters.
      gsap.utils.toArray<HTMLElement>(".js-reveal").forEach((element) => {
        gsap.from(element, {
          y: 42,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: element, start: "top 89%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".js-ornament-drift").forEach((element, index) => {
        gsap.fromTo(element,
          { y: index % 2 === 0 ? -34 : 28 },
          {
            y: index % 2 === 0 ? 32 : -28,
            ease: "none",
            scrollTrigger: {
              trigger: element.closest("section") || element,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      });

      const path = node.querySelector<SVGPathElement>(".js-thread-path");
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: node, start: "top top", end: "bottom bottom", scrub: 1.5 },
        });
      }
    }, node);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      context.revert();
    };
  }, [root]);
}

export default function HeritageInvitation() {
  const root = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  useHeritageMotion(root);

  useEffect(() => {
    if (lightbox === null) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowLeft") setLightbox((index) => index === null ? null : (index + invitation.gallery.length - 1) % invitation.gallery.length);
      if (event.key === "ArrowRight") setLightbox((index) => index === null ? null : (index + 1) % invitation.gallery.length);
    };
    window.addEventListener("keydown", keyHandler);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", keyHandler);
    };
  }, [lightbox]);

  return (
    <main ref={root} className="invitation-page">
      <a className="skip-link" href="#celebration">Skip to invitation details</a>
      <div className="paper-grain" aria-hidden="true" />
      <GoldenThread className="golden-thread" />

      {/* A SINGLE sticky petal layer spans hero, ceremony and royal gateway.
          Keeping it above both stories stops the petals resetting at the seam. */}
      <div className="heritage-journey">
        <SharedFloatingPetals />
        <div className="royal-story">
          <div className="heritage-story__intro">
            <HeritageHero />
          </div>
          <RoyalUnfoldTransition />
          <CelebrationSection />
        </div>

        {/* 02 → 03 — the approved courtyard image dissolves into warm ivory,
            then Section 03 continues the same scene with its existing curtains. */}
        <CourtyardMistTransition />

        {/* 03 — THE ROYAL GATEWAY — existing sticky choreography preserved */}
        <RoyalGateway />
      </div>
      <MotionStability />
      <MotionDebug />

      {/* 04 — EDITORIAL LOVE STORY — natural scroll + golden thread */}
      <JourneySection onOpenPhoto={setLightbox} />

      {/* The same golden thread, mist and foil emblem carry the album into the blessing. */}
      <HeirloomBlessingTransition />

      {/* 05 — ROYAL BLESSING · REUSED HERITAGE LAYERS */}
      <RoyalBlessing />

      <footer className="site-footer"><span>MYANMAR HERITAGE · JN-W01</span><span>CRAFTED BY JACKNEX STUDIO</span></footer>

      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo gallery">
          <button type="button" className="lightbox__close" aria-label="Close photo" onClick={() => setLightbox(null)}><Image src="/heritage/buttons/gallery-close.png" alt="" aria-hidden="true" width={510} height={600} /></button>
          <button type="button" className="lightbox__nav lightbox__nav--prev" aria-label="Previous photo" onClick={() => setLightbox((lightbox + invitation.gallery.length - 1) % invitation.gallery.length)}><Image src="/heritage/buttons/gallery-previous.png" alt="" aria-hidden="true" width={513} height={594} /></button>
          <figure className="lightbox__figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={invitation.gallery[lightbox].src} alt={invitation.gallery[lightbox].alt} />
            <figcaption>{invitation.gallery[lightbox].caption} <span>{lightbox + 1} / {invitation.gallery.length}</span></figcaption>
          </figure>
          <button type="button" className="lightbox__nav lightbox__nav--next" aria-label="Next photo" onClick={() => setLightbox((lightbox + 1) % invitation.gallery.length)}><Image src="/heritage/buttons/gallery-next.png" alt="" aria-hidden="true" width={513} height={597} /></button>
        </div>
      )}
    </main>
  );
}
