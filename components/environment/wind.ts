/**
 * One deterministic wind rhythm for the invitation's floral borders, petals
 * and butterflies. The shared signal avoids unrelated looping animations.
 */
export function sampleWind(seconds: number): number {
  return Math.sin(seconds * 0.58) * 0.68
    + Math.sin(seconds * 0.24 + 0.8) * 0.32;
}
