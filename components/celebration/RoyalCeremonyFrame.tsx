/**
 * Uses the original high-resolution ceremonial frame in non-distorted caps.
 * The two cap images remain at their natural aspect ratio; extendable fine
 * gold rails connect them for any amount of editable mobile ceremony content.
 */
export default function RoyalCeremonyFrame() {
  return (
    <div className="ceremony-frame" aria-hidden="true">
      <div className="ceremony-frame__rails">
        <span className="ceremony-frame__rail ceremony-frame__rail--left" />
        <span className="ceremony-frame__rail ceremony-frame__rail--right" />
      </div>
      <div className="ceremony-frame__cap ceremony-frame__cap--top" />
      <div className="ceremony-frame__cap ceremony-frame__cap--bottom" />
    </div>
  );
}
