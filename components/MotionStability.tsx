"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Refresh scroll measurements after real layout changes, not every mobile
 * browser-toolbar animation. Keeping the resize loop quiet prevents jitter
 * in Safari while preserving full-resolution artwork and chapter choreography.
 */
export default function MotionStability() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    let raf = 0;
    let delay: number | undefined;
    let cancelled = false;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    const requestRefresh = () => {
      if (cancelled) return;
      if (delay !== undefined) window.clearTimeout(delay);
      delay = window.setTimeout(() => {
        window.cancelAnimationFrame(raf);
        raf = window.requestAnimationFrame(() => {
          if (!cancelled) ScrollTrigger.refresh();
        });
      }, 145);
    };

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const widthChanged = Math.abs(width - viewportWidth) > 1;
      const heightChanged = Math.abs(height - viewportHeight) > 1;
      // iOS and Android URL bars resize the visible viewport repeatedly.
      // Recalculating sticky scroll positions during that animation causes jumps.
      const toolbarOnly = !widthChanged && width < 820 &&
        Math.abs(height - viewportHeight) < 140;
      viewportWidth = width;
      viewportHeight = height;
      if (widthChanged || (heightChanged && !toolbarOnly)) requestRefresh();
    };

    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>(".invitation-page img")
    );
    const onImageSettled = () => requestRefresh();
    const pending = images.filter((img) => !img.complete);
    pending.forEach((img) => {
      img.addEventListener("load", onImageSettled, { once: true });
      img.addEventListener("error", onImageSettled, { once: true });
    });

    const tracked = [
      document.getElementById("welcome"),
      document.querySelector<HTMLElement>(".ceremony-story__scroll"),
      document.getElementById("memories"),
      document.getElementById("with-love"),
    ].filter((element): element is HTMLElement => Boolean(element));

    const sizes = new WeakMap<HTMLElement, { width: number; height: number }>();
    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver((entries) => {
          let changed = false;
          for (const entry of entries) {
            const target = entry.target as HTMLElement;
            const next = { width: entry.contentRect.width, height: entry.contentRect.height };
            const prev = sizes.get(target);
            sizes.set(target, next);
            if (prev && (Math.abs(prev.width - next.width) > 1 ||
              Math.abs(prev.height - next.height) > 2)) changed = true;
          }
          if (changed) requestRefresh();
        })
      : null;
    tracked.forEach((element) => observer?.observe(element));

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", requestRefresh);
    window.addEventListener("pageshow", requestRefresh);
    window.addEventListener("load", requestRefresh);

    if (document.fonts) {
      document.fonts.ready.then(() => {
        if (!cancelled) requestRefresh();
      }).catch(() => {});
    }
    requestRefresh();

    return () => {
      cancelled = true;
      if (delay !== undefined) window.clearTimeout(delay);
      window.cancelAnimationFrame(raf);
      observer?.disconnect();
      pending.forEach((img) => {
        img.removeEventListener("load", onImageSettled);
        img.removeEventListener("error", onImageSettled);
      });
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", requestRefresh);
      window.removeEventListener("pageshow", requestRefresh);
      window.removeEventListener("load", requestRefresh);
    };
  }, []);
  return null;
}
