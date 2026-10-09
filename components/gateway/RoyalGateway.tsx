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
        loading={name === "courtyard" ? "eager" : "lazy"}
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

      if (!handoff || !sigil || !courtyard || !walkway || !mist || !rays || !crown ||
          !leftPillar || !rightPillar || !leftCurtain || !rightCurtain ||
          !leftFlowers || !rightFlowers || !lanterns || !scrim || !copy || !cue) return;

      // A see-through landscape handoff overlaps the end of the ceremony.
      // The scene behind it is NEVER an opaque parchment or empty canvas.
      gsap.fromTo(handoff, { y: 24, opacity: 0.5 }, {
        y: -8, opacity: 1, ease: "none",
        scrollTrigger: {
          trigger: section, start: "top bottom", end: "top top", scrub: 0.55,
        },
      });
      gsap.fromTo(sigil, { opacity: 0.4, y: 14, scale: 0.91 }, {
        opacity: 1, y: 0, scale: 1, ease: "none",
        scrollTrigger: {
          trigger: section, start: "top 91%", end: "top 21%", scrub: 0.6,
        },
      });

      // From the very first frame we can see the destination, distant crown,
      // pillars and curtains. The GSAP scene only increases depth and scale.
      gsap.set(courtyard, { opacity: 1, scale: 1.015, transformOrigin: "center 52%" });
      gsap.set(walkway, { opacity: 0.66, yPercent: 4, scale: 0.92, transformOrigin: "center 90%" });
      gsap.set([crown, leftPillar, rightPillar], {
        opacity: 0.78, y: 21, scale: 0.81, transformOrigin: "center 62%",
      });
      gsap.set(leftCurtain, { opacity: 0.86, xPercent: 9, transformOrigin: "left top" });
      gsap.set(rightCurtain, { opacity: 0.86, xPercent: -9, transformOrigin: "right top" });
      gsap.set([leftFlowers, rightFlowers], { opacity: 0.46, y: 23 });
      gsap.set(lanterns, { opacity: 0.46, y: -12 });
      gsap.set(mist, { opacity: 0.34, yPercent: 0 });
      gsap.set(rays, { opacity: 0.13, scale: 1, transformOrigin: "center top" });
      gsap.set(scrim, { opacity: 0 });
      gsap.set(copy, { autoAlpha: 0, y: 16 });
      gsap.set(cue, { autoAlpha: 1 });

      // A shorter 2-viewport native scroll: approaching the gate, opening
      // the silk and reading the venue. Scroll remains fully reversible.
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      // 00–25%: approach from a distance through a *visible* courtyard.
      timeline
        .to(courtyard, { scale: 1.065, duration: 2.5 }, 0)
        .to(walkway, { scale: 1.02, opacity: 0.86, yPercent: 0, duration: 2.5 }, 0)
        .to([crown, leftPillar, rightPillar], {
          y: 0, scale: 0.96, opacity: 1, duration: 2.5,
        }, 0)
        .to([leftFlowers, rightFlowers], { y: 0, opacity: 0.76, duration: 2.5 }, 0)
        .to(lanterns, { opacity: 0.75, y: 0, duration: 2.3 }, 0)
        .to(mist, { opacity: 0.27, yPercent: 5, duration: 2.5 }, 0)
        .to(cue, { autoAlpha: 0, duration: 0.8 }, 1.7);

      // 25–48%: gentle forward camera push, the crown reaches full scale.
      timeline
        .to(courtyard, { scale: 1.115, duration: 2.3 }, 2.5)
        .to(walkway, { scale: 1.1, duration: 2.3 }, 2.5)
        .to([crown, leftPillar, rightPillar], { scale: 1.055, duration: 2.3 }, 2.5)
        .to(rays, { opacity: 0.23, duration: 2 }, 2.7);

      // 48–68%: curtains genuinely open while flowers move in parallax.
      timeline
        .to(leftCurtain, { xPercent: -77, rotation: -1.1, opacity: 0.8, duration: 2 }, 4.8)
        .to(rightCurtain, { xPercent: 77, rotation: 1.1, opacity: 0.8, duration: 2 }, 4.8)
        .to(leftFlowers, { xPercent: -19, scale: 1.09, duration: 2 }, 4.8)
        .to(rightFlowers, { xPercent: 19, scale: 1.09, duration: 2 }, 4.8)
        .to(courtyard, { scale: 1.17, duration: 2 }, 4.8)
        .to(walkway, { scale: 1.2, yPercent: 9, duration: 2 }, 4.8)
        .to(mist, { opacity: 0.15, duration: 2 }, 4.8);

      // 68–81%: pass under the crown, with a LOCAL reading gradient that
      // softens only the centre instead of washing out the full environment.
      timeline
        .to(crown, { scale: 1.14, yPercent: -12, opacity: 0.4, duration: 1.3 }, 6.8)
        .to(leftPillar, { xPercent: -24, opacity: 0.4, duration: 1.3 }, 6.8)
        .to(rightPillar, { xPercent: 24, opacity: 0.4, duration: 1.3 }, 6.8)
        .to([leftCurtain, rightCurtain], { opacity: 0.35, duration: 1.3 }, 6.8)
        .to([leftFlowers, rightFlowers], { opacity: 0.43, duration: 1.3 }, 6.8)
        .to(scrim, { opacity: 1, duration: 1.3 }, 6.8)
        .to(copy, { autoAlpha: 1, y: 0, duration: 1.1, ease: "power2.out" }, 7.05);

      // 81–100%: hold the completely editable venue details for reading.
      timeline.to({}, { duration: 1.9 }, 8.1);
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
