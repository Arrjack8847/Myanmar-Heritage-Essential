import LotusMotif from "@/components/heritage/LotusMotif";

type Props = {
  className: string;
  progressClassName: string;
  markerClassName: string;
};

/**
 * Each memory owns its own timeline segment. Marker alignment now follows the
 * actual row height (including mobile and variable text) rather than fixed
 * percentages across the entire gallery.
 */
export default function JourneyTimeline({ className, progressClassName, markerClassName }: Props) {
  return (
    <div className={className} aria-hidden="true">
      <span className={progressClassName} data-journey-progress />
      <span className={markerClassName} data-journey-marker>
        <LotusMotif />
      </span>
    </div>
  );
}
