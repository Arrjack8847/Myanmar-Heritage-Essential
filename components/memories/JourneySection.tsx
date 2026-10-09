"use client";

import { useRef } from "react";
import Image from "next/image";
import { invitation } from "@/data/invitation";
import JourneyTimeline from "./JourneyTimeline";
import useJourneyMotion from "./JourneyMotion";
import styles from "./JourneySection.module.css";

type Props = {
  /** Reuse the existing accessible photo lightbox in HeritageInvitation. */
  onOpenPhoto: (galleryIndex: number) => void;
};

const PHOTO_CORNER = "/heritage/memories/memory-photo-corner.svg";

/**
 * Three editable photo-and-story milestones. The media stays sourced from
 * invitation.gallery; copy and photo selection are configured in invitation.journey.
 */
export default function JourneySection({ onOpenPhoto }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  useJourneyMotion(sectionRef);

  return (
    <section ref={sectionRef} id="memories" className={styles.section}
      aria-labelledby="memories-title">
      <div className={styles.paper} aria-hidden="true" />
      <div className={styles.gatewayMist} aria-hidden="true" />
      <div className={styles.botanical + " " + styles.botanicalTop}
        data-journey-botanical aria-hidden="true">
        <Image src="/heritage/floral-left.png" alt="" fill sizes="(max-width: 650px) 170px, 360px" />
      </div>
      <div className={styles.botanical + " " + styles.botanicalSide}
        data-journey-botanical aria-hidden="true">
        <Image src="/heritage/floral-right.png" alt="" fill sizes="(max-width: 650px) 125px, 300px" />
      </div>

      <header className={styles.intro} data-journey-title>
        <span className={styles.eyebrow}>CHAPTER THREE · THE STORY OF US</span>
        <h2 id="memories-title" className={styles.title}>
          Our Journey <em>Together</em>
        </h2>
        <p className={styles.lead}>Every love story begins with a moment.</p>
        <div className={styles.titleAccent} aria-hidden="true">
          <span />
          <Image src="/heritage/memories/memory-lotus-marker.svg"
            alt="" width={36} height={40} />
          <span />
        </div>
      </header>

      <div className={styles.story} data-journey-story>
        <JourneyTimeline className={styles.timeline}
          pathClassName={styles.timelinePath}
          markerClassName={styles.timelineMarker} />

        {invitation.journey.map((memory, index) => {
          const photo = invitation.gallery[memory.galleryIndex];
          if (!photo) return null;

          return (
            <article key={memory.number}
              className={[
                styles.memory,
                index === 1 ? styles.reverse : "",
                index === 2 ? styles.lastMemory : "",
              ].join(" ")}
              data-memory={index}>
              <div className={styles.photoColumn}>
                <div className={styles.photoMotion} data-memory-photo>
                  <button className={styles.photoButton} type="button"
                    onClick={() => onOpenPhoto(memory.galleryIndex)}
                    aria-label={"Open wedding photograph: " + photo.alt}>
                    <span className={styles.photoPaper}>
                      <span className={styles.photoWindow}>
                        {/* These are editable customer demo-photo URLs. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                      </span>
                      <Image className={styles.photoCornerTop} src={PHOTO_CORNER}
                        alt="" width={52} height={52} aria-hidden="true" />
                      <Image className={styles.photoCornerBottom} src={PHOTO_CORNER}
                        alt="" width={52} height={52} aria-hidden="true" />
                    </span>
                    <span className={styles.photoAction}>VIEW PHOTO <span aria-hidden="true">↗</span></span>
                  </button>
                  {index !== 1 ? (
                    <Image className={styles.photoMagnolia}
                      src="/heritage/floral-left.png" alt="" width={260} height={260}
                      sizes="(max-width: 650px) 90px, 150px" aria-hidden="true"/>
                  ) : null}
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
        <div className={styles.endRule} />
        <Image className={styles.closingLotus} data-journey-flourish
          src="/heritage/memories/memory-closing-lotus.svg"
          alt="" width={284} height={142} />
        <p className={styles.closingQuote}>Every beautiful journey leads us here.</p>
        <span className={styles.closingSignoff}>TO BE CONTINUED · WITH LOVE</span>
      </div>
      <div className={styles.burgundyBridge} aria-hidden="true" />
    </section>
  );
}
