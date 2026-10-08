import { Lotus } from "@/components/Decorations";
import { invitation } from "@/data/invitation";

/** Editorial lotus timeline, progressively revealed by the sticky story. */
export default function CeremonyTimeline() {
  return (
    <section className="ceremony-timeline ceremony-timeline--unfold" aria-labelledby="ceremony-timeline-title">
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
