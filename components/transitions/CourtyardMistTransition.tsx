"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./CourtyardMistTransition.module.css";

/**
 * JN-W01 / 02 → 03: a real photographic-to-ivory dissolve inspired by
 * the approved mobile reference. The image is the same approved venue image
 * used by RoyalGateway, so entering the next scene feels continuous.
 *
 * No wheel interception, JS pinning, canvas, video or duplicate venue copy.
 * The short CSS-sticky bridge uses natural scrolling and reverses automatically.
 */
export default function CourtyardMistTransition() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const scope = gsap.context(() => {
      const scene = root.querySelector<HTMLElement>("[data-courtyard-dissolve='scene']");
      const mist = root.querySelector<HTMLElement>("[data-courtyard-dissolve='mist']");
      const light = root.querySelector<HTMLElement>("[data-courtyard-dissolve='light']");
      const veil = root.querySelector<HTMLElement>("[data-courtyard-dissolve='veil']");
      if (!scene || !mist || !light || !veil) return;

      // One reversible scrub: photograph first, soft ivory atmosphere second.
      // The image never fully disappears, preventing a blank transition frame.
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(scene,
          { opacity: 0.3, scale: 1.085, yPercent: 3 },
          { opacity: 0.94, scale: 1.025, yPercent: -1, duration: 0.36 }, 0)
        .to(scene, { opacity: 0.82, scale: 1, yPercent: -2, duration: 0.64 }, 0.36)
        .fromTo(mist, { opacity: 0.5, yPercent: 5 },
          { opacity: 0.24, yPercent: -3, duration: 0.52 }, 0)
        .to(mist, { opacity: 0.5, yPercent: -7, duration: 0.48 }, 0.52)
        .fromTo(light, { opacity: 0.7 }, { opacity: 0.2, duration: 0.35 }, 0)
        .to(light, { opacity: 0.43, duration: 0.65 }, 0.35)
        .fromTo(veil, { opacity: 0.76 }, { opacity: 0.22, duration: 0.38 }, 0)
        .to(veil, { opacity: 0.52, duration: 0.62 }, 0.38);
    }, root);

    return () => scope.revert();
  }, []);

  return (
    <div ref={ref} className={styles.bridge} aria-hidden="true">
      <div className={styles.stage}>
        <div className={styles.parchment} />
        <div className={styles.courtyard} data-courtyard-dissolve="scene">
          <Image
            src="/heritage/gateway/venue-courtyard.png"
            alt=""
            fill
            sizes="100vw"
            quality={77}
            loading="lazy"
            draggable={false}
          />
        </div>
        <div className={styles.mist} data-courtyard-dissolve="mist">
          <Image
            src="/heritage/gateway/gateway-mist.png"
            alt=""
            fill
            sizes="100vw"
            quality={68}
            loading="lazy"
            draggable={false}
          />
        </div>
        <div className={styles.light} data-courtyard-dissolve="light" />
        <div className={styles.veil} data-courtyard-dissolve="veil" />
        <div className={styles.ivoryFeather} />
      </div>
    </div>
  );
}
