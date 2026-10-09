import type { ReactNode } from "react";
import { invitation } from "@/data/invitation";
import styles from "./VenueDetails.module.css";

type VenueDetailsProps = {
  /** The existing venue illustration today; the animated gateway tomorrow. */
  artwork?: ReactNode;
  /** Render inside the sticky Royal Gateway without competing reveal triggers. */
  gateway?: boolean;
};

/**
 * Accept a real Google Maps destination, never a dummy navigation link.
 * Users may paste either a full Maps URL or a maps.app.goo.gl sharing link.
 */
function getDirectionsUrl(rawUrl: string): string | null {
  if (!rawUrl.trim()) return null;

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;

    const host = url.hostname.toLowerCase();
    const isMapsShare = host === "maps.app.goo.gl";
    const isGoogleMaps =
      (host === "google.com" || host === "www.google.com") &&
      url.pathname.startsWith("/maps");
    const isMapsDomain = host === "maps.google.com";
    const isLegacyShare = host === "goo.gl" && url.pathname.startsWith("/maps/");

    return isMapsShare || isGoogleMaps || isMapsDomain || isLegacyShare
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

/**
 * JN-W01 · Component 13 — Venue typography and location.
 *
 * The words are editable HTML, not artwork. The outer gateway controller
 * can target data-gateway-reveal attributes for a scrubbed entrance;
 * this component creates no competing ScrollTrigger of its own.
 */
export default function VenueDetails({ artwork, gateway = false }: VenueDetailsProps) {
  const venue = invitation.venue;
  const directionsUrl = getDirectionsUrl(venue.directionsUrl);
  const hasStreetAddress =
    venue.address.trim().length > 0 &&
    venue.address.trim().toLowerCase() !== "venue details will appear here";

  return (
    <div className={`${styles.root}${gateway ? ` ${styles.gateway}` : ""}`}>
      <header className={`${styles.heading}${gateway ? "" : " js-reveal"}`} data-gateway-reveal="heading">
        <p className={styles.chapter}>CHAPTER TWO · THE GATHERING PLACE</p>
        <h2 id="venue-title" className={styles.title}>
          Where We <em>Gather</em>
        </h2>
        <span className={styles.divider} aria-hidden="true">
          <span />
          <svg viewBox="0 0 46 30" fill="none" aria-hidden="true">
            <path d="M23 24C17 19 18 11 23 5c5 6 6 14 0 19Z" />
            <path d="M22 24C13 23 9 17 8 12c8 1 13 5 15 12Z" />
            <path d="M24 24c9-1 13-7 14-12-8 1-13 5-15 12Z" />
            <path d="M10 25c6 4 20 5 26 0" />
          </svg>
          <span />
        </span>
      </header>

      {artwork ? (
        <div className={`${styles.artwork}${gateway ? "" : " js-reveal"}`} data-gateway-artwork>
          {artwork}
        </div>
      ) : null}

      <div className={`${styles.details}${gateway ? "" : " js-reveal"}`} data-gateway-reveal="details">
        <p className={styles.welcome}>With joy, we welcome you to</p>
        <h3 className={styles.venueName} data-gateway-reveal="venue-name">
          {venue.name}
        </h3>
        <address className={styles.address} data-gateway-reveal="venue-address">
          {hasStreetAddress ? <span>{venue.address}</span> : null}
          {venue.city.trim() ? <span>{venue.city}</span> : null}
        </address>
        {directionsUrl ? (
          <a
            className={`${styles.directions} royal-action royal-action--wine`}
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View directions to ${venue.name} on Google Maps (opens in a new tab)`}
            data-gateway-reveal="venue-directions"
          >
            VIEW DIRECTIONS <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <p className={styles.pending}>Directions will be available once the venue is confirmed.</p>
        )}
      </div>
    </div>
  );
}
