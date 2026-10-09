"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { invitation } from "@/data/invitation";
import HeritageHero from "@/components/HeritageHero";
import RoyalGateway from "@/components/gateway/RoyalGateway";
import CelebrationSection from "@/components/celebration/CelebrationSection";
import RoyalUnfoldTransition from "@/components/transitions/RoyalUnfoldTransition";
import SharedFloatingPetals from "@/components/SharedFloatingPetals";
import MotionStability from "@/components/MotionStability";
import MotionDebug from "@/components/MotionDebug";
import {
  CornerFlourish,
  DividerMotif,
  FloralSprig,
  GoldenThread,
  HeritageCrest,
  PagodaSkyline,
} from "@/components/Decorations";

type TimeRemaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeRemaining(): TimeRemaining {
  const distance = Math.max(0, new Date(invitation.dateISO).getTime() - Date.now());
  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000),
  };
}

function exportCalendarEvent() {
  const begin = new Date(invitation.dateISO);
  const end = new Date(begin.getTime() + 4 * 60 * 60 * 1000);
  const toUTC = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const clean = (value: string) => value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//JackNex Studio//Myanmar Heritage Essential//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:jn-w01-" + toUTC(begin) + "@jacknexstudio",
    "DTSTAMP:" + toUTC(new Date()),
    "DTSTART:" + toUTC(begin),
    "DTEND:" + toUTC(end),
    "SUMMARY:" + clean(invitation.couple.signature + " — Wedding Celebration"),
    "DESCRIPTION:" + clean(invitation.greeting),
    "LOCATION:" + clean(invitation.venue.name + ", " + invitation.venue.city),
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const file = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "wedding-celebration.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function useHeritageMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const node = root.current;
    if (!node) return;

    // Respect visitors who prefer still layouts; all content is visible by default.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      // Each chapter appears gently; the shared ornamental motif links chapters.
      gsap.utils.toArray<HTMLElement>(".js-reveal").forEach((element) => {
        gsap.from(element, {
          y: 42,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: element, start: "top 89%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".js-ornament-drift").forEach((element, index) => {
        gsap.fromTo(element,
          { y: index % 2 === 0 ? -34 : 28 },
          {
            y: index % 2 === 0 ? 32 : -28,
            ease: "none",
            scrollTrigger: {
              trigger: element.closest("section") || element,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      });

      const path = node.querySelector<SVGPathElement>(".js-thread-path");
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: node, start: "top top", end: "bottom bottom", scrub: 1.5 },
        });
      }
    }, node);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      context.revert();
    };
  }, [root]);
}

function Countdown() {
  const [remaining, setRemaining] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    const update = () => setRemaining(getTimeRemaining());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const digits = [
    { label: "DAYS", count: remaining?.days },
    { label: "HOURS", count: remaining?.hours },
    { label: "MINUTES", count: remaining?.minutes },
    { label: "SECONDS", count: remaining?.seconds },
  ];

  return (
    <div className="countdown" aria-label="Time remaining until our wedding">
      {digits.map((digit) => (
        <div className="countdown__item" key={digit.label}>
          <strong>{digit.count === undefined ? "–" : String(digit.count).padStart(2, "0")}</strong>
          <span>{digit.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function HeritageInvitation() {
  const root = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  useHeritageMotion(root);

  useEffect(() => {
    if (lightbox === null) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowLeft") setLightbox((index) => index === null ? null : (index + invitation.gallery.length - 1) % invitation.gallery.length);
      if (event.key === "ArrowRight") setLightbox((index) => index === null ? null : (index + 1) % invitation.gallery.length);
    };
    window.addEventListener("keydown", keyHandler);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", keyHandler);
    };
  }, [lightbox]);

  return (
    <main ref={root} className="invitation-page">
      <a className="skip-link" href="#celebration">Skip to invitation details</a>
      <div className="paper-grain" aria-hidden="true" />
      <GoldenThread className="golden-thread" />

      {/* One continuous royal invitation: outside the clipped one-screen hero,
          the bridge and six shared petals can move across both chapters. */}
      <div className="royal-story">
        <SharedFloatingPetals />
        <div className="heritage-story__intro">
          <HeritageHero />
        </div>
        <RoyalUnfoldTransition />
        <CelebrationSection />
      </div>
      <MotionStability />
      <MotionDebug />

      {/* 03 — THE ROYAL GATEWAY — independently layered, sticky scroll */}
      <RoyalGateway />

      {/* 04 — MEMORIES */}
      <section id="memories" className="memories section-panel" aria-labelledby="memories-title">
        <div className="memories__sprig memories__sprig--left js-ornament-drift"><FloralSprig /></div>
        <div className="memories__sprig memories__sprig--right js-ornament-drift"><FloralSprig /></div>
        <div className="section-inner">
          <div className="section-heading js-reveal">
            <span className="eyebrow">CHAPTER THREE <span className="eyebrow__diamond">◆</span> THE LITTLE MOMENTS</span>
            <HeritageCrest className="section-heading__crest" />
            <h2 id="memories-title">Our precious <em>moments.</em></h2>
            <p>A collection of memories, laughter, and the love that brought us here.</p>
          </div>
          <div className="gallery js-reveal">
            {invitation.gallery.map((photo, index) => (
              <button
                className={"gallery__tile gallery__tile--" + (index + 1)}
                type="button"
                key={photo.src}
                onClick={() => setLightbox(index)}
                aria-label={"Open gallery photo " + (index + 1) + ": " + photo.caption}
              >
                {/* Sample image URL is replaced in the data file with approved couple photography. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                <span className="gallery__caption"><span>{String(index + 1).padStart(2, "0")}</span>{photo.caption}</span>
                <span className="gallery__expand" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div className="memories__end js-reveal"><DividerMotif /><p>Every beautiful story is made of little moments.</p></div>
        </div>
      </section>

      {/* 05 — CLOSING */}
      <section id="with-love" className="closing section-panel" aria-labelledby="closing-title">
        <div className="closing__aura" aria-hidden="true" />
        <CornerFlourish className="closing__corner closing__corner--tl js-ornament-drift" />
        <CornerFlourish className="closing__corner closing__corner--tr js-ornament-drift" />
        <CornerFlourish className="closing__corner closing__corner--bl" />
        <CornerFlourish className="closing__corner closing__corner--br" />
        <div className="closing__content section-inner">
          <HeritageCrest className="closing__crest js-reveal" />
          <span className="eyebrow js-reveal">FROM OUR HEARTS TO YOURS</span>
          <h2 id="closing-title" className="js-reveal">With <em>love.</em></h2>
          <p className="closing__message js-reveal">{invitation.closing}</p>
          <DividerMotif className="closing__divider js-reveal" />
          <p className="closing__signoff js-reveal">With love and gratitude,</p>
          <p className="closing__names js-reveal">{invitation.couple.signature}</p>

          {(invitation.standardAddOns.countdown || invitation.standardAddOns.calendar) && (
            <div className="closing__extras js-reveal">
              {invitation.standardAddOns.countdown && (
                <div className="closing__countdown">
                  <span className="eyebrow">COUNTING DOWN THE MOMENTS</span>
                  <Countdown />
                </div>
              )}
              {invitation.standardAddOns.calendar && (
                <button type="button" className="button button--outline" onClick={exportCalendarEvent}>
                  <span aria-hidden="true">＋</span> ADD TO CALENDAR
                </button>
              )}
            </div>
          )}
          {invitation.contactEmail && (
            <a className="closing__contact" href={"mailto:" + invitation.contactEmail}>CONTACT US ↗</a>
          )}
          <a href="#welcome" className="closing__back">↑ BACK TO THE BEGINNING</a>
        </div>
        <PagodaSkyline className="closing__skyline" />
      </section>

      <footer className="site-footer"><span>MYANMAR HERITAGE · JN-W01</span><span>CRAFTED BY JACKNEX STUDIO</span></footer>

      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo gallery">
          <button type="button" className="lightbox__close" aria-label="Close photo" onClick={() => setLightbox(null)}>×</button>
          <button type="button" className="lightbox__nav lightbox__nav--prev" aria-label="Previous photo" onClick={() => setLightbox((lightbox + invitation.gallery.length - 1) % invitation.gallery.length)}>‹</button>
          <figure className="lightbox__figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={invitation.gallery[lightbox].src} alt={invitation.gallery[lightbox].alt} />
            <figcaption>{invitation.gallery[lightbox].caption} <span>{lightbox + 1} / {invitation.gallery.length}</span></figcaption>
          </figure>
          <button type="button" className="lightbox__nav lightbox__nav--next" aria-label="Next photo" onClick={() => setLightbox((lightbox + 1) % invitation.gallery.length)}>›</button>
        </div>
      )}
    </main>
  );
}
