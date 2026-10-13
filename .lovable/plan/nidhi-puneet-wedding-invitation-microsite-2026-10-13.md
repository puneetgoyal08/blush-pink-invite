# Nidhi & Puneet — Wedding Invitation Microsite

A mobile-first, editorial Indian wedding site shared via WhatsApp. One long scrolling invitation (as the brief requests), with smooth in-page navigation, plus a private admin page for the couple.

## Visual direction
- Palette: warm ivory/cream background, muted sage, deep forest green text, champagne gold hairlines, occasional blush.
- Type: Cormorant Garamond (names, headlines, italic moments) + Figtree (details, buttons, body).
- Details: fine-line botanical SVGs, gold hairline dividers, N & P monogram seal, gentle fade/reveal on scroll (disabled for reduced motion).
- Generated imagery: hero photograph (couple, soft cinematic marigold/jasmine mood), botanical illustrations, gallery and story placeholders, event illustrations, and a 1200x630 social preview card with names + date.

## Page sections (in order)
1. Hero — full-bleed photo, monogram, "Nidhi & Puneet", invitation line, date/location placeholders, compact countdown, "Explore Our Wedding" button, music toggle (off by default).
2. Our Story — "Two Stories, One Beautiful Journey": intro, milestone timeline, photo strip; all copy marked as editable sample.
3. Celebrations — editorial cards for configurable events (Mehendi, Haldi, Sangeet, Ceremony, Reception); each with date/time, venue, address, dress code, Google Maps link, add-to-calendar (.ics + Google Calendar).
4. Countdown — elegant days/hours/minutes/seconds; switches to "We're married" message after the date.
5. Venue & Travel — venue, map link, airport/railway, hotels, local transport, contacts (placeholders).
6. RSVP — name, phone/email, accept/decline, guest count, events attending, dietary, message; validation, success state, duplicate prevention.
7. Gallery — editorial masonry grid with tap-to-expand lightbox, swipe/arrow navigation, lazy loading.
8. Guest Wishes — name + message (length-limited), held for approval, shows approved wishes.
9. FAQ — accordion with clearly marked placeholder answers.
10. Closing — "We can't wait to celebrate with you.", floral art, date, Share Invitation.

Sticky minimal top nav with section links; floating "Share" button. Share sheet: native share, WhatsApp with prefilled message, copy link with toast — always using the live site address.

## Content configuration
All wedding details (names, date + timezone, location, events, travel, RSVP deadline, contacts, FAQ, images) in one central config file, with clearly labelled "[To be confirmed]" placeholders.

## Backend (Lovable Cloud)
- Tables: RSVPs and wishes. Guests submit without signing in; public visitors can never read RSVPs or contact details. Only approved wishes (name + message) are publicly readable.
- Submissions go through server-side validation with a honeypot field, length limits, and basic rate limiting; duplicate RSVPs (same phone/email) update rather than duplicate.
- Admin page (/admin): couple signs in with email/password; admin role checked server-side. View/export RSVPs with totals per event, approve or delete wishes. Guest site stays login-free.

## Verification
Mobile and desktop screenshots, all buttons/nav, countdown before/after, RSVP save + read-back in admin, confirm anonymous reads are blocked, share/copy actions, empty/error states.

## Technical details
- TanStack Start route `/` (all sections, full head metadata + og image once published URL exists), `/admin` behind auth.
- `src/config/wedding.ts` central config; components per section under `src/components/wedding/`.
- Server functions for submitRsvp / submitWish (zod validation, honeypot, IP-hash throttle) using admin client; public approved-wishes read via a narrow anon SELECT policy on a view/columns.
- `user_roles` table + `has_role` security-definer function for admin; RLS on all tables.
- Design tokens in `src/styles.css` (oklch), fonts via `<link>` in root.
- Prefers-reduced-motion respected; IntersectionObserver reveals.
