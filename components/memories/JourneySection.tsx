"use client";

import { useRef } from "react";
import Image from "next/image";
import { invitation } from "@/data/invitation";
import HeritageAtmosphere from "@/components/HeritageAtmosphere";
import LotusMotif from "@/components/heritage/LotusMotif";
import JourneyTimeline from "./JourneyTimeline";
import useJourneyMotion from "./JourneyMotion";
import styles from "./JourneySection.module.css";

type Props = {
  onOpenPhoto: (galleryIndex: number) => void;
};

/** Photo-first, chaptered love story. All copy and photo indices remain editable. */
export default function JourneySection({ onOpenPhoto }: Props) {
  const root = useRef<HTMLElement>(null);
  useJourneyMotion(root);

  return (
    <section id="memories" ref={root} className={styles.section} aria-labelledby="memories-title">
      <div className={styles.paper} aria-hidden="true" />
      <HeritageAtmosphere
        scene="journey"
        skyClassName={styles.pagodaHorizon}
        mistClassName={styles.mistVeil}
      />
      <div className={styles.hangingFlowers} aria-hidden="true" data-journey-botanical>
        <Image src="/heritage/hanging-magnolias.png" alt="" fill
          sizes="(max-width: 700px) 150px, 320px" quality={70} />
      </div>

      <header className={styles.intro} data-journey-title>
        <p className={styles.eyebrow}>CHAPTER THREE · THE STORY OF US</p>
        <h2 id="memories-title" className={styles.title}>Our Journey <em>Together</em></h2>
        <p className={styles.lead}>Every love story begins with a moment.</p>
        <span className={styles.headingRule} aria-hidden="true" />
      </header>

      <div className={styles.story} data-journey-story>
        {invitation.journey.map((memory, index) => {
          const photo = invitation.gallery[memory.galleryIndex];
          if (!photo) return null;
          return (
            <article
              key={memory.number}
              className={[
                styles.memory, index === 1 ? styles.reverse : "",
                index === 2 ? styles.lastMemory : "",
              ].join(" ")}
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
                    aria-label={"Open wedding photograph: " + photo.alt}>
                    <span className={styles.photoPaper}>
                      <span className={styles.photoWindow}>
                        {/* Client photography will replace these editable demo images. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                      </span>
                    </span>
                    <span className={styles.photoAction}>VIEW PHOTO <span aria-hidden="true">↗</span></span>
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

      <div className={styles.ending} data-journey-ending>
        <span className={styles.endRule} aria-hidden="true" />
        <LotusMotif variant="divider" className={styles.endingLotus} />
        <p className={styles.closingQuote}>Every beautiful journey leads us here.</p>
        <p className={styles.closingSignoff}>TO BE CONTINUED · WITH LOVE</p>
      </div>
      <div className={styles.mistBridge} data-journey-atmosphere="exit" aria-hidden="true">
        <Image src="/heritage/golden-mist.png" alt="" fill
          sizes="100vw" quality={65} loading="lazy" draggable={false} />
      </div>
    </section>
  );
}
