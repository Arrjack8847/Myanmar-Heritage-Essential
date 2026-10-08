import type { SVGProps } from "react";

type DecorationProps = SVGProps<SVGSVGElement>;

/** Generic, original line motifs informed by Myanmar ornamental symmetry. */
export function HeritageCrest(props: DecorationProps) {
  return (
    <svg viewBox="0 0 180 90" fill="none" aria-hidden="true" {...props}>
      <path d="M90 5c-5 18-15 22-15 32 0 7 7 13 15 18 8-5 15-11 15-18 0-10-10-14-15-32Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M90 16c-3 13-7 16-7 23 0 4 3 8 7 11 4-3 7-7 7-11 0-7-4-10-7-23Z" fill="currentColor" opacity=".22"/>
      <path d="M90 55c-13-20-26-28-39-24 8 5 11 13 12 19-16-8-30-7-40 4 14 0 24 4 30 13M90 55c13-20 26-28 39-24-8 5-11 13-12 19 16-8 30-7 40 4-14 0-24 4-30 13" stroke="currentColor" strokeWidth="1.45"/>
      <path d="M10 68c25-4 40 12 80 12 40 0 55-16 80-12M45 73c16-2 28-8 45-8s29 6 45 8M90 55v25" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M60 42c1 10 7 18 16 21M120 42c-1 10-7 18-16 21" stroke="currentColor" strokeWidth="1"/>
      <circle cx="90" cy="61" r="3" fill="currentColor"/>
      <circle cx="28" cy="58" r="2.2" fill="currentColor"/>
      <circle cx="152" cy="58" r="2.2" fill="currentColor"/>
      <path d="M90 85v4M50 77l-3 5M130 77l3 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

export function Lotus(props: DecorationProps) {
  return (
    <svg viewBox="0 0 200 180" fill="none" aria-hidden="true" {...props}>
      <path d="M100 119C78 92 79 63 100 28c21 35 22 64 0 91Z" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M95 120C60 111 47 87 49 57c29 10 46 30 46 63ZM105 120c35-9 48-33 46-63-29 10-46 30-46 63Z" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M88 127C52 134 25 118 13 92c34-6 60 3 75 35ZM112 127c36 7 63-9 75-35-34-6-60 3-75 35Z" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M32 129c32 15 104 15 136 0M52 146c26 9 70 9 96 0M99 118v28" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M100 40v62M62 67l28 41M138 67l-28 41" stroke="currentColor" strokeWidth=".8" opacity=".5"/>
      <circle cx="100" cy="147" r="3" fill="currentColor"/>
    </svg>
  );
}

export function CornerFlourish(props: DecorationProps) {
  return (
    <svg viewBox="0 0 164 164" fill="none" aria-hidden="true" {...props}>
      <path d="M6 139V32Q6 6 32 6h107M15 124V35q0-20 20-20h89" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M6 39c28 0 34 14 34 34 0-21 12-33 34-34C52 39 40 28 40 6 40 28 28 39 6 39Z" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M47 42c13 3 19 9 23 22 4-13 10-19 23-22-13-4-19-10-23-23-4 13-10 19-23 23Z" stroke="currentColor" strokeWidth="1.1"/>
      <path d="M21 94c23-7 41-3 49 13M94 21c-7 23-3 41 13 49M26 102c16 0 24 9 25 22M102 26c0 16 9 24 22 25" stroke="currentColor" strokeWidth="1.15"/>
      <circle cx="40" cy="39" r="4" fill="currentColor"/>
      <circle cx="74" cy="74" r="2" fill="currentColor"/>
      <circle cx="6" cy="150" r="2.5" fill="currentColor"/>
      <circle cx="150" cy="6" r="2.5" fill="currentColor"/>
    </svg>
  );
}

export function FloralSprig(props: DecorationProps) {
  return (
    <svg viewBox="0 0 200 250" fill="none" aria-hidden="true" {...props}>
      <path d="M25 240C55 188 128 178 170 20" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M52 202c-19-25-12-51 13-68 10 27 5 48-13 68ZM73 178c10-35 37-43 59-37-16 25-34 34-59 37ZM100 138c-23-18-25-42-9-64 17 18 20 41 9 64ZM126 95c8-27 27-36 48-33-11 19-25 29-48 33" fill="currentColor" opacity=".17" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M156 47c-23-10-24-27-14-39 15 11 18 25 14 39ZM167 32c8-18 23-21 30-15-6 10-16 16-30 15" fill="currentColor" opacity=".14" stroke="currentColor"/>
      <circle cx="45" cy="210" r="4" fill="currentColor"/>
    </svg>
  );
}

export function DividerMotif(props: DecorationProps) {
  return (
    <svg viewBox="0 0 310 32" fill="none" aria-hidden="true" {...props}>
      <path d="M0 16h116m78 0h116" stroke="currentColor" strokeWidth="1" opacity=".55"/>
      <path d="M155 2c-8 8-13 9-13 14s5 6 13 14c8-8 13-9 13-14s-5-6-13-14Z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M121 16c11-2 18-7 21-13M121 16c11 2 18 7 21 13M189 16c-11-2-18-7-21-13M189 16c-11 2-18 7-21 13" stroke="currentColor" strokeWidth="1.1"/>
      <circle cx="155" cy="16" r="3" fill="currentColor"/>
      <circle cx="111" cy="16" r="2" fill="currentColor"/>
      <circle cx="199" cy="16" r="2" fill="currentColor"/>
    </svg>
  );
}

export function PagodaSkyline(props: DecorationProps) {
  return (
    <svg viewBox="0 0 820 190" fill="none" aria-hidden="true" {...props}>
      <path d="M0 178h820" stroke="currentColor"/>
      <path d="M70 178v-45h52v45m-62-45h72l-36-23-36 23Zm17-27h39l-20-20-19 20Zm19-22V61M86 61h20M96 48v13" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M235 178v-55h80v55m-91-55h102l-51-35-51 35Zm24-37h54l-27-24-27 24Zm19-26h17l-9-27-8 27Zm9-27V18" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M260 178v-34h30v34m-50-28h70M275 95v22M247 121v-14m56 14v-14" stroke="currentColor" strokeWidth="1"/>
      <path d="M393 178v-39h42v39m-51-39h60l-30-21-30 21Zm14-22h32l-16-15-16 15Zm16-19V65" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M503 178v-50h72v50m-82-50h92l-46-31-46 31Zm25-35h42l-21-21-21 21Zm21-24V60" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M525 178v-32h28v32m-44-16h60" stroke="currentColor"/>
      <path d="M654 178v-62h77v62m-90-62h103l-52-32-51 32Zm22-34h59l-30-24-29 24Zm19-25h21l-10-26-11 26Zm11-27V16" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M673 178v-38h39v38m-52-31h66M688 84v28M658 116v-12m68 12v-12" stroke="currentColor" strokeWidth="1"/>
      <path d="M14 178v-22h28v22m715 0v-22h28v22M0 155h54m694 0h72" stroke="currentColor"/>
      <path d="M15 149c-2-31 15-46 28-49M772 150c2-31-15-46-28-49" stroke="currentColor" opacity=".65"/>
    </svg>
  );
}

export function VenueIllustration(props: DecorationProps) {
  return (
    <svg viewBox="0 0 500 390" fill="none" aria-hidden="true" {...props}>
      <circle cx="250" cy="181" r="165" stroke="currentColor" opacity=".15" strokeDasharray="2 7"/>
      <path d="M65 315h370M94 298h312v17H94zM119 282h262v16H119z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M126 282V171h248v111M146 282V189h208v93M167 282V206h166v76" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M104 171h292l-146-57-146 57Zm40-65h212l-106-37-106 37Zm51-42h110l-55-26-55 26ZM235 38h30l-15-27-15 27Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M250 11V1M182 188v94M318 188v94M198 282v-50c0-30 23-48 52-48s52 18 52 48v50" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M224 282v-48c0-14 11-26 26-26s26 12 26 26v48M250 209v73" stroke="currentColor"/>
      <path d="M150 221h27m146 0h27m-200 15h27m146 0h27m-200 15h27m146 0h27" stroke="currentColor" opacity=".55"/>
      <path d="M81 298V179m338 119V179M71 180h30m298 0h30M72 178l14-26 15 26m298 0 14-26 15 26" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M35 318h430M61 328h378M101 337h298" stroke="currentColor" opacity=".4"/>
      <path d="M35 280c8-39 20-62 39-76m-27 86c-15-40-14-67-7-79m414 69c-8-39-20-62-39-76m27 86c15-40 14-67 7-79" stroke="currentColor" opacity=".6"/>
      <path d="M74 206c-27-15-33-35-31-51 25 12 32 25 31 51Zm-24 42c-26-4-39-18-40-36 23 2 34 13 40 36Zm376-42c27-15 33-35 31-51-25 12-32 25-31 51Zm24 42c26-4 39-18 40-36-23 2-34 13-40 36Z" fill="currentColor" opacity=".18" stroke="currentColor"/>
      <path d="M190 355h120M217 365h66" stroke="currentColor" opacity=".5"/>
    </svg>
  );
}

export function GoldenThread(props: DecorationProps) {
  return (
    <svg viewBox="0 0 90 760" preserveAspectRatio="none" fill="none" aria-hidden="true" {...props}>
      <path className="js-thread-path" d="M46 2C12 90 75 125 44 212S23 329 46 389S73 492 41 570S28 676 45 758" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M45 17l-5 9 5 9 5-9-5-9Zm1 340-6 12 6 12 6-12-6-12Zm-1 357-5 9 5 9 5-9-5-9Z" fill="currentColor" opacity=".75"/>
    </svg>
  );
}
