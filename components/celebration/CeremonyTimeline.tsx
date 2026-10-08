import Image from "next/image";
import { invitation } from "@/data/invitation";

export default function CeremonyTimeline() {
  return (
    <section className="ceremony-timeline" aria-labelledby="ceremony-timeline-title">
      <div className="ceremony-timeline__corner ceremony-timeline__corner--left" aria-hidden="true">
        <Image
          src="/heritage/ceremony/ceremony-corner-flourish.png"
          alt="" fill sizes="(max-width: 759px) 85px, 110px"
        />
      </div>
      <div className="ceremony-timeline__corner ceremony-timeline__corner--right" aria-hidden="true">
        <Image
          src="/heritage/ceremony/ceremony-corner-flourish.png"
          alt="" fill sizes="(max-width: 759px) 85px, 110px"
        />
      </div>
      <div className="ceremony-timeline__toprule" aria-hidden="true"><span>✦</span></div>
      <h3 id="ceremony-timeline-title">ORDER OF CELEBRATION</h3>
      <div className="ceremony-timeline__body">
        <div className="ceremony-timeline__thread" aria-hidden="true" />
        <ol>
          {invitation.ceremony.map((item, index) => (
            <li className="ceremony-timeline__event" key={item.title}>
              <span className="ceremony-timeline__marker" aria-hidden="true">
                {index === 0 ? "✧" : "✦"}
              </span>
              <time>{item.time}</time>
              <div className="ceremony-timeline__description">
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="ceremony-timeline__bottomrule" aria-hidden="true"><span>✦</span></div>
    </section>
  );
}
