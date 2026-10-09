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

      const handoff = element("handoff");
      const sigil = element("handoff-sigil");
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

      if (!handoff || !sigil || !veil || !courtyard || !walkway || !mist || !rays || !crown ||
          !leftPillar || !rightPillar || !leftCurtain || !rightCurtain ||
          !leftFlowers || !rightFlowers || !lanterns || !scrim || !copy || !cue) return;

      // 02 -> 03: a connected parchment-to-royal-gateway reveal.
      // This lightweight overlapping mist arrives BEFORE the gateway reaches
      // the top of the viewport; it hides the former hard horizontal seam.
      gsap.fromTo(handoff,
        { autoAlpha: 0.3, y: 34 },
        {
          autoAlpha: 1, y: -12, ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: 0.6,
          },
        });
      gsap.fromTo(sigil,
        { autoAlpha: 0, scale: 0.86, y: 20 },
        {
          autoAlpha: 1, scale: 1, y: 0, ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 14%",
            scrub: 0.65,
          },
        });

      // Keep the venue's real HTML present in the document. For motion-enabled
      // visitors, we reveal it only when the gate has fully opened.
      gsap.set(veil, { opacity: 1 });
      gsap.set(courtyard, { scale: 1.02, opacity: 0.43, transformOrigin: "center center" });
      gsap.set(walkway, { scale: 0.94, yPercent: 7, opacity: 0, transformOrigin: "center 90%" });
      gsap.set([crown, leftPillar, rightPillar], { autoAlpha: 0, y: 64, scale: 0.97 });
      gsap.set([leftPillar, rightPillar], { transformOrigin: "center 65%" });
      gsap.set(crown, { transformOrigin: "center 72%" });
      gsap.set(leftCurtain, { autoAlpha: 0, xPercent: 9, transformOrigin: "left top" });
      gsap.set(rightCurtain, { autoAlpha: 0, xPercent: -9, transformOrigin: "right top" });
      gsap.set([leftFlowers, rightFlowers], { autoAlpha: 0, y: 40 });
      gsap.set(lanterns, { autoAlpha: 0, y: -14 });
      gsap.set(mist, { opacity: 0.93, yPercent: 1 });
      gsap.set(rays, { opacity: 0, scale: 0.96, transformOrigin: "center top" });
      gsap.set(scrim, { opacity: 0 });
      gsap.set(copy, { autoAlpha: 0, y: 24 });
      gsap.set(cue, { autoAlpha: 1 });

      // Five storyboard beats: 00–20 parchment, 20–45 mist,
      // 45–65 architecture, 65–85 curtains, 85–100 venue copy.
      // One reversible scrub: no JS pinning, wheel interception or
      // permanently looping expensive transforms on mobile.
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });

      // 00–20%: let the lotus handoff complete over shared ivory parchment.
      timeline.to({}, { duration: 2 }, 0);

      // 20–45%: atmospheric mist reveals the distant courtyard and path.
      timeline.to(veil, { opacity: 0.67, duration: 2.5 }, 2)
        .to(courtyard, { opacity: 0.9, scale: 1.045, duration: 2.5 }, 2)
        .to(mist, { opacity: 0.71, yPercent: 6, duration: 2.5 }, 2)
        .to(walkway, { opacity: 0.64, yPercent: 0, scale: 1, duration: 2.15 }, 2.3)
        .to(cue, { autoAlpha: 0, duration: 0.8 }, 2.1);

      // 45–65%: the three-piece heritage architecture enters in depth.
      timeline.to(veil, { opacity: 0, duration: 1.7 }, 4.5)
        .to([crown, leftPillar, rightPillar], {
          autoAlpha: 1, y: 0, scale: 1, duration: 1.8, stagger: 0.09,
        }, 4.5)
        .to([leftFlowers, rightFlowers], { autoAlpha: 0.86, y: 0, duration: 1.6 }, 4.7)
        .to(lanterns, { autoAlpha: 0.82, y: 0, duration: 1.4 }, 5)
        .to(mist, { opacity: 0.42, yPercent: 9, duration: 1.8 }, 4.7)
        .to([leftCurtain, rightCurtain], { autoAlpha: 1, duration: 1.05 }, 5.4);

      // 65–85%: silk curtains part; warm sunlight reaches the stone path.
      timeline.to(leftCurtain, { xPercent: -68, rotation: -1.2, duration: 2 }, 6.5)
        .to(rightCurtain, { xPercent: 68, rotation: 1.2, duration: 2 }, 6.5)
        .to(courtyard, { scale: 1.105, opacity: 1, duration: 2 }, 6.5)
        .to(walkway, { scale: 1.075, opacity: 0.8, duration: 2 }, 6.5)
        .to(rays, { opacity: 0.27, scale: 1.06, duration: 1.5 }, 6.7)
        .to(mist, { opacity: 0.25, yPercent: 11, duration: 1.9 }, 6.5);

      // 85–100%: simplify the stage for reading. The architecture frames
      // the invitation but neither curtains nor flowers cross its text.
      timeline.to([leftCurtain, rightCurtain], { autoAlpha: 0.14, duration: 1 }, 8.5)
        .to([leftFlowers, rightFlowers], { opacity: 0.34, duration: 1.15 }, 8.5)
        .to([crown, leftPillar, rightPillar], { opacity: 0.23, duration: 1.15 }, 8.5)
        .to(lanterns, { opacity: 0.16, duration: 0.8 }, 8.5)
        .to(scrim, { opacity: 1, duration: 1.1 }, 8.5)
        .to(copy, { autoAlpha: 1, y: 0, duration: 1.15, ease: "power2.out" }, 8.65)
        .to({}, { duration: 0.3 }, 9.7);
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
        <div className={styles.venueVeil} data-gw="veil" aria-hidden="true" />

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
