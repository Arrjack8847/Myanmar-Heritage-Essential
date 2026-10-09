"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HeirloomBlessingTransition.module.css";

/**
 * Scroll-native handoff from the heirloom photographs to the final blessing.
 * The same parchment, golden mist and royal foil emblem continue across
 * chapter boundaries. No scroll locking, pinning or video is required.
 */
export default function HeirloomBlessingTransition() {
  const bridgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bridge = bridgeRef.current;
    if (!bridge || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const thread = bridge.querySelector<HTMLElement>("[data-heirloom-thread]");
      const emblem = bridge.querySelector<HTMLElement>("[data-heirloom-emblem]");
      const words = bridge.querySelector<HTMLElement>("[data-heirloom-words]");
      const light = bridge.querySelector<HTMLElement>("[data-heirloom-light]");
      const flowers = bridge.querySelectorAll<HTMLElement>("[data-heirloom-flower]");
      if (!thread || !emblem || !words || !light) return;

      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: bridge,
          start: "top 94%",
          end: "bottom 12%",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(thread, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0)
        .fromTo(light, { opacity: 0.14, scale: 0.92 }, { opacity: 0.85, scale: 1.04, duration: 0.66 }, 0.1)
        .fromTo(emblem,
          { autoAlpha: 0.28, y: 44, scale: 0.85 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.46 }, 0.18)
        .fromTo(words, { autoAlpha: 0.2, y: 19 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.35)
        .to(emblem, { y: -26, scale: 0.94, autoAlpha: 0.52, duration: 0.3 }, 0.7)
        .to(words, { y: -12, autoAlpha: 0.25, duration: 0.3 }, 0.7)
        .to(light, { opacity: 0.35, duration: 0.3 }, 0.7);

      gsap.fromTo(flowers,
        { y: 24 },
        {
          y: -21, ease: "none",
          scrollTrigger: {
            trigger: bridge, start: "top bottom", end: "bottom top", scrub: 1.3,
          },
        });
    }, bridge);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={bridgeRef} className={styles.bridge} aria-hidden="true">
      <div className={styles.light} data-heirloom-light />
      <div className={styles.flowerLeft} data-heirloom-flower>
        <Image src="/heritage/floral-left.png" alt="" fill
          sizes="(max-width: 640px) 46vw, 330px" quality={65} loading="lazy" />
      </div>
      <div className={styles.flowerRight} data-heirloom-flower>
        <Image src="/heritage/floral-right.png" alt="" fill
          sizes="(max-width: 640px) 46vw, 330px" quality={65} loading="lazy" />
      </div>
      <span className={styles.thread}>
        <span className={styles.threadFill} data-heirloom-thread />
      </span>
      <div className={styles.center}>
        <span className={styles.emblem} data-heirloom-emblem>
          <Image src="/heritage/ceremony/royal-transition-ornament.png" alt=""
            width={72} height={116} sizes="72px" quality={75} loading="lazy" />
        </span>
        <span className={styles.words} data-heirloom-words>
          FROM OUR STORY, A NEW BEGINNING
        </span>
      </div>
    </div>
  );
}
