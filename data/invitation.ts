/**
 * JN-W01 — Essential customer content.
 * All default names, dates, venue wording and photos below are DEMO content.
 * Replace these before publishing a real invitation.
 */
export const invitation = {
  couple: {
    first: "Aung",
    second: "Thiri",
    signature: "Aung & Thiri",
  },
  intro: "Together with our families",
  heroTypography: {
    heading: "THE WEDDING CELEBRATION OF",
    romanticMessage: "Two hearts, one beautiful beginning",
    language: "en" as const, // Change to "my" for Myanmar Unicode typography.
  },
  tagline: "A celebration of love, family & forever",
  greeting: "With grateful hearts and joyful spirits, we invite you to share in the beginning of our forever.",
  dateISO: "2026-12-12T09:00:00+06:30",
  dayOfWeek: "Saturday",
  displayDay: "12",
  displayMonth: "December",
  displayYear: "2026",
  ceremony: [
    { time: "09:00 AM", title: "Wedding ceremony", detail: "The beginning of forever" },
    { time: "11:30 AM", title: "Wedding luncheon", detail: "A gathering of loved ones" },
    { time: "01:00 PM", title: "Blessings & photographs", detail: "Memories to cherish" },
  ],
  venue: {
    name: "Our Wedding Venue",
    address: "Venue details will appear here",
    city: "Yangon, Myanmar",
    directionsUrl: "",
  },
  gallery: [
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1100&q=85",
      alt: "Sample photograph of a couple celebrating at a wedding",
      caption: "A moment of forever",
    },
    {
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85",
      alt: "Sample wedding celebration photography",
      caption: "Made with love",
    },
    {
      src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=85",
      alt: "Sample wedding floral details",
      caption: "Little details",
    },
    {
      src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85",
      alt: "Sample romantic wedding photography",
      caption: "Us, always",
    },
  ],
  closing: "Your presence is our greatest blessing. Thank you for sharing this beautiful day with us.",
  contactEmail: "",
  /**
   * Two selectable Standard Add-ons are illustrated below.
   * Premium RSVP with stored guest responses is NOT part of Essential.
   */
  standardAddOns: {
    countdown: true,
    calendar: true,
  },
} as const;