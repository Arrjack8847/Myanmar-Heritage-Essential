import Image from "next/image";
import { invitation } from "@/data/invitation";

const ROOT = "/heritage/heirloom/";

type OrnamentProps = {
  file: string;
  className: string;
};

function Ornament({ file, className }: OrnamentProps) {
  return (
    <span className={className} aria-hidden="true">
      <Image src={ROOT + file + ".png"} alt="" fill sizes="(max-width: 700px) 85vw, 420px" />
    </span>
  );
}

/**
 * The supplied corner artwork is a single square transparent PNG containing
 * four separate corner motifs. Crop each QUADRANT without stretching or
 * duplicating the pixels, then position its motif in the card's actual corner.
 */
function RoyalCardCorners() {
  return (
    <div className="royal-heirloom__corners" aria-hidden="true">
      <span className="royal-heirloom__corner royal-heirloom__corner--tl" />
      <span className="royal-heirloom__corner royal-heirloom__corner--tr" />
      <span className="royal-heirloom__corner royal-heirloom__corner--bl" />
      <span className="royal-heirloom__corner royal-heirloom__corner--br" />
    </div>
  );
}

function Portrait({ src, alt, frame, className }: {
  src: string;
  alt: string;
  frame: "portrait-frame-top" | "portrait-frame-bottom";
  className: string;
}) {
  return (
    <div className={"royal-heirloom__portrait " + className}>
      <span className="royal-heirloom__photo">
        {/* The editable demo photographs share the existing gallery's external image source. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </span>
      <Ornament file={frame} className="royal-heirloom__portrait-frame" />
    </div>
  );
}

/**
 * Section 01's second, compact invitation page.
 * Visual ornament layers are independent PNGs; all customer details are live HTML.
 * Its entrance/exit are controlled by HeritageHero's SINGLE reversible scroll timeline.
 */
export default function RoyalHeirloomCard() {
  const card = invitation.heirloom;
  return (
    <div className="royal-heirloom-anchor">
      <article className="royal-heirloom" aria-label="Royal heirloom portrait invitation">
      <div className="royal-heirloom__card">
        <Ornament file="heirloom-card-paper" className="royal-heirloom__paper" />
        <Ornament file="heirloom-card-frame" className="royal-heirloom__frame" />
        <RoyalCardCorners />
        <Ornament file="heirloom-card-crown" className="royal-heirloom__crown" />

        <p className="royal-heirloom__eyebrow" lang="my">မင်္ဂလာဖိတ်ကြားလွှာ</p>

        <div className="royal-heirloom__row royal-heirloom__row--groom">
          <Portrait
            src={card.groomPortrait}
            alt="Fictional wedding couple, first sample portrait"
            frame="portrait-frame-top"
            className="royal-heirloom__top-portrait"
          />
          <div className="royal-heirloom__name royal-heirloom__groom-name" lang="my">
            <small>သတို့သား</small>
            <h2 id="heirloom-groom-name">{card.groomName}</h2>
            <div className="royal-heirloom__name-flourish" aria-hidden="true">
              <Ornament file="lotus-name-accent-left" className="royal-heirloom__accent royal-heirloom__accent--left" />
              <span className="royal-heirloom__name-rule" />
              <Ornament file="lotus-name-accent-right" className="royal-heirloom__accent royal-heirloom__accent--right" />
            </div>
          </div>
        </div>

        <div className="royal-heirloom__rings">
          <span className="royal-heirloom__divider-rule" aria-hidden="true" />
          <Ornament file="rings-medallion" className="royal-heirloom__rings-art" />
          <span className="royal-heirloom__divider-rule" aria-hidden="true" />
        </div>

        <div className="royal-heirloom__row royal-heirloom__row--bride">
          <div className="royal-heirloom__name royal-heirloom__bride-name" lang="my">
            <small>သတို့သမီး</small>
            <h2 id="heirloom-bride-name">{card.brideName}</h2>
            <div className="royal-heirloom__name-flourish" aria-hidden="true">
              <Ornament file="lotus-name-accent-left" className="royal-heirloom__accent royal-heirloom__accent--left" />
              <span className="royal-heirloom__name-rule" />
              <Ornament file="lotus-name-accent-right" className="royal-heirloom__accent royal-heirloom__accent--right" />
            </div>
          </div>
          <Portrait
            src={card.bridePortrait}
            alt="Fictional wedding couple, second sample portrait"
            frame="portrait-frame-bottom"
            className="royal-heirloom__bottom-portrait"
          />
        </div>

        {/* The client's actual transparent gold divider; independent and replaceable. */}
        <div className="royal-heirloom__blessing" lang="my">
          <Ornament file="name-divider-ornament" className="royal-heirloom__blessing-divider" />
          <p>{card.blessing}</p>
        </div>
        <div className="royal-heirloom__cta">
          <a className="royal-action royal-action--wine royal-heirloom__button"
            href={card.buttonTarget} aria-label={card.buttonText} lang="my">
            <span className="royal-action__label">{card.buttonText}</span>
            <span className="royal-action__arrow" aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      </article>
    </div>
  );
}
