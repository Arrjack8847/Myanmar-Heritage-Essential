"use client";

import { useEffect, useRef, useState } from "react";
import RoyalPavilionArtwork from "./RoyalPavilionArtwork";
import useRoyalPavilionMotion from "./useRoyalPavilionMotion";
import Image from "next/image";
import { invitation } from "@/data/invitation";
import { RoyalImageButton, RoyalImageLink } from "@/components/buttons/RoyalImageControl";
import styles from "./RoyalBlessing.module.css";


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
  useRoyalPavilionMotion(sectionRef);
  const hasExtras = invitation.standardAddOns.countdown || invitation.standardAddOns.calendar;
  return (
    <section id="with-love" ref={sectionRef} className={styles.story} aria-labelledby="closing-title">
      {/* Section 04's golden-thread bridge flows into the pavilion without a hard edge. */}
      <div className={styles.entryBridge} data-blessing-entry aria-hidden="true" />
      <RoyalPavilionArtwork />

      <div className={styles.content}>
        <div className={styles.readingPanel}>
          <div className={styles.intro} data-blessing-intro>
            <p className={styles.eyebrow} data-blessing-intro-item>FROM OUR HEARTS TO YOURS</p>
            <h2 id="closing-title" className={styles.title} data-blessing-intro-item>
              <span>With love &amp;</span><em>gratitude.</em>
            </h2>
            <p className={styles.message} data-blessing-intro-item>{invitation.closing}</p>
            <div className={styles.dividerArt} data-blessing-intro-item aria-hidden="true">
              <Image
                src="/heritage/section5/04_Ornaments/11_golden_lotus_divider.png"
                alt="" width={1592} height={350} sizes="(max-width: 640px) 210px, 285px"
                loading="lazy" />
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
                <RoyalImageButton
                  className={styles.calendarArt}
                  asset="save-our-date-default"
                  mobileAsset="save-our-date-mobile"
                  hoverAsset="save-our-date-hover"
                  pressedAsset="save-our-date-press"
                  focusAsset="save-our-date-focus"
                  tone="primary"
                  label="Save our date to your calendar"
                  onClick={addWeddingToCalendar}
                />
              )}
            </div>
          )}
          {invitation.contactEmail && (
            <RoyalImageLink
              className={styles.contactArt}
              asset="contact-us"
              tone="secondary"
              label="Contact us by email"
              href={"mailto:" + invitation.contactEmail}
            />
          )}
        </div>
      </div>
      {/* Native-flow scenic chapter end — not a pinned scene or another page. */}
      <div className={styles.sunsetSpace} aria-hidden="true" />
      <div className={styles.finalActions}>
        <RoyalImageLink
          className={styles.backArt}
          asset="back-to-beginning"
          tone="quiet"
          label="Back to the beginning"
          href="#welcome"
        />
      </div>
    </section>
  );
}
