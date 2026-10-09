"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VenueDetails from "@/components/gateway/VenueDetails";
import styles from "./RoyalGateway.module.css";

const ASSET = "/heritage/gateway/";

type LayerProps = {
  name: string;
  file: string;
  className: string;
  sizes: string;
  cover?: boolean;
  mirrored?: boolean;
};

/** Every decorative element is a real, independently positionable layer. */
function Layer({ name, file, className, sizes, cover = false, mirrored = false }: LayerProps) {
  return (
    <div className={className} data-gw={name} aria-hidden="true">
      <Image
        src={ASSET + file}
        alt=""
        fill
        sizes={sizes}
        quality={75}
        loading="lazy"
        draggable={false}
        className={mirrored ? styles.mirrored : undefined}
        style={{ objectFit: cover ? "cover" : "contain" }}
      />
    </div>
  );
}

/**
 * Chapter 03: one native-scroll sticky scene. No pinned spacer, wheel interception,
 * WebGL or continuously running animation. All key layers move on one scrubbed
 * timeline, while the client-editable venue information stays ordinary HTML.
 */
export default function RoyalGateway() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const element = (name: string) =>
        section.querySelector<HTMLElement>(`[data-gw="${name}"]`);

      const courtyard = element("courtyard");
      const walkway = element("walkway");
      const mist = element("mist");
      const rays = element("rays");
      const crown = element("crown");
      const leftPillar = element("pillar-left");
      const rightPillar = element("pillar-right");
      const leftCurtain = element("curtain-left");
      const rightCurtain = element("curtain-right");
      const leftFlowers = element("florals-left");
      const rightFlowers = element("florals-right");
      const lanterns = element("lanterns");
      const scrim = element("scrim");
      const copy = element("copy");
      const cue = element("cue");

      if (!courtyard || !walkway || !mist || !rays || !crown ||
          !leftPillar || !rightPillar || !leftCurtain || !rightCurtain ||
          !leftFlowers || !rightFlowers || !lanterns || !scrim || !copy || !cue) return;

      gsap.set(courtyard, { scale: 1.01, opacity: 0.68, transformOrigin: "center center" });
      gsap.set(walkway, { scale: 0.94, yPercent: 8, opacity: 0.1, transformOrigin: "center 90%" });
      gsap.set([crown, leftPillar, rightPillar], { opacity: 0.1, y: 75 });
      gsap.set([leftPillar, rightPillar], { transformOrigin: "center 60%" });
      gsap.set(crown, { transformOrigin: "center 72%" });
      gsap.set(leftCurtain, { xPercent: 17, transformOrigin: "left top" });
      gsap.set(rightCurtain, { xPercent: -17, transformOrigin: "right top" });
      gsap.set([leftFlowers, rightFlowers], { opacity: 0, y: 55, transformOrigin: "center bottom" });
      gsap.set(lanterns, { opacity: 0, y: -25, transformOrigin: "center top" });
      gsap.set(mist, { opacity: 0.97, yPercent: 4 });
      gsap.set(rays, { opacity: 0, scale: 0.93, transformOrigin: "center top" });
      gsap.set(scrim, { opacity: 0 });
      gsap.set(copy, { autoAlpha: 0, y: 22 });
      gsap.set(cue, { autoAlpha: 1 });

      // Scroll positions are relative to this scene, so reverse scrolling
      // naturally closes the curtains again without fighting other sections.
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.05,
          invalidateOnRefresh: true,
        },
      });

      // 0–25%: the carved royal entrance emerges from Section 2's ivory mist.
      timeline.to([crown, leftPillar, rightPillar], { opacity: 1, y: 0, duration: 2.3 }, 0)
        .to([leftFlowers, rightFlowers], { opacity: 1, y: 0, duration: 1.9 }, 0.45)
        .to(lanterns, { opacity: 0.88, y: 0, duration: 1.7 }, 0.65)
        .to(walkway, { opacity: 0.82, yPercent: 0, scale: 1, duration: 2.0 }, 0.55)
        .to(mist, { opacity: 0.7, yPercent: 6, duration: 2.3 }, 0)
        .to(cue, { autoAlpha: 0, duration: 0.8 }, 0.65);

      // 25–58%: curtains part, courtyard warms, rays become visible.
      timeline.to(leftCurtain, { xPercent: -49, rotation: -1.5, duration: 3.0 }, 2.5)
        .to(rightCurtain, { xPercent: 49, rotation: 1.5, duration: 3.0 }, 2.5)
        .to(courtyard, { opacity: 1, scale: 1.095, duration: 3.5 }, 2.35)
        .to(rays, { opacity: 0.3, scale: 1.07, duration: 2.1 }, 2.85)
        .to(mist, { opacity: 0.3, yPercent: 12, duration: 3.3 }, 2.4)
        .to(lanterns, { rotation: 1, duration: 2 }, 3);

      // 58–80%: a restrained camera push between the golden pillars.
      timeline.to(courtyard, { scale: 1.19, duration: 3.2 }, 5.35)
        .to(walkway, { scale: 1.21, yPercent: 16, opacity: 0.48, duration: 3.0 }, 5.35)
        .to(crown, { scale: 1.23, yPercent: -33, opacity: 0, duration: 2.65 }, 5.35)
        .to(leftPillar, { xPercent: -53, scale: 1.17, opacity: 0.26, duration: 2.7 }, 5.35)
        .to(rightPillar, { xPercent: 53, scale: 1.17, opacity: 0.26, duration: 2.7 }, 5.35)
        .to(leftCurtain, { xPercent: -82, opacity: 0, scale: 1.12, duration: 2.7 }, 5.35)
        .to(rightCurtain, { xPercent: 82, opacity: 0, scale: 1.12, duration: 2.7 }, 5.35)
        .to(leftFlowers, { xPercent: -37, scale: 1.19, opacity: 0.24, duration: 2.8 }, 5.3)
        .to(rightFlowers, { xPercent: 37, scale: 1.19, opacity: 0.24, duration: 2.8 }, 5.3)
        .to(lanterns, { yPercent: -24, opacity: 0, duration: 2.5 }, 5.35)
        .to(mist, { opacity: 0.04, duration: 2.4 }, 5.35)
        .to(rays, { opacity: 0.13, duration: 2.3 }, 5.6);

      // 80–100%: let the place take center stage; reveal real accessible text.
      timeline.to(scrim, { opacity: 1, duration: 1.25 }, 7.45)
        .to(copy, { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 7.7)
        .to(courtyard, { scale: 1.22, duration: 2.1 }, 8.4);
    }, section);

    // The previous chapter has its own triggers; a single refresh is sufficient
    // after the new layout enters the page.
    ScrollTrigger.refresh();
    return () => context.revert();
  }, []);

  return (
    <section id="venue" ref={sectionRef} className={styles.story} aria-labelledby="venue-title">
      <div className={styles.stage}>
        <div className={styles.parchment} aria-hidden="true" />

        <Layer name="courtyard" file="venue-courtyard.png" className={styles.courtyard}
          sizes="100vw" cover />
        <Layer name="walkway" file="venue-path.png" className={styles.walkway}
          sizes="(max-width: 700px) 116vw, 760px" />
        <Layer name="rays" file="gateway-light-rays.png" className={styles.rays}
          sizes="100vw" cover />
        <Layer name="mist" file="gateway-mist.png" className={styles.mist}
          sizes="100vw" cover />

        <Layer name="curtain-left" file="curtain-left.png" className={styles.curtainLeft}
          sizes="(max-width: 700px) 58vw, 390px" />
        <Layer name="curtain-right" file="curtain-right.png" className={styles.curtainRight}
          sizes="(max-width: 700px) 58vw, 390px" />
        <Layer name="lanterns" file="gateway-lanterns.png" className={styles.lanterns}
          sizes="(max-width: 700px) 98vw, 590px" />
        <Layer name="pillar-left" file="gateway-pillar-left.png" className={styles.pillarLeft}
          sizes="(max-width: 700px) 44vw, 300px" />
        <Layer name="pillar-right" file="gateway-pillar-right.png" className={styles.pillarRight}
          sizes="(max-width: 700px) 44vw, 300px" />
        <Layer name="crown" file="gateway-crown.png" className={styles.crown}
          sizes="(max-width: 700px) 125vw, 900px" />
        <Layer name="florals-left" file="gateway-florals-left.png" className={styles.floralLeft}
          sizes="(max-width: 700px) 54vw, 420px" />
        <Layer name="florals-right" file="gateway-florals-right.png" className={styles.floralRight}
          sizes="(max-width: 700px) 54vw, 420px" mirrored />

        <div className={styles.readingScrim} data-gw="scrim" aria-hidden="true" />
        <div className={styles.copy} data-gw="copy">
          <VenueDetails gateway />
        </div>
        <div className={styles.scrollCue} data-gw="cue" aria-hidden="true">
          <span>THE ROYAL GATEWAY</span>
          <span className={styles.scrollCueLine} />
          <span>SCROLL TO ENTER</span>
        </div>
      </div>
    </section>
  );
}
