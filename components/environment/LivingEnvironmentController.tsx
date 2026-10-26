"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { sampleWind } from "./wind";

type MovingSurface = {
  element: HTMLElement;
  phase: number;
  strength: number;
  direction: number;
  kind: "border" | "petal" | "butterfly";
  visible: boolean;
  x: (value: number) => void;
  y: (value: number) => void;
  rotation: (value: number) => void;
};

/**
 * Single ticking wind field. Only inner artwork surfaces are animated:
 * their parent wrappers remain owned by the existing scroll timelines.
 */
export default function LivingEnvironmentController() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-wind-surface], [data-wind-petal], [data-wind-butterfly]"
      )
    );
    const surfaces: MovingSurface[] = nodes.map((element, index) => {
      const host = element.closest<HTMLElement>("[data-living-border]");
      const kind: MovingSurface["kind"] = element.hasAttribute("data-wind-petal")
        ? "petal" : element.hasAttribute("data-wind-butterfly")
          ? "butterfly" : "border";
      const rawStrength = Number(host?.dataset.windStrength ?? 1);
      return {
        element,
        phase: index * 1.17,
        strength: Number.isFinite(rawStrength) ? Math.max(0, Math.min(1.5, rawStrength)) : 1,
        direction: host?.dataset.windDirection === "reverse" ? -1 : 1,
        kind,
        visible: false,
        x: gsap.quickSetter(element, "x", "px"),
        y: gsap.quickSetter(element, "y", "px"),
        rotation: gsap.quickSetter(element, "rotation", "deg"),
      };
    });

    const surfaceByNode = new Map(surfaces.map((item) => [item.element, item]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const item = surfaceByNode.get(target as HTMLElement);
        if (item) item.visible = isIntersecting;
      });
    }, { rootMargin: "110px 0px", threshold: 0 });

    surfaces.forEach(({ element }) => observer.observe(element));

    const tick = () => {
      if (document.hidden) return;
      const t = gsap.ticker.time;
      const breeze = sampleWind(t);
      for (const item of surfaces) {
        if (!item.visible) continue;
        const secondary = Math.sin(t * 0.37 + item.phase);
        const s = item.strength * item.direction;
        if (item.kind === "border") {
          item.x((breeze * 3.2 + secondary * 1.4) * s);
          item.y((breeze * -1.5 + secondary * 1.1) * item.strength);
          item.rotation((breeze * 1.1 + secondary * 0.55) * s);
        } else if (item.kind === "petal") {
          item.x(breeze * 4.2 + secondary * 1.8);
          item.y(secondary * 1.4);
          item.rotation(breeze * 4.1 + secondary * 2);
        } else {
          // Flight-path wrappers are controlled by ScrollTrigger;
          // this only gives their inner artwork shared-air turbulence.
          item.x(breeze * 4 + secondary * 2);
          item.y(breeze * 2 + secondary * 2.5);
          item.rotation(breeze * 2.5 + secondary * 1.5);
        }
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      observer.disconnect();
      surfaces.forEach((item) => gsap.set(item.element, { clearProps: "x,y,rotation" }));
    };
  }, []);

  return null;
}
