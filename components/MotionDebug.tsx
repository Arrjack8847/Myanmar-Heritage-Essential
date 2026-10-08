"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Diagnostics = {
  width: number;
  height: number;
  scroll: number;
  reducedMotion: boolean;
  triggers: number;
  imagesReady: number;
  imagesTotal: number;
  petalOpacity: string;
  petalAnimations: number;
  cardTransform: string;
};

export default function MotionDebug() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<Diagnostics | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("motionDebug") !== "1") return;
    setEnabled(true);

    const measure = () => {
      gsap.registerPlugin(ScrollTrigger);
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(".royal-story img"));
      const petal = document.querySelector<HTMLElement>(".royal-story__petal");
      const card = document.querySelector<HTMLElement>(".heritage-scene__card");
      setState({
        width: window.innerWidth,
        height: window.innerHeight,
        scroll: Math.round(window.scrollY),
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        triggers: ScrollTrigger.getAll().length,
        imagesReady: imgs.filter((img) => img.complete && img.naturalWidth > 0).length,
        imagesTotal: imgs.length,
        petalOpacity: petal ? getComputedStyle(petal).opacity : "missing",
        petalAnimations: petal ? gsap.getTweensOf(petal).length : 0,
        cardTransform: card ? getComputedStyle(card).transform.slice(0, 34) : "missing",
      });
    };
    measure();
    const timer = window.setInterval(measure, 1250);
    return () => window.clearInterval(timer);
  }, []);

  if (!enabled || !state) return null;

  return (
    <aside aria-label="LAN animation diagnostics"
      style={{
        position: "fixed", zIndex: 9999, right: 8, top: 8, width: 224,
        maxWidth: "calc(100vw - 16px)", maxHeight: "50dvh", overflow: "auto",
        padding: "10px 12px", borderRadius: 9,
        background: "rgba(25,24,30,.94)", color: "#fff",
        boxShadow: "0 8px 22px rgba(0,0,0,.3)", pointerEvents: "none",
        font: "11px/1.55 ui-monospace, SFMono-Regular, Consolas, monospace",
      }}
    >
      <strong style={{ fontSize: 12, color: "#eed3a4" }}>JN-W01 · LAN Motion Debug</strong>
      <div>JS hydration: <strong style={{ color: "#a8f0aa" }}>ACTIVE</strong></div>
      <div>Viewport: {state.width} × {state.height}</div>
      <div>Scroll Y: {state.scroll}px</div>
      <div>Reduced Motion: <strong style={{ color: state.reducedMotion ? "#ffb188" : "#a8f0aa" }}>
        {state.reducedMotion ? "ON (effects skipped)" : "OFF"}
      </strong></div>
      <div>GSAP scroll triggers: {state.triggers}</div>
      <div>Images ready: {state.imagesReady}/{state.imagesTotal}</div>
      <div>Petal opacity: {state.petalOpacity}</div>
      <div>Petal tweens: {state.petalAnimations}</div>
      <div>Card transform: {state.cardTransform}</div>
      <div style={{ color: "#dfc8a8", marginTop: 5 }}>
        Send a screenshot when scrolling between sections.
      </div>
    </aside>
  );
}
