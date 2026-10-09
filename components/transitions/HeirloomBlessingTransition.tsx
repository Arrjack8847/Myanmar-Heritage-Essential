"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HeirloomBlessingTransition.module.css";

/**
 * Scroll-native handoff from the heirloom photographs to the final blessing.
 * A single fine gold thread carries the album into the final royal emblem.
 * No extra chapter, scroll locking, pinning or video is required.
 */
export default function HeirloomBlessingTransition() {
  const bridgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bridge = bridgeRef.current;
    if (!bridge || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const thread = bridge.querySelector<HTMLElement>("[data-heirloom-thread]");
      const light = bridge.querySelector<HTMLElement>("[data-heirloom-light]");
      const flowers = bridge.querySelectorAll<HTMLElement>("[data-heirloom-flower]");
      if (!thread || !light) return;

      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: bridge,
          start: "top 94%",
          end: "bottom 35%",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(thread, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0)
        .fromTo(light, { opacity: 0.12, scale: 0.96 },
          { opacity: 0.54, scale: 1, duration: 0.72 }, 0.12)
        .to(light, { opacity: 0.27, duration: 0.28 }, 0.72);

      gsap.fromTo(flowers,
        { y: 9 },
        {
          y: -8, ease: "none",
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
    </div>
  );
}
