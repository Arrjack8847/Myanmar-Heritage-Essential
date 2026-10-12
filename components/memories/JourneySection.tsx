"use client";

import { useRef } from "react";
import Image from "next/image";
import { invitation } from "@/data/invitation";
import useJourneyMotion from "./JourneyMotion";
import styles from "./JourneySection.module.css";

type Props = { onOpenPhoto: (galleryIndex: number) => void };

const ASSETS = "/heritage/memories/chronicle";
const ROMAN = ["I", "II", "III"] as const;

/**
 * Section 04 — Royal Myanmar Love Chronicle.
 * The actual photographs and story copy always come from data/invitation.ts.
 * All ornamental artwork is an independent transparent layer, never embedded
 * in the photographs or in the editable HTML content.
 */
export default function JourneySection({ onOpenPhoto }: Props) {
  const root = useRef<HTMLElement>(null);
  useJourneyMotion(root);

  const finalMemory = invitation.journey[2];
  const finalPhoto = finalMemory ? invitation.gallery[finalMemory.galleryIndex] : undefined;

  return (
    <section ref={root} id="memories" className={styles.section} aria-labelledby="memories-title">
      <div className={styles.paper} aria-hidden="true">
        <Image src={ASSETS + "/01-royal-manuscript-background-desktop.png"} alt=""
          fill sizes="100vw" quality={72} loading="lazy" className={styles.canvasDesktop} />
        <Image src={ASSETS + "/01-royal-manuscript-background-mobile.png"} alt=""
          fill sizes="100vw" quality={72} loading="lazy" className={styles.canvasMobile} />
      </div>

      <div className={styles.entryMist} data-chronicle-entry aria-hidden="true">
        <Image src={ASSETS + "/02-royal-entrance-mist.png"} alt=""
          fill sizes="100vw" quality={70} loading="lazy" />
      </div>

      <div className={styles.hangingFlowers} data-chronicle-flower aria-hidden="true">
        <Image src="/heritage/hanging-magnolias.png" alt="" fill
          sizes="(max-width:640px) 120px, 300px" quality={68} loading="lazy" />
      </div>
      <div className={styles.flowerLeft} data-chronicle-flower aria-hidden="true">
        <Image src={ASSETS + "/11a-floral-parallax-left.png"} alt="" fill
          sizes="(max-width:640px) 150px, 320px" quality={65} loading="lazy" />
      </div>
      <div className={styles.flowerRight} data-chronicle-flower aria-hidden="true">
        <Image src={ASSETS + "/11b-floral-parallax-right.png"} alt="" fill
          sizes="(max-width:640px) 150px, 320px" quality={65} loading="lazy" />
      </div>

      <header className={styles.intro} data-chronicle-intro>
        <div className={styles.headingCrest} data-chronicle-crest aria-hidden="true">
          <Image src={ASSETS + "/03-royal-heading-ornament.png"} alt="" fill
            sizes="(max-width:640px) 300px, 510px" quality={77} loading="lazy" />
        </div>
        <p className={styles.eyebrow} data-chronicle-reveal>THE ROYAL CHRONICLE</p>
        <h2 className={styles.title} id="memories-title">
          <span data-chronicle-reveal>Our Journey</span>
          <em data-chronicle-reveal>Together</em>
        </h2>
        <p className={styles.introCopy} data-chronicle-reveal>
          Before the celebration, there was a story. Ours was written in the little moments that brought us here.
        </p>
        <div className={styles.titleDivider} aria-hidden="true">
          <Image src={ASSETS + "/10-royal-closing-transition.png"} alt="" fill
            sizes="(max-width:640px) 220px, 320px" quality={68} loading="lazy" />
        </div>
      </header>

      <div className={styles.chronicle} data-chronicle-story>
        <span className={styles.timeline} aria-hidden="true">
          <span className={styles.timelineDraw} data-chronicle-thread>
            <Image src={ASSETS + "/06-golden-timeline-ornament.png"} alt="" fill
              sizes="(max-width:640px) 58px, 146px" quality={72} loading="lazy" />
          </span>
        </span>

        {invitation.journey.map((memory, index) => {
          const photo = invitation.gallery[memory.galleryIndex];
          if (!photo) return null;
          return (
            <article
              className={[styles.chapter, index % 2 === 1 ? styles.chapterReverse : ""].join(" ")}
              data-chronicle-chapter
              key={memory.number}
            >
              <span className={styles.timelineMarker} data-chronicle-marker aria-hidden="true">
                <Image src="/heritage/memories/memory-lotus-marker.svg" alt=""
                  width={44} height={44} />
              </span>

              <div className={styles.chapterArtwork} data-chronicle-photo>
                {index === 0 && (
                  <div className={styles.archHalo} aria-hidden="true">
                    <Image src={ASSETS + "/04-royal-chapter-frame.png"} alt="" fill
                      sizes="(max-width:640px) 310px, 450px" quality={75} loading="lazy" />
                  </div>
                )}
                <button className={styles.photoButton} type="button"
                  onClick={() => onOpenPhoto(memory.galleryIndex)}
                  aria-label={"View photograph: " + photo.alt}>
                  <span className={styles.photoWindow}>
                    {/* Keep the original client photograph unmodified. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img data-chronicle-original-photo src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                  </span>
                  <span className={styles.photoFrame} aria-hidden="true">
                    <Image src={ASSETS + "/05-royal-photo-frame.png"} alt="" fill
                      sizes="(max-width:640px) 88vw, 440px" quality={80} loading="lazy" />
                  </span>
                  <span className={styles.photoCaption}>{photo.caption}</span>
                  <span className={styles.viewPhoto} aria-hidden="true">
                    <Image src="/heritage/buttons/view-photos.png" alt=""
                      width={1780} height={414} sizes="(max-width:640px) 135px, 164px" />
                  </span>
                </button>
              </div>

              <div className={styles.chapterCopy} data-chronicle-copy>
                <div className={styles.badge}>
                  <Image src={ASSETS + "/07-royal-chapter-badge.png"} alt=""
                    fill sizes="(max-width:640px) 190px, 230px" quality={76} loading="lazy" />
                  <span>CHAPTER {ROMAN[index] ?? memory.number}</span>
                </div>
                <p className={styles.chapterKicker}>{memory.chapter}</p>
                <h3>{memory.title}</h3>
                <p className={styles.chapterDescription}>{memory.description}</p>
                <div className={styles.chapterSeparator} aria-hidden="true">
                  <Image src={ASSETS + "/09a-royal-lotus-central.png"} alt=""
                    fill sizes="130px" quality={70} loading="lazy" />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {finalMemory && finalPhoto && (
        <div className={styles.finaleRunway} data-chronicle-finale>
          <div className={styles.finaleStage}>
            <div className={styles.finaleMount} data-chronicle-mount>
              <button className={styles.finalePhotoButton} type="button"
                onClick={() => onOpenPhoto(finalMemory.galleryIndex)}
                aria-label={"View final memory photograph: " + finalPhoto.alt}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={finalPhoto.src} alt={finalPhoto.alt} loading="lazy" decoding="async" />
              </button>
              <span className={styles.finaleMat} data-chronicle-mat aria-hidden="true" />
            </div>
            <div className={styles.finaleShade} data-chronicle-shade aria-hidden="true" />
            <div className={styles.finalePetals} data-chronicle-petals aria-hidden="true">
              <Image src={ASSETS + "/12b-floating-royal-petals.png"} alt=""
                fill sizes="100vw" quality={66} loading="lazy" />
            </div>
            <div className={styles.finaleWords} data-chronicle-words>
              <p>OUR NEXT CHAPTER</p>
              <h3>{finalMemory.title}</h3>
              <span>{finalMemory.description}</span>
              <button className={styles.finaleView} type="button"
                onClick={() => onOpenPhoto(finalMemory.galleryIndex)}
                aria-label={"View photograph: " + finalPhoto.alt}>
                <Image src="/heritage/buttons/view-photos.png" alt="View photos"
                  width={1780} height={414} sizes="(max-width:640px) 152px, 192px" />
              </button>
            </div>
            <div className={styles.finaleWash} data-chronicle-wash aria-hidden="true" />
          </div>
        </div>
      )}

      <div className={styles.ending} data-chronicle-ending>
        <div className={styles.endingOrnament} aria-hidden="true">
          <Image src={ASSETS + "/10-royal-closing-transition.png"} alt=""
            fill sizes="(max-width:640px) 88vw, 620px" quality={76} loading="lazy" />
        </div>
        <p className={styles.endingEyebrow}>A STORY WRITTEN WITH LOVE</p>
        <p className={styles.closingQuote}>Our next chapter begins with the people we hold dear.</p>
        <span className={styles.endingLine} aria-hidden="true" />
      </div>
    </section>
  );
}
