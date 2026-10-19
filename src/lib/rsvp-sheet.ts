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

// Posts an RSVP to the Google Apps Script web app behind wedding.rsvpSheetUrl.
// Apps Script doesn't send CORS headers, so this is a no-cors request: the response
// can't be read, and resolving only means the request reached Google.
// Returns false when no sheet is configured.
export async function postRsvpToSheet(rsvp: SheetRsvp): Promise<boolean> {
  if (!wedding.rsvpSheetUrl) return false;
  await fetch(wedding.rsvpSheetUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(rsvp),
  });
  return true;
}
