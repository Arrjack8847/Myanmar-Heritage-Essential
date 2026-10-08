"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { invitation } from "@/data/invitation";
import InvitationTypography, { addInvitationTypographyReveal } from "@/components/InvitationTypography";
import {
  CornerFlourish,
  DividerMotif,
  FloralSprig,
  GoldenThread,
  HeritageCrest,
  Lotus,
  PagodaSkyline,
  VenueIllustration,
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
      // A single cinematic timeline controls the existing hero and future arch.
      const opening = gsap.timeline({ defaults: { ease: "power3.out" } });
      opening
        .from(".js-hero-crest", { y: -15, opacity: 0, duration: 0.85 }, 0)
        .from(".js-hero-prelude", { y: 16, opacity: 0, duration: 0.78 }, 0.17)
        .addLabel("archReady", 0.65);

      const typography = node.querySelector<HTMLElement>(".js-hero-typography");
      if (typography) {
        addInvitationTypographyReveal(opening, typography, "archReady+=0.12");
      }
      opening.from(".js-hero-lower", { y: 12, opacity: 0, duration: 0.85 }, "archReady+=1.92");

      // The decorative planes part as the guest scrolls into chapter one.
      const heroScroll = {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.1,
      };
      gsap.to(".js-hero-left", { xPercent: -34, yPercent: 18, rotate: -7, ease: "none", scrollTrigger: heroScroll });
      gsap.to(".js-hero-right", { xPercent: 34, yPercent: -15, rotate: 7, ease: "none", scrollTrigger: heroScroll });
      gsap.to(".js-hero-typography", { yPercent: -10, ease: "none", scrollTrigger: heroScroll });
      gsap.to(".js-hero-crest", { yPercent: -45, opacity: 0.25, ease: "none", scrollTrigger: heroScroll });

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
  const [menuOpen, setMenuOpen] = useState(false);
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

  const navigate = () => setMenuOpen(false);

  return (
    <main ref={root} className="invitation-page">
      <a className="skip-link" href="#celebration">Skip to invitation details</a>
      <div className="paper-grain" aria-hidden="true" />
      <GoldenThread className="golden-thread" />

      <header className="site-header">
        <a href="#welcome" className="site-header__brand" onClick={navigate} aria-label="Myanmar Heritage, back to beginning">
          <span className="site-header__monogram">M<span>✦</span>H</span>
          <span className="site-header__brand-name">MYANMAR HERITAGE <small>THE WEDDING COLLECTION</small></span>
        </a>
        <nav className={menuOpen ? "site-nav site-nav--open" : "site-nav"} aria-label="Invitation navigation">
          <a href="#celebration" onClick={navigate}>The day</a>
          <a href="#venue" onClick={navigate}>The venue</a>
          <a href="#memories" onClick={navigate}>Memories</a>
          <a href="#with-love" onClick={navigate}>With love</a>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span />
        </button>
      </header>

      {/* 01 — CEREMONIAL HERO */}
      <section id="welcome" className="hero section-panel" aria-labelledby="hero-title">
        <div className="hero__aura" aria-hidden="true" />
        <div className="hero__corner hero__corner--top-left js-hero-left" aria-hidden="true"><CornerFlourish /></div>
        <div className="hero__corner hero__corner--top-right js-hero-right" aria-hidden="true"><CornerFlourish /></div>
        <div className="hero__corner hero__corner--bottom-left js-hero-left" aria-hidden="true"><CornerFlourish /></div>
        <div className="hero__corner hero__corner--bottom-right js-hero-right" aria-hidden="true"><CornerFlourish /></div>
        <div className="hero__flora hero__flora--left js-hero-left" aria-hidden="true"><FloralSprig /><Lotus /></div>
        <div className="hero__flora hero__flora--right js-hero-right" aria-hidden="true"><FloralSprig /><Lotus /></div>
        <div className="hero__suspended hero__suspended--left js-hero-left" aria-hidden="true">✧</div>
        <div className="hero__suspended hero__suspended--right js-hero-right" aria-hidden="true">✧</div>

        <div className="hero__stage">
          <div className="hero__prelude js-hero-prelude">
            <HeritageCrest className="hero__crest js-hero-crest" />
            <span className="eyebrow eyebrow--spaced">A CELEBRATION OF TWO HEARTS</span>
            <p className="hero__myanmar" lang="my">မင်္ဂလာပွဲ ဖိတ်ကြားလွှာ</p>
          </div>
          <div className="hero__typography js-hero-typography">
            <InvitationTypography
              id="hero-title"
              firstName={invitation.couple.first}
              secondName={invitation.couple.second}
              heading={invitation.heroTypography.heading}
              romanticMessage={invitation.heroTypography.romanticMessage}
              weekday={invitation.dayOfWeek}
              weddingDate={`${invitation.displayDay} ${invitation.displayMonth} ${invitation.displayYear}`}
              language={invitation.heroTypography.language}
            />
          </div>
          <div className="hero__foot js-hero-lower">
            <p>Honouring tradition. Beginning forever.</p>
            <span className="hero__foot-divider" />
            <a className="scroll-prompt" href="#celebration" aria-label="Scroll to wedding details">
              <span>SCROLL TO DISCOVER</span>
              <span className="scroll-prompt__line" aria-hidden="true" />
            </a>
          </div>
        </div>
        <PagodaSkyline className="hero__skyline" />
      </section>

      {/* 02 — THE DAY */}
      <section id="celebration" className="celebration section-panel" aria-labelledby="celebration-title">
        <div className="section-topline" aria-hidden="true"><span />✦<span /></div>
        <CornerFlourish className="section-ornament section-ornament--left js-ornament-drift" />
        <CornerFlourish className="section-ornament section-ornament--right js-ornament-drift" />
        <div className="section-inner celebration__inner">
          <div className="js-reveal section-heading">
            <span className="eyebrow">CHAPTER ONE <span className="eyebrow__diamond">◆</span> OUR CELEBRATION</span>
            <HeritageCrest className="section-heading__crest" />
            <h2 id="celebration-title">A day to <em>remember.</em></h2>
            <p>{invitation.greeting}</p>
          </div>

          <div className="date-display js-reveal">
            <span className="date-display__line" />
            <div className="date-display__day">{invitation.displayDay}</div>
            <div className="date-display__side"><span>{invitation.dayOfWeek}</span><strong>{invitation.displayMonth}</strong><span>{invitation.displayYear}</span></div>
            <span className="date-display__line" />
          </div>

          <div className="itinerary js-reveal">
            <div className="itinerary__header"><span>ORDER OF CELEBRATION</span><span>✦</span></div>
            {invitation.ceremony.map((item, index) => (
              <div className="itinerary__event" key={item.title}>
                <div className="itinerary__marker"><span>{index === 0 ? "✧" : "◇"}</span></div>
                <time>{item.time}</time>
                <div><h3>{item.title}</h3><p>{item.detail}</p></div>
              </div>
            ))}
          </div>
          <div className="celebration__closing js-reveal">
            <DividerMotif />
            <p>Two families, one beautiful beginning.</p>
          </div>
        </div>
        <PagodaSkyline className="celebration__skyline" />
      </section>

      {/* 03 — THE VENUE */}
      <section id="venue" className="venue section-panel" aria-labelledby="venue-title">
        <div className="venue__pattern" aria-hidden="true" />
        <CornerFlourish className="venue__corner venue__corner--left js-ornament-drift" />
        <CornerFlourish className="venue__corner venue__corner--right js-ornament-drift" />
        <div className="section-inner venue__inner">
          <div className="section-heading section-heading--light js-reveal">
            <span className="eyebrow">CHAPTER TWO <span className="eyebrow__diamond">◆</span> THE GATHERING PLACE</span>
            <h2 id="venue-title">Where our story <em>unfolds.</em></h2>
          </div>
          <div className="venue__illustration-wrap js-reveal">
            <div className="venue__arch-frame">
              <div className="venue__arch-glow" aria-hidden="true" />
              <VenueIllustration className="venue__illustration" />
            </div>
          </div>
          <div className="venue__details js-reveal">
            <div className="venue__pin" aria-hidden="true">⌖</div>
            <p className="eyebrow">WE LOOK FORWARD TO SEEING YOU AT</p>
            <h3>{invitation.venue.name}</h3>
            <p>{invitation.venue.address}</p>
            <p>{invitation.venue.city}</p>
            {invitation.venue.directionsUrl ? (
              <a className="button button--ivory" href={invitation.venue.directionsUrl} target="_blank" rel="noopener noreferrer">VIEW DIRECTIONS <span aria-hidden="true">↗</span></a>
            ) : (
              <div className="venue__map-note">Directions will be available when the venue is confirmed.</div>
            )}
          </div>
        </div>
      </section>

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
