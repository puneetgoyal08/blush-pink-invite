import { wedding } from "@/config/wedding";

export type SheetRsvp = {
  name: string;
  contact: string;
  attending: boolean;
  guests: number;
  events: string;
  arrival: string;
  mode: string;
  message: string;
  website: string; // honeypot, dropped by the script when filled
};

// Posts an RSVP to the Google Apps Script web app behind wedding.rsvpSheetUrl and
// returns true only when the script confirms it saved the row ("ok").
// A text/plain POST avoids a CORS preflight, and an Apps Script web app shared with
// "Anyone" answers with Access-Control-Allow-Origin: *, so the reply is readable.
export async function postRsvpToSheet(rsvp: SheetRsvp): Promise<boolean> {
  if (!wedding.rsvpSheetUrl) return false;
  const res = await fetch(wedding.rsvpSheetUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(rsvp),
  });
  return res.ok && (await res.text()).trim() === "ok";
}
