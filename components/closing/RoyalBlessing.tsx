"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { invitation } from "@/data/invitation";
import HeritageAtmosphere from "@/components/HeritageAtmosphere";
import LotusMotif from "@/components/heritage/LotusMotif";
import styles from "./RoyalBlessing.module.css";

const ASSETS = "/heritage/";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function timeUntilWedding(): Remaining {
  const remaining = Math.max(0, new Date(invitation.dateISO).getTime() - Date.now());
  return {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000),
  };
}

function WeddingCountdown() {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const update = () => setRemaining(timeUntilWedding());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const units = [
    ["DAYS", remaining?.days],
    ["HOURS", remaining?.hours],
    ["MINUTES", remaining?.minutes],
    ["SECONDS", remaining?.seconds],
  ] as const;

  return (
    <div className={styles.countdown} role="timer" aria-live="off" aria-label="Time remaining until the wedding">
      {units.map(([label, count]) => (
        <div key={label} className={styles.countdownUnit}>
          <span className={styles.countdownNumber}>
            {count === undefined ? "–" : String(count).padStart(2, "0")}
          </span>
          <span className={styles.countdownLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function addWeddingToCalendar() {
  const start = new Date(invitation.dateISO);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const stamp = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const escapeValue = (value: string) =>
    value.replace(/\\/g, "\\\\").replace(/,/g, "\\,")
      .replace(/;/g, "\\;").replace(/\n/g, "\\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//JackNex Studio//Myanmar Heritage Essential//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:jn-w01-" + stamp(start) + "@jacknexstudio",
    "DTSTAMP:" + stamp(new Date()),
    "DTSTART:" + stamp(start),
    "DTEND:" + stamp(end),
    "SUMMARY:" + escapeValue(invitation.couple.signature + " — Wedding Celebration"),
    "DESCRIPTION:" + escapeValue(invitation.greeting),
    "LOCATION:" + escapeValue(invitation.venue.name + ", " + invitation.venue.city),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const url = URL.createObjectURL(new Blob([lines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "wedding-celebration.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/**
 * Chapter 05: the royal invitation comes back to its parchment origins.
 * Reuses only the original Bagan, mist, florals and handcrafted PNG ornaments.
 * The content is normal flowing HTML, not a pinned scene: long names,
 * optional extras, shorter phone screens, and reduced motion all work.
 */
export default function RoyalBlessing() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      // Each editorial element enters when it reaches the reading area.
      // Unlike once-only reveals, these follow reverse scroll just as faithfully.
      const intro = section.querySelector<HTMLElement>("[data-blessing-intro]");
      if (intro) {
        gsap.utils.toArray<HTMLElement>("[data-blessing-intro-item]", intro).forEach((item, index) => {
          gsap.fromTo(item,
            { autoAlpha: index === 0 ? 0.48 : 0.24, y: index === 0 ? 8 : 20 },
            {
              autoAlpha: 1, y: 0, ease: "power2.out",
              scrollTrigger: {
                trigger: item, start: "top 96%", end: "top 73%",
                scrub: 0.65, invalidateOnRefresh: true,
              },
            });
        });
      }
      gsap.utils.toArray<HTMLElement>("[data-blessing-reveal]", section).forEach((item) => {
        gsap.fromTo(item, { autoAlpha: 0.3, y: 18 }, {
          autoAlpha: 1, y: 0, ease: "power2.out",
          scrollTrigger: {
            trigger: item, start: "top 94%", end: "top 72%",
            scrub: 0.7, invalidateOnRefresh: true,
          },
        });
      });

      // The ivory veil thins as the heirloom foil motif hands off to
      // the final page. It never hides the actual editable wedding copy.
      const entry = section.querySelector<HTMLElement>("[data-blessing-entry]");
      if (entry) gsap.fromTo(entry, { opacity: 0.82, y: 24 }, {
        opacity: 0.22, y: -16, ease: "none",
        scrollTrigger: {
          trigger: section, start: "top bottom", end: "top 19%", scrub: 0.85,
        },
      });

      // Transform-only depth planes keep original image assets intact and
      // avoid scroll-pin jumps, blur filters or heavy continuous animations.
      type Offset = { x?: number; y?: number; scale?: number };
      const drift = (selector: string, from: Offset, to: Offset) => {
        const element = section.querySelector<HTMLElement>(selector);
        if (!element) return;
        gsap.fromTo(element, from, {
          ...to, ease: "none",
          scrollTrigger: {
            trigger: section, start: "top bottom",
            end: "bottom top", scrub: 1.35,
          },
        });
      };
      drift("[data-blessing-layer='mist']", { y: 24 }, { y: -39 });
      drift("[data-blessing-layer='sky']", { y: 15, scale: 1.035 }, { y: -25, scale: 1 });
      drift("[data-blessing-layer='flora-left']", { x: -21, y: 19 }, { x: -2, y: -27 });
      drift("[data-blessing-layer='flora-right']", { x: 21, y: 19 }, { x: 2, y: -29 });

      const light = section.querySelector<HTMLElement>("[data-blessing-light]");
      if (light) gsap.fromTo(light, { opacity: 0.42, scale: 0.98 }, {
        opacity: 1, scale: 1.025, ease: "none",
        scrollTrigger: {
          trigger: section, start: "top bottom", end: "top 19%", scrub: 1,
        },
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });
    return () => {
      window.removeEventListener("load", refresh);
      context.revert();
    };
  }, []);

  const hasExtras = invitation.standardAddOns.countdown || invitation.standardAddOns.calendar;

  return (
    <section id="with-love" ref={sectionRef} className={styles.story} aria-labelledby="closing-title">
      {/* Soft parchment/mist handoff overlaps the end of the Section 04 album. */}
      <div className={styles.entryBridge} data-blessing-entry aria-hidden="true" />
      <div className={styles.paper} aria-hidden="true">
        <Image src={ASSETS + "ivory-parchment.png"} alt="" fill sizes="100vw" quality={76} />
      </div>
      <HeritageAtmosphere
        scene="blessing"
        skyClassName={styles.sky}
        mistClassName={styles.mist}
      />
      <div className={styles.floraLeft} data-blessing-layer="flora-left" aria-hidden="true">
        <Image src={ASSETS + "floral-left.png"} alt="" fill sizes="(max-width: 640px) 70vw, 480px" quality={75} />
      </div>
      <div className={styles.floraRight} data-blessing-layer="flora-right" aria-hidden="true">
        <Image src={ASSETS + "floral-right.png"} alt="" fill sizes="(max-width: 640px) 70vw, 480px" quality={75} />
      </div>
      <div className={styles.readingLight} data-blessing-light aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.intro} data-blessing-intro>
          <span className={styles.topRule} aria-hidden="true" data-blessing-intro-item />
          {/* Reused original transparent PNG emblem — no SVG or stickers. */}
          <Image className={styles.royalEmblem}
            src={ASSETS + "ceremony/royal-transition-ornament.png"}
            alt="" width={54} height={90} quality={72} data-blessing-intro-item />
          <p className={styles.eyebrow} data-blessing-intro-item>THE FINAL CHAPTER · A BLESSING</p>
          <h2 id="closing-title" className={styles.title} data-blessing-intro-item>
            <span>With love &amp;</span>
            <em>gratitude.</em>
          </h2>
          <p className={styles.message} data-blessing-intro-item>{invitation.closing}</p>
          <div data-blessing-intro-item>
            <LotusMotif variant="divider" className={styles.divider} />
          </div>
        </div>
        <p className={styles.signoff} data-blessing-reveal>Until we celebrate together,</p>
        <p className={styles.names} data-blessing-reveal>{invitation.couple.signature}</p>
        <p className={styles.dateLine} data-blessing-reveal>
          {invitation.displayDay} {invitation.displayMonth} {invitation.displayYear}
          <span className={styles.dateSeparator} aria-hidden="true" />
          {invitation.venue.city}
        </p>

        {hasExtras && (
          <div className={styles.extras} data-blessing-reveal>
            {invitation.standardAddOns.countdown && (
              <div className={styles.countdownWrap}>
                <p className={styles.extrasHeading}>UNTIL OUR BEAUTIFUL DAY</p>
                <WeddingCountdown />
              </div>
            )}
            {invitation.standardAddOns.calendar && (
              <button type="button" className={`${styles.calendarButton} royal-action royal-action--wine`} onClick={addWeddingToCalendar}>
                <span className={styles.calendarLabel}>SAVE OUR DATE</span>
                <span className="royal-action__arrow" aria-hidden="true">↗</span>
              </button>
            )}
          </div>
        )}

        {invitation.contactEmail && (
          <a className={`${styles.contact} royal-action royal-action--outline`} href={"mailto:" + invitation.contactEmail}>
            <span>CONTACT US</span><span aria-hidden="true">↗</span>
          </a>
        )}
        <a className={`${styles.backToTop} royal-action royal-action--quiet`} href="#welcome">
          <span aria-hidden="true">↑</span><span>BACK TO THE BEGINNING</span>
        </a>
      </div>

    </section>
  );
}
