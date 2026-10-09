"use client";

import { useRef } from "react";
import Image from "next/image";
import { invitation } from "@/data/invitation";
import HeritageAtmosphere from "@/components/HeritageAtmosphere";
import LotusMotif from "@/components/heritage/LotusMotif";
import JourneyTimeline from "./JourneyTimeline";
import useJourneyMotion from "./JourneyMotion";
import styles from "./JourneySection.module.css";

type Props = { onOpenPhoto: (galleryIndex: number) => void };

/**
 * Royal Heirloom Album — two handmade photo memories and one cinematic finale.
 * Decorations reuse approved heritage PNGs / CSS foil details, never SVG assets.
 * All captions, photos and story text remain editable in data/invitation.ts.
 */
export default function JourneySection({ onOpenPhoto }: Props) {
  const root = useRef<HTMLElement>(null);
  useJourneyMotion(root);
  const finale = invitation.journey[2];
  const finalPhoto = finale ? invitation.gallery[finale.galleryIndex] : undefined;

  return (
    <section id="memories" ref={root} className={styles.section} aria-labelledby="memories-title">
      <div className={styles.paper} aria-hidden="true" />
      <div className={styles.entryGlow} data-journey-entry aria-hidden="true" />
      <div className={styles.gatewayEcho} data-journey-gateway-mark aria-hidden="true">
        <Image src="/heritage/ceremony/royal-transition-ornament.png" alt=""
          width={49} height={79} quality={74} loading="lazy" />
      </div>
      <HeritageAtmosphere
        scene="journey"
        skyClassName={styles.pagodaHorizon}
        mistClassName={styles.mistVeil}
      />
      <div className={styles.hangingFlowers} data-journey-botanical aria-hidden="true">
        <Image src="/heritage/hanging-magnolias.png" alt="" fill
          sizes="(max-width: 700px) 180px, 320px" quality={70} />
      </div>

      <header className={styles.intro} data-journey-title>
        <p className={styles.eyebrow} data-journey-eyebrow>CHAPTER THREE · THE STORY OF US</p>
        <h2 id="memories-title" className={styles.title}>
          <span data-journey-title-main>Our Journey</span>
          <em data-journey-title-accent>Together</em>
        </h2>
        <p className={styles.lead} data-journey-lead>
          Before the celebration, there was a story. Ours was written in the little moments that brought us here.
        </p>
        <span className={styles.headingRule} aria-hidden="true" />
      </header>

      <div className={styles.story} data-journey-story>
        <span className={styles.globalThread} aria-hidden="true">
          <span className={styles.globalThreadFill} data-gold-progress />
        </span>
        {invitation.journey.slice(0, 2).map((memory, index) => {
          const photo = invitation.gallery[memory.galleryIndex];
          if (!photo) return null;
          return (
            <article
              key={memory.number}
              className={[styles.memory, index === 1 ? styles.reverse : ""].join(" ")}
              data-memory
            >
              <JourneyTimeline
                className={styles.timeline}
                progressClassName={styles.timelineProgress}
                markerClassName={styles.timelineMarker}
              />
              <div className={styles.photoColumn}>
                <div className={styles.photoMotion} data-memory-photo>
                  <button className={styles.photoButton} type="button"
                    onClick={() => onOpenPhoto(memory.galleryIndex)}
                    aria-label={"View photograph: " + photo.alt}>
                    <span className={styles.photoPaper}>
                      <span className={styles.photoWindow}>
                        {/* Keep original client photograph unchanged. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                      </span>
                      <span className={styles.photoCaption}>{photo.caption}</span>
                    </span>
                    <span className={styles.photoAction} aria-hidden="true"><Image src="/heritage/buttons/view-photos.png" alt="" width={1780} height={414} sizes="(max-width:640px) 55vw, 240px" /></span>
                  </button>
                </div>
              </div>
              <div className={styles.copyColumn} data-memory-copy>
                <p className={styles.chapter}>{memory.number} · {memory.chapter}</p>
                <h3 className={styles.memoryTitle}>{memory.title}</h3>
                <p className={styles.memoryDescription}>{memory.description}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.finaleLead} aria-hidden="true">
        <span className={styles.finaleLeadRule} />
        <LotusMotif variant="marker" />
        <span>OUR NEXT CHAPTER</span>
      </div>

      {finale && finalPhoto && (
        <div className={styles.finaleRunway} data-finale-runway>
          <div className={styles.finaleStage}>
            <div className={styles.finaleMount} data-finale-mount>
              <button className={styles.finalePhotoButton} type="button"
                aria-label={"View final memory photograph: " + finalPhoto.alt}
                onClick={() => onOpenPhoto(finale.galleryIndex)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={finalPhoto.src} alt={finalPhoto.alt} loading="lazy" decoding="async" />
                <span className={styles.finaleAction} aria-hidden="true"><Image src="/heritage/buttons/view-photos.png" alt="" width={1780} height={414} sizes="(max-width:640px) 44vw, 240px" /></span>
              </button>
              <span className={styles.finaleMat} data-finale-mat aria-hidden="true" />
            </div>
            <div className={styles.finaleShade} data-finale-shade aria-hidden="true" />
            <div className={styles.finaleCopy} data-finale-copy>
              <p className={styles.finaleChapter}>{finale.number} · {finale.chapter}</p>
              <h3>{finale.title}</h3>
              <p className={styles.finaleDescription}>{finale.description}</p>
            </div>
            <div className={styles.finaleWash} data-finale-wash aria-hidden="true" />
          </div>
        </div>
      )}

      <div className={styles.ending} data-journey-ending>
        <span className={styles.endRule} aria-hidden="true" />
        <LotusMotif variant="divider" className={styles.endingLotus} />
        <p className={styles.closingSignoff}>EVERY STORY IS MORE BEAUTIFUL WHEN SHARED</p>
        <p className={styles.closingQuote}>Our next chapter begins with the people we hold dear.</p>
      </div>
      <div className={styles.mistBridge} data-journey-atmosphere="exit" aria-hidden="true">
        <Image src="/heritage/golden-mist.png" alt="" fill
          sizes="100vw" quality={65} loading="lazy" draggable={false} />
      </div>
    </section>
  );
}
