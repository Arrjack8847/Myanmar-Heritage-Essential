"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Keep GSAP trigger measurements reliable after mobile Safari URL-bar changes,
 * delayed responsive images/fonts, back-forward navigation and orientation.
 * Never disables or reduces an animation for phones.
 */
export default function MotionStability() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    let frame1 = 0;
    let frame2 = 0;
    let debounce: ReturnType<typeof setTimeout> | undefined;

    const refresh = () => {
      window.cancelAnimationFrame(frame1);
      window.cancelAnimationFrame(frame2);
      if (debounce !== undefined) clearTimeout(debounce);
      debounce = setTimeout(() => {
        frame1 = window.requestAnimationFrame(() => {
          frame2 = window.requestAnimationFrame(() => ScrollTrigger.refresh());
        });
      }, 100);
    };

    const story = document.querySelector<HTMLElement>(".royal-story");
    const hero = document.getElementById("welcome");
    const page = document.querySelector<HTMLElement>(".ceremony-page");
    const images = story ? Array.from(story.querySelectorAll<HTMLImageElement>("img")) : [];
    const pending = images.filter((img) => !img.complete);
    pending.forEach((img) => {
      img.addEventListener("load", refresh);
      img.addEventListener("error", refresh);
    });

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(refresh)
      : null;
    if (hero) resizeObserver?.observe(hero);
    if (page) resizeObserver?.observe(page);

    window.addEventListener("load", refresh);
    window.addEventListener("pageshow", refresh);
    window.addEventListener("orientationchange", refresh);

    // Fonts alter heading size and therefore section / trigger positions.
    let cancelled = false;
    if (document.fonts) {
      document.fonts.ready.then(() => {
        if (!cancelled) refresh();
      }).catch(() => {});
    }
    refresh();

    return () => {
      cancelled = true;
      if (debounce !== undefined) clearTimeout(debounce);
      window.cancelAnimationFrame(frame1);
      window.cancelAnimationFrame(frame2);
      window.removeEventListener("load", refresh);
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("orientationchange", refresh);
      pending.forEach((img) => {
        img.removeEventListener("load", refresh);
        img.removeEventListener("error", refresh);
      });
      resizeObserver?.disconnect();
    };
  }, []);

  return null;
}
