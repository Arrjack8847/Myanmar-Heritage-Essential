import Image from "next/image";
import { invitation } from "@/data/invitation";
import { DividerMotif, PagodaSkyline } from "@/components/Decorations";
import RoyalCeremonyFrame from "./RoyalCeremonyFrame";
import CeremonyTimeline from "./CeremonyTimeline";

/** Chapter two is the inner leaf of the SAME royal invitation, not a new card. */
export default function CelebrationSection() {
  return (
    <section id="celebration" className="celebration celebration--royal section-panel" aria-labelledby="celebration-title">
      <div className="ceremony-scene__paper" aria-hidden="true">
        <Image src="/heritage/ivory-parchment.png" alt="" fill sizes="100vw" />
      </div>
      {/* A quiet paper leaf: no duplicated pagoda image or magnolia canopy. */}

      <article className="ceremony-page">
        <RoyalCeremonyFrame />
        <div className="ceremony-page__content">
          <header className="ceremony-heading">
            <span className="ceremony-heading__chapter">CHAPTER ONE</span>
            <span className="ceremony-heading__subchapter">OUR CELEBRATION</span>
            <div className="ceremony-heading__diamond" aria-hidden="true">✦</div>
            <h2 id="celebration-title">A Union of <em>Two Hearts</em></h2>
            <p>{invitation.greeting}</p>
          </header>

          <div className="ceremony-date" aria-label={"Wedding date: " + invitation.dayOfWeek + ", " + invitation.displayDay + " " + invitation.displayMonth + " " + invitation.displayYear}>
            <span className="ceremony-date__line" aria-hidden="true" />
            <span className="ceremony-date__day">{invitation.displayDay}</span>
            <span className="ceremony-date__divider" aria-hidden="true" />
            <span className="ceremony-date__details">
              <span>{invitation.dayOfWeek}</span>
              <strong>{invitation.displayMonth}</strong>
              <span>{invitation.displayYear}</span>
            </span>
            <span className="ceremony-date__line" aria-hidden="true" />
          </div>

          <CeremonyTimeline />

          <footer className="ceremony-signoff">
            <DividerMotif aria-hidden="true" />
            <p>Two families, one beautiful beginning.</p>
          </footer>
        </div>
      </article>

      <PagodaSkyline className="ceremony-scene__skyline" />
    </section>
  );
}
