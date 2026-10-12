"use client";

import { useEffect, useState } from "react";

/**
 * A revision counter only for changes that alter how scroll motion is built.
 * The mobile browser URL bar cannot trigger a reinitialization.
 */
export default function useMotionLayoutRevision(): number {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const preferences = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(orientation: landscape) and (max-height: 560px)"),
    ];
    const update = () => setRevision((value) => value + 1);
    preferences.forEach((media) => media.addEventListener("change", update));
    return () => {
      preferences.forEach((media) => media.removeEventListener("change", update));
    };
  }, []);
  return revision;
}
