import Image from "next/image";
import { Lotus } from "@/components/Decorations";
import { invitation } from "@/data/invitation";

/** The existing royal timeline, progressively revealed by the sticky story. */
export default function CeremonyTimeline() {
  return (
    <section className="ceremony-timeline ceremony-timeline--unfold" aria-labelledby="ceremony-timeline-title">
      <div className="ceremony-timeline__corner ceremony-timeline__corner--left" aria-hidden="true">
        <Image src="/heritage/ceremony/ceremony-corner-flourish.png" alt="" fill sizes="85px" />
      </div>
      <div className="ceremony-timeline__corner ceremony-timeline__corner--right" aria-hidden="true">
        <Image src="/heritage/ceremony/ceremony-corner-flourish.png" alt="" fill sizes="85px" />
      </div>
      <h4 id="ceremony-timeline-title" className="ceremony-timeline__heading">ORDER OF CELEBRATION</h4>
      <div className="ceremony-timeline__body">
        <div className="ceremony-timeline__thread" aria-hidden="true" />
        <ol>
          {invitation.ceremony.map((item, index) => (
            <li className="ceremony-timeline__event" key={item.title}>
              <span className="ceremony-timeline__marker" aria-hidden="true">
                <Lotus />
              </span>
              <div className="ceremony-timeline__event-content">
                <span className="ceremony-timeline__chapter">0{index + 1} · {item.tabLabel}</span>
                <time>{item.time}</time>
                <h5>{item.title}</h5>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
