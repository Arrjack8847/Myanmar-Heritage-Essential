"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VenueDetails from "@/components/gateway/VenueDetails";
import { Lotus } from "@/components/Decorations";
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
        loading={name === "courtyard" || name === "crown" ? "eager" : "lazy"}
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

      const handoff = element("handoff");
      const sigil = element("handoff-sigil");
      const entryHaze = element("entry-haze");
      const veil = element("veil");
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

      if (!handoff || !sigil || !entryHaze || !veil || !courtyard || !walkway || !mist || !rays || !crown ||
          !leftPillar || !rightPillar || !leftCurtain || !rightCurtain ||
          !leftFlowers || !rightFlowers || !lanterns || !scrim || !copy || !cue) return;

      // A soft parchment-to-landscape bridge; scenic silhouettes remain
      // visible. The handoff uses its own scroll range, no competing veil.
      gsap.fromTo(handoff,
        { autoAlpha: 0.36, y: 20 },
        {
          autoAlpha: 0.8, y: -6, ease: "none",
          scrollTrigger: {
            trigger: section, start: "top bottom",
            end: "top top", scrub: 0.6,
          },
        });
      gsap.fromTo(sigil,
        { autoAlpha: 0.2, scale: 0.88, y: 16 },
        {
          autoAlpha: 0.78, scale: 1, y: 0, ease: "none",
          scrollTrigger: {
            trigger: section, start: "top 86%",
            end: "top 24%", scrub: 0.6,
          },
        });

      // The older theatrical sequence, refined: never hide every scenic
      // layer together. The golden courtyard and distant gate are present
      // from the first frame, though they remain quiet until the reveal.
      gsap.set(entryHaze, { opacity: 1 });
      gsap.set(veil, { opacity: 0.22 });
      gsap.set(courtyard, { opacity: 0.8, scale: 1.01, transformOrigin: "center center" });
      gsap.set(walkway, { opacity: 0.25, scale: 0.96, yPercent: 5, transformOrigin: "center 90%" });
      gsap.set([crown, leftPillar, rightPillar], {
        opacity: 0.23, y: 29, scale: 0.94, transformOrigin: "center 68%",
      });
      gsap.set(leftCurtain, { autoAlpha: 0, xPercent: 10, transformOrigin: "left top" });
      gsap.set(rightCurtain, { autoAlpha: 0, xPercent: -10, transformOrigin: "right top" });
      gsap.set([leftFlowers, rightFlowers], { autoAlpha: 0, y: 28 });
      gsap.set(lanterns, { autoAlpha: 0, y: -16 });
      gsap.set(mist, { opacity: 0.46, yPercent: 0 });
      gsap.set(rays, { opacity: 0.07, scale: 1, transformOrigin: "center top" });
      gsap.set(scrim, { opacity: 0 });
      gsap.set(copy, { autoAlpha: 0, y: 16 });
      gsap.set(cue, { autoAlpha: 1 });

      // Five calm beats across a 3.1-viewport native scroll:
      // 0–15% atmosphere; 15–35% architecture; 35–60% silk reveal;
      // 60–75% courtyard arrival; 75–100% quiet reading hold.
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.68,
          invalidateOnRefresh: true,
        },
      });

      // 0–15%: air and landscape already exist; only soft depth changes.
      timeline
        // Golden-hour scenery stays visible below the upper parchment haze.
        // Reveal the sky naturally as the gate begins its established entrance.
        .to(entryHaze, { opacity: 0, duration: 2.15 }, 0)
        .to(courtyard, { opacity: 0.9, scale: 1.025, duration: 1.5 }, 0)
        .to(walkway, { opacity: 0.38, scale: 0.985, yPercent: 2, duration: 1.5 }, 0)
        .to(veil, { opacity: 0.13, duration: 1.5 }, 0)
        .to(mist, { opacity: 0.44, yPercent: 2, duration: 1.5 }, 0);

      // 15–35%: the gold crown and pillars slowly emerge as one focal point.
      timeline
        .to([crown, leftPillar, rightPillar], {
          opacity: 1, y: 0, scale: 1, duration: 2,
        }, 1.5)
        .to(walkway, { opacity: 0.7, scale: 1.03, yPercent: 0, duration: 2 }, 1.5)
        .to(courtyard, { scale: 1.07, duration: 2 }, 1.5)
        .to(veil, { opacity: 0.02, duration: 2 }, 1.5)
        .to(mist, { opacity: 0.32, yPercent: 6, duration: 2 }, 1.5)
        .to(cue, { autoAlpha: 0, duration: 0.75 }, 2.6);

      // 35–60%: curtains become visible only after the gateway is
      // established, then open with a deliberate theatrical rhythm.
      timeline
        .to([leftCurtain, rightCurtain], { autoAlpha: 1, duration: 0.4 }, 3.5)
        .to(leftCurtain, { xPercent: -60, rotation: -1, duration: 2.2 }, 3.8)
        .to(rightCurtain, { xPercent: 60, rotation: 1, duration: 2.2 }, 3.8)
        .to([leftFlowers, rightFlowers], { autoAlpha: 0.7, y: 0, duration: 1.7 }, 3.85)
        .to(lanterns, { autoAlpha: 0.72, y: 0, duration: 1.8 }, 3.8)
        .to(rays, { opacity: 0.24, scale: 1.04, duration: 1.6 }, 4.15)
        .to(mist, { opacity: 0.21, yPercent: 9, duration: 2 }, 3.9)
        .to(courtyard, { scale: 1.105, duration: 2 }, 4);

      // 60–75%: a restrained approach, with architecture moving toward
      // the margins while the text area gains a local reading gradient.
      timeline
        .to(courtyard, { scale: 1.15, duration: 1.5 }, 6)
        .to(walkway, { scale: 1.13, yPercent: 10, opacity: 0.55, duration: 1.5 }, 6)
        .to(crown, { scale: 1.1, yPercent: -15, opacity: 0.36, duration: 1.5 }, 6)
        .to(leftPillar, { xPercent: -27, opacity: 0.38, duration: 1.5 }, 6)
        .to(rightPillar, { xPercent: 27, opacity: 0.38, duration: 1.5 }, 6)
        .to(leftCurtain, { xPercent: -77, opacity: 0.16, duration: 1.5 }, 6)
        .to(rightCurtain, { xPercent: 77, opacity: 0.16, duration: 1.5 }, 6)
        .to([leftFlowers, rightFlowers], { opacity: 0.26, duration: 1.5 }, 6)
        .to(lanterns, { opacity: 0.18, duration: 1.5 }, 6)
        .to(mist, { opacity: 0.14, duration: 1.5 }, 6)
        .to(scrim, { opacity: 0.9, duration: 1.4 }, 6.1)
        .to(copy, { autoAlpha: 1, y: 0, duration: 1.15, ease: "power2.out" }, 6.35);

      // 75–100%: hold the completed courtyard and editable venue text
      // still long enough for guests to read the destination and directions.
      timeline.to({}, { duration: 2.5 }, 7.5);
    }, section);

    // The previous chapter has its own triggers; a single refresh is sufficient
    // after the new layout enters the page.
    ScrollTrigger.refresh();
    return () => context.revert();
  }, []);

  return (
    <section id="venue" ref={sectionRef} className={styles.story} aria-labelledby="venue-title">
      <div className={styles.handoff} data-gw="handoff" aria-hidden="true">
        <div className={styles.handoffSky} />
        <div className={styles.handoffCanopy} />
        <div className={styles.handoffSigil} data-gw="handoff-sigil">
          <span className={styles.handoffThread} />
          <Lotus />
          <span className={styles.handoffThread} />
        </div>
      </div>
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
        <div className={styles.venueVeil} data-gw="veil" aria-hidden="true" />
        <div className={styles.entryHaze} data-gw="entry-haze" aria-hidden="true" />

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
