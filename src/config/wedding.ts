// Central wedding configuration. Edit values here — the whole site updates.
// Anything wrapped in TBC() is a placeholder shown with a "to be confirmed" tag.
import hero from "@/assets/hero.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";

export const TBC_PREFIX = "[TBC] ";
export const TBC = (s: string) => TBC_PREFIX + s;
export const isTBC = (s?: string) => !!s && s.startsWith(TBC_PREFIX);
export const clean = (s?: string) => (s ?? "").replace(TBC_PREFIX, "");

export type WeddingEvent = {
  id: string;
  name: string;
  description: string;
  start: string; // ISO with timezone offset
  end: string;
  timeIsPlaceholder: boolean;
  venue: string;
  address: string;
  dressCode?: string;
  image?: string;
};

export const wedding = {
  bride: "Nidhi",
  groom: "Puneet",
  invitation: "Together with our families, we invite you to celebrate our wedding.",
  date: "2026-12-05T00:00:00+05:30",
  dateIsPlaceholder: false,
  timeIsPlaceholder: true,
  timezone: "Asia/Kolkata",
  location: "Rampura Phul",
  rsvpDeadline: TBC("Date to be confirmed"),
  heroImage: hero,
  musicUrl: "", // add an mp3 URL to enable the music toggle

  story: {
    intro: TBC(
      "A few lines about how Nidhi and Puneet met, and what makes them, them. Replace this sample text with your own words.",
    ),
    milestones: [
      { year: TBC("Year"), title: "The first hello", text: TBC("Where and how you met.") },
      { year: TBC("Year"), title: "Falling for each other", text: TBC("A favourite memory together.") },
      { year: TBC("Year"), title: "The proposal", text: TBC("How the question was popped.") },
      { year: "2026", title: "Forever begins", text: "And now, we celebrate — with you." },
    ],
    photos: [g2, g1, g3],
  },

  events: [
    {
      id: "haldi",
      name: "Haldi",
      description: TBC("Event details to be confirmed."),
      start: "2026-12-03T00:00:00+05:30",
      end: "2026-12-03T00:00:00+05:30",
      timeIsPlaceholder: true,
      venue: TBC("Exact venue"),
      address: "Bathinda",
    },
    {
      id: "sangeet",
      name: "Sangeet",
      description: TBC("Event details to be confirmed."),
      start: "2026-12-04T00:00:00+05:30",
      end: "2026-12-04T00:00:00+05:30",
      timeIsPlaceholder: true,
      venue: "Sepal",
      address: "Bathinda",
      image: g4,
    },
    {
      id: "wedding",
      name: "Wedding",
      description: TBC("Event details to be confirmed."),
      start: "2026-12-05T00:00:00+05:30",
      end: "2026-12-05T00:00:00+05:30",
      timeIsPlaceholder: true,
      venue: "Sky Heights",
      address: "Rampura Phul",
      image: g3,
    },
  ] as WeddingEvent[],

  travel: {
    venue: { name: "Sky Heights", address: "Rampura Phul" },
    airport: TBC("Nearest airport — distance & travel time"),
    railway: TBC("Nearest railway station — distance & travel time"),
    hotels: [
      { name: TBC("Hotel one"), note: TBC("Distance, booking code") },
      { name: TBC("Hotel two"), note: TBC("Distance, booking code") },
    ],
    transport: TBC("Shuttles, cabs and local transport details."),
    contacts: [
      { name: TBC("Contact person"), role: "Travel & stay", phone: TBC("+91 00000 00000") },
      { name: TBC("Contact person"), role: "Event day", phone: TBC("+91 00000 00000") },
    ],
  },

  gallery: [
    { src: g2, alt: "Nidhi and Puneet laughing at sunset" },
    { src: g1, alt: "Mehendi hands holding a marigold garland" },
    { src: hero, alt: "The couple walking beneath a floral archway" },
    { src: g4, alt: "Palace courtyard lit with lanterns" },
    { src: g3, alt: "Brass diya with jasmine and rose petals" },
  ],

  faq: [
    { q: "What should I wear?", a: TBC("Dress code notes for each event.") },
    { q: "What time should I arrive?", a: TBC("Arrival guidance for each event.") },
    { q: "Is there parking or transport?", a: TBC("Parking and transport details.") },
    { q: "Where should I stay?", a: TBC("See Venue & Travel — details to follow.") },
    { q: "Can I bring children or a plus-one?", a: TBC("Your guidance on children and plus-ones.") },
    { q: "Do you have a gift preference?", a: TBC("Your gift preferences.") },
    { q: "Whom do I contact for help?", a: TBC("Name and number for questions.") },
  ],
};

export const coupleNames = `${wedding.bride} & ${wedding.groom}`;

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", { timeZone: wedding.timezone, ...opts }).format(new Date(iso));
}
