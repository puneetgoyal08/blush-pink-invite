# Saving RSVPs to a Google Sheet

Each RSVP is sent to a small Google Apps Script attached to a Google Sheet, which adds one row per response. This works on every link to the site (Lovable, Vercel and GitHub Pages).

## Setup (once, about 5 minutes)

1. Create a new Google Sheet, for example "Wedding RSVPs".
2. In the sheet, open **Extensions → Apps Script**, delete what's there, paste the script below and click **Save**.
3. Click **Deploy → New deployment**, choose the type **Web app**, and set:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, allow the permissions Google asks for, and copy the **Web app URL** (it ends in `/exec`).
5. Paste that URL into `rsvpSheetUrl` in `src/config/wedding.ts` (or send it to Claude to do it).

If you edit the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

## Script

```js
const HEADERS = ["Submitted at", "Name", "Phone or email", "Attending", "Guests", "Celebrations", "Arriving", "Travelling by", "Note"];

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (d.website) return ContentService.createTextOutput("ignored"); // spam honeypot
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  const clip = (v, n) => String(v ?? "").slice(0, n);
  sheet.appendRow([
    new Date(),
    clip(d.name, 100),
    "'" + clip(d.contact, 255), // leading ' keeps phone numbers as text
    d.attending ? "Yes" : "No",
    Number(d.guests) || 0,
    clip(d.events, 200),
    clip(d.arrival, 40),
    clip(d.mode, 40),
    clip(d.message, 600),
  ]);
  return ContentService.createTextOutput("ok");
}
```

People who update their RSVP get a new row; the latest row for a name/contact is their current answer.
