"use client";

import Image from "next/image";
import { useRef } from "react";

const GOLD_THREAD = [
  "M120 -24",
  "C120 72 111 96 109 174",
  "C107 238 114 278 114 340",
  "C114 446 140 490 142 614",
  "C144 736 136 792 136 900",
  "C136 1023 101 1104 100 1210",
  "C99 1342 110 1393 110 1460",
  "C110 1560 130 1628 132 1688",
  "C134 1757 122 1790 122 1828",
].join(" ");

type Props = {
  className: string;
  pathClassName: string;
  markerClassName: string;
};

/**
 * The path geometry is identical to public/heritage/memories/memory-golden-thread.svg.
 * It is inlined because ScrollTrigger must animate its actual SVG stroke; a CSS
 * background-image or an <img> would be impossible to draw progressively.
 */
export default function JourneyTimeline({ className, pathClassName, markerClassName }: Props) {
  const pathRef = useRef<SVGPathElement>(null);
  // Parent owns the GSAP context; the path is selected with data-journey-thread.
  void pathRef;

  return (
    <div className={className} aria-hidden="true">
      <svg className={pathClassName} viewBox="0 0 240 1800" preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg" fill="none" focusable="false">
        <defs>
          <linearGradient id="jn-w01-journey-gold" x1="96" y1="0" x2="151" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9F7D4B" />
            <stop offset=".28" stopColor="#B9975B" />
            <stop offset=".52" stopColor="#E5D5AF" />
            <stop offset=".74" stopColor="#B9975B" />
            <stop offset="1" stopColor="#9F7D4B" />
          </linearGradient>
        </defs>
        <path d={GOLD_THREAD} stroke="url(#jn-w01-journey-gold)"
          strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
          vectorEffect="non-scaling-stroke" data-journey-thread />
      </svg>
      {[{ y: "18.889%", x: "47.5%" }, { y: "50%", x: "56.667%" }, { y: "81.111%", x: "45.833%" }].map((position, index) => (
        <span key={index} className={markerClassName} data-journey-marker={index}
          style={{ top: position.y, left: position.x }}>
          <Image src="/heritage/memories/memory-lotus-marker.svg"
            fill sizes="(max-width: 640px) 36px, 51px" alt="" />
        </span>
      ))}
    </div>
  );
}
