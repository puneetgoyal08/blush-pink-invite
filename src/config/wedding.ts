// Central wedding configuration. Edit values here — the whole site updates.
// Anything wrapped in TBC() is a placeholder shown with a "to be confirmed" tag.
import hero from "@/assets/hero.jpg";
import us1 from "@/assets/us-1.jpg";
import us2 from "@/assets/us-2.jpg";
import us3 from "@/assets/us-3.jpg";
import us4 from "@/assets/us-4.jpg";
import us5 from "@/assets/us-5.jpg";
import us6 from "@/assets/us-6.jpg";
import haldiArt from "@/assets/event-haldi.svg";
import sangeetArt from "@/assets/event-sangeet.svg";
import weddingArt from "@/assets/event-wedding.svg";

export const TBC_PREFIX = "[TBC] ";
export const TBC = (s: string) => TBC_PREFIX + s;
export const isTBC = (s?: string) => !!s && s.startsWith(TBC_PREFIX);
export const clean = (s?: string) => (s ?? "").replace(TBC_PREFIX, "");

export type WeddingEvent = {
  id: string;
  name: string;
  description: string;
  start: string; // ISO with timezone offset
  end: string; // same as start when no end time is set; shown as "onwards"
  timeIsPlaceholder: boolean;
  venue: string;
  address: string;
  hideDirections?: boolean; // e.g. a private home with no map pin yet
  dressCode?: string;
  image?: string;
};

export const wedding = {
  bride: "Nidhi",
  groom: "Puneet",
  invitation: "Together with our families, we invite you to celebrate our wedding.",
  date: "2026-12-05T20:00:00+05:30",
  dateIsPlaceholder: false,
  timeIsPlaceholder: false,
  timezone: "Asia/Kolkata",
  location: "Bathinda",
  hashtag: "#SarvagunNiPun",
  rsvpDeadline: TBC("Date to be confirmed"),
  // Google Apps Script web app URL (ends in /exec) that appends each RSVP to a Google Sheet.
  // See docs/google-sheet-rsvp.md. Leave empty to skip the sheet.
  rsvpSheetUrl: "https://script.google.com/macros/s/AKfycbz-iWZOoQJaZJS094Af-TgwhEqPUCFYQhebiXyLF0CkLqrP_MU7DBrYQUD85haq5jNL_A/exec",
  heroImage: hero,
  musicUrl: "", // add an mp3 URL to enable the music toggle

  events: [
    {
      id: "haldi",
      name: "Haldi",
      description: TBC("Event details to be confirmed."),
      start: "2026-12-03T00:00:00+05:30",
      end: "2026-12-03T00:00:00+05:30",
      timeIsPlaceholder: true,
      venue: "At home",
      address: "Bathinda",
      hideDirections: true,
      image: haldiArt,
    },
    {
      id: "sangeet",
      name: "Sangeet",
      description: TBC("Event details to be confirmed."),
      start: "2026-12-04T19:00:00+05:30",
      end: "2026-12-04T19:00:00+05:30",
      timeIsPlaceholder: false,
      venue: "Sepal",
      address: "Bathinda",
      image: sangeetArt,
    },
    {
      id: "wedding",
      name: "Wedding",
      description: TBC("Event details to be confirmed."),
      start: "2026-12-05T20:00:00+05:30",
      end: "2026-12-05T20:00:00+05:30",
      timeIsPlaceholder: false,
      venue: "Sky Heights",
      address: "Rampura Phul",
      image: weddingArt,
    },
  ] as WeddingEvent[],

  travel: {
    venue: {
      name: "Bathinda, Punjab",
      address: "The Haldi and Sangeet are in Bathinda. The wedding is at Sky Heights, Rampura Phul, about 30 km away.",
    },
    // Train timings change; guests are pointed to IRCTC / NTES for the current schedule.
    railway: {
      intro: "Bathinda Junction (BTI) is about 5 hours from Delhi, with several direct trains every day:",
      trains: [
        { no: "20409", name: "Delhi Cantt – Bathinda SF Express", note: "morning, about 5 hrs" },
        { no: "12481", name: "Delhi – Sri Ganganagar Intercity", note: "afternoon, about 5 hrs" },
        { no: "12455", name: "Delhi Sarai Rohilla – Bikaner Express", note: "overnight, about 6 hrs" },
        { no: "14731", name: "Kisan Express (Delhi – Bathinda)", note: "about 7 hrs" },
      ],
      outro: "Please check current timings on IRCTC or NTES before booking.",
    },
    airport: "Fly into Amritsar (ATQ), about 3.5 hours away by road; Ludhiana (LUH), about 2.5 hours; or Chandigarh (IXC), the biggest nearby airport, about 4 hours.",
    road: "Bathinda is about 320 km from Delhi, roughly 5 to 6 hours by car. Buses run from Delhi through the day and take about 6 to 7 hours.",
  },

  gallery: [
    { src: us1, alt: "Nidhi and Puneet hand in hand under a white floral arch, with confetti falling" },
    { src: us2, alt: "Nidhi twirling in an olive lehenga as Puneet looks on" },
    { src: us3, alt: "Nidhi and Puneet sharing an umbrella by the pool" },
    { src: us4, alt: "Nidhi and Puneet standing together in a cafe" },
    { src: us5, alt: "Puneet holding Nidhi's hand as she twirls an umbrella in the rain" },
    { src: us6, alt: "Nidhi and Puneet at a candlelit birthday dinner" },
  ],

  faq: [
    { q: "What should I wear?", a: TBC("Dress code notes for each event.") },
    { q: "What time should I arrive?", a: TBC("Arrival guidance for each event.") },
    { q: "Is there parking or transport?", a: TBC("Parking and transport details.") },
    { q: "Can I bring children or a plus-one?", a: TBC("Your guidance on children and plus-ones.") },
    { q: "Do you have a gift preference?", a: TBC("Your gift preferences.") },
  ],
};

export const coupleNames = `${wedding.bride} & ${wedding.groom}`;

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", { timeZone: wedding.timezone, ...opts }).format(new Date(iso));
}
