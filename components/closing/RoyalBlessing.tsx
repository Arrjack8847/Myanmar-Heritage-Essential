"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { invitation } from "@/data/invitation";
import HeritageAtmosphere from "@/components/HeritageAtmosphere";
import { CornerFlourish, DividerMotif, HeritageCrest, PagodaSkyline } from "@/components/Decorations";
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
    <div className={styles.countdown} role="timer" aria-label="Time remaining until the wedding">
      {units.map(([label, count]) => (
        <div key={label} className={styles.countdownUnit}>
          <span className={styles.countdownNumber} aria-hidden="true">
            {count === undefined ? "–" : String(count).padStart(2, "0")}
          </span>
          <span className={styles.countdownLabel} aria-hidden="true">{label}</span>
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
 * It reuses original architectural/floral layers and shared SVG ornaments.
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
      const reveal = gsap.utils.toArray<HTMLElement>("[data-blessing-reveal]", section);
      gsap.from(reveal, {
        autoAlpha: 0,
        y: 23,
        duration: 0.85,
        stagger: 0.095,
        ease: "power2.out",
        clearProps: "opacity,visibility,transform",
        scrollTrigger: { trigger: section, start: "top 76%", once: true },
      });

      const drift = (selector: string, y: number, x = 0) => {
        const element = section.querySelector<HTMLElement>(selector);
        if (!element) return;
        gsap.fromTo(element, { x: 0, y: 0 }, {
          x, y, ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        });
      };
      drift("[data-blessing-layer='mist']", -52);
      drift("[data-blessing-layer='arrival-mist']", -24);
      drift("[data-blessing-layer='sky']", -25);
      drift("[data-blessing-layer='flora-left']", -25, -12);
      drift("[data-blessing-layer='flora-right']", -31, 12);
      drift("[data-blessing-layer='botanical']", -18, 9);
    }, section);

    return () => context.revert();
  }, []);

  const hasExtras = invitation.standardAddOns.countdown || invitation.standardAddOns.calendar;

  return (
    <section id="with-love" ref={sectionRef} className={styles.story} aria-labelledby="closing-title">
      <div className={styles.paper} aria-hidden="true">
        <Image src={ASSETS + "ivory-parchment.png"} alt="" fill sizes="100vw" quality={76} />
      </div>
      <HeritageAtmosphere
        scene="blessing"
        skyClassName={styles.sky}
        mistClassName={styles.mist}
      />
      {/* The same golden mist carries through from the final story milestone. */}
      <div className={styles.arrivalMist} data-blessing-layer="arrival-mist" aria-hidden="true">
        <Image src={ASSETS + "golden-mist.png"} alt="" fill sizes="100vw"
          quality={65} loading="lazy" draggable={false} />
      </div>
      <div className={styles.botanical} data-blessing-layer="botanical" aria-hidden="true">
        <Image src={ASSETS + "botanical-gold.png"} alt="" fill sizes="(max-width: 640px) 65vw, 440px" quality={70} />
      </div>
      <div className={styles.floraLeft} data-blessing-layer="flora-left" aria-hidden="true">
        <Image src={ASSETS + "floral-left.png"} alt="" fill sizes="(max-width: 640px) 70vw, 480px" quality={75} />
      </div>
      <div className={styles.floraRight} data-blessing-layer="flora-right" aria-hidden="true">
        <Image src={ASSETS + "floral-right.png"} alt="" fill sizes="(max-width: 640px) 70vw, 480px" quality={75} />
      </div>
      <div className={styles.readingLight} aria-hidden="true" />
      <div className={styles.outerBorder} aria-hidden="true" />
      <div className={styles.innerBorder} aria-hidden="true" />
      <CornerFlourish className={styles.cornerTl} />
      <CornerFlourish className={styles.cornerTr} />
      <CornerFlourish className={styles.cornerBl} />
      <CornerFlourish className={styles.cornerBr} />

      <div className={styles.content}>
        <div className={styles.transition} aria-hidden="true">
          <span className={styles.transitionRule} />
          <div className={styles.transitionArt}>
            <Image
              src={ASSETS + "ceremony/royal-transition-ornament.png"}
              alt=""
              fill
              sizes="150px"
              quality={75}
            />
          </div>
          <span className={styles.transitionRule} />
        </div>

        <p className={styles.eyebrow} data-blessing-reveal>THE FINAL CHAPTER · A BLESSING</p>
        <HeritageCrest className={styles.crest} data-blessing-reveal />
        <h2 id="closing-title" className={styles.title} data-blessing-reveal>
          <span>With love &amp;</span>
          <em>gratitude.</em>
        </h2>
        <p className={styles.message} data-blessing-reveal>{invitation.closing}</p>
        <DividerMotif className={styles.divider} data-blessing-reveal />
        <p className={styles.signoff} data-blessing-reveal>Until we celebrate together,</p>
        <p className={styles.names} data-blessing-reveal>{invitation.couple.signature}</p>
        <p className={styles.dateLine} data-blessing-reveal>
          {invitation.displayDay} {invitation.displayMonth} {invitation.displayYear}
          <span aria-hidden="true">✦</span>
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
              <button type="button" className={styles.calendarButton} onClick={addWeddingToCalendar}>
                <span aria-hidden="true" className={styles.calendarIcon}>＋</span>
                SAVE OUR DATE
                <span aria-hidden="true" className={styles.calendarArrow}>↗</span>
              </button>
            )}
          </div>
        )}

        {invitation.contactEmail && (
          <a className={styles.contact} href={"mailto:" + invitation.contactEmail}>
            CONTACT US <span aria-hidden="true">↗</span>
          </a>
        )}
        <a className={styles.backToTop} href="#welcome">
          <span aria-hidden="true">↑</span> BACK TO THE BEGINNING
        </a>
      </div>

      <PagodaSkyline className={styles.skyline} />
    </section>
  );
}
