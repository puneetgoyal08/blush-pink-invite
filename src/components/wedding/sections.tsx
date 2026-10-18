import { useEffect, useRef, useState } from "react";
import { CalendarPlus, MapPin, Plane, Train, Hotel, Car, Phone, Volume2, VolumeX, ChevronDown } from "lucide-react";
import botanical from "@/assets/botanical.png";
import { clean, coupleNames, formatDate, isTBC, wedding, type WeddingEvent } from "@/config/wedding";
import { Monogram, Reveal, SectionHeading, Text } from "./ui";
import { Countdown } from "./countdown";
import { ShareButton } from "./share";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const fullDate = formatDate(wedding.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const displayedDate = wedding.dateIsPlaceholder ? "Date to be announced" : fullDate;

const NAV = [
  ["story", "Story"], ["celebrations", "Events"], ["travel", "Travel"], ["rsvp", "RSVP"], ["gallery", "Gallery"], ["faq", "FAQ"],
] as const;

export function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav
      className={`fixed top-0 inset-x-0 z-30 transition-all duration-500 ${solid ? "bg-background/95 backdrop-blur border-b border-border text-forest" : "bg-forest/65 backdrop-blur-md text-on-image"}`}
      aria-label="Sections"
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3 md:gap-4">
        <a href="#top" className="shrink-0" aria-label="Back to top"><Monogram className="h-9 w-9" light={!solid} /></a>
        <div className={`ml-auto flex min-w-0 gap-4 md:gap-5 overflow-x-auto text-[0.62rem] sm:text-xs uppercase tracking-[0.16em] md:tracking-[0.2em] no-scrollbar ${solid ? "text-muted-foreground" : "text-on-image"}`}>
          {NAV.map(([id, label]) => <a key={id} href={`#${id}`} className="py-3 whitespace-nowrap hover:opacity-70">{label}</a>)}
        </div>
      </div>
    </nav>
  );
}

export function Hero() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  function toggle() {
    if (!wedding.musicUrl) return;
    if (!audio.current) { audio.current = new Audio(wedding.musicUrl); audio.current.loop = true; }
    if (playing) audio.current.pause(); else void audio.current.play();
    setPlaying(!playing);
  }
  return (
    <header id="top" className="relative min-h-[100svh] flex flex-col items-center justify-end overflow-hidden">
      <img src={wedding.heroImage} alt="Nidhi and Puneet walking beneath a floral archway" className="absolute inset-0 h-full w-full object-cover" width={1088} height={1600} fetchPriority="high" />
      <div className="absolute inset-0 bg-hero-overlay" />
      {wedding.musicUrl && (
        <button onClick={toggle} className="absolute top-5 right-5 z-10 h-11 w-11 rounded-full border border-gold/60 text-on-image flex items-center justify-center backdrop-blur-sm" aria-label={playing ? "Mute music" : "Play music"}>
          {playing ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      )}
      <div className="relative z-10 text-center px-6 pb-16 pt-24 max-w-2xl animate-in fade-in duration-1000">
        <Monogram light className="h-20 w-20 mx-auto mb-6" />
        <p className="eyebrow mb-5 text-on-image">The wedding of</p>
        <h1 className="text-on-image text-6xl sm:text-7xl md:text-8xl leading-[0.95]">
          {wedding.bride} <span className="italic text-gold">&amp;</span><br className="sm:hidden" /> {wedding.groom}
        </h1>
        <p className="text-on-image opacity-90 mt-6 text-base md:text-lg font-serif italic text-balance">{wedding.invitation}</p>
        <div className="hairline w-32 mx-auto my-6" />
        <p className="text-on-image text-sm tracking-[0.2em] uppercase">{displayedDate}</p>
        <p className="text-on-image opacity-80 text-sm mt-1">{clean(wedding.location)}{isTBC(wedding.location) && " · details to follow"}</p>
        {!wedding.dateIsPlaceholder && <div className="mt-8"><Countdown compact light /></div>}
        <a href="#story" className="mt-10 inline-flex items-center gap-2 h-12 px-8 rounded-full bg-ivory text-forest text-sm tracking-wide hover:opacity-90 transition">
          Explore Our Wedding <ChevronDown className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}

function Botanical({ className = "" }: { className?: string }) {
  return <img src={botanical} alt="" aria-hidden className={`pointer-events-none select-none ${className}`} loading="lazy" width={1024} height={1024} />;
}

export function Story() {
  const s = wedding.story;
  return (
    <section id="story" className="relative py-24 md:py-32 px-6 overflow-hidden">
      <Botanical className="absolute -top-10 -right-24 w-64 opacity-50 sway" />
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="Our story" title="Two Stories, One Beautiful Journey" />
        <Reveal className="max-w-2xl mx-auto text-center font-serif text-xl md:text-2xl leading-relaxed text-forest/90">
          <Text value={s.intro} />
        </Reveal>
        <div className="grid grid-cols-3 gap-3 md:gap-6 mt-16">
          {s.photos.map((p, i) => (
            <Reveal key={i} delay={i * 120} className={i === 1 ? "translate-y-8" : ""}>
              <img src={p} alt="" loading="lazy" className="w-full aspect-[3/4] object-cover rounded-sm" />
            </Reveal>
          ))}
        </div>
        <ol className="relative mt-28 max-w-2xl mx-auto border-l border-gold/50 pl-8 space-y-12">
          {s.milestones.map((m, i) => (
            <Reveal key={i} delay={i * 80}>
              <li className="relative">
                <span className="absolute -left-[37px] top-2 h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-background" />
                <p className="eyebrow"><Text value={m.year} /></p>
                <h3 className="text-3xl mt-1">{m.title}</h3>
                <p className="text-muted-foreground mt-2"><Text value={m.text} /></p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function icsFor(e: WeddingEvent) {
  const f = (s: string) => new Date(s).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const body = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//NP Wedding//EN", "BEGIN:VEVENT",
    `UID:${e.id}@np-wedding`, `DTSTAMP:${f(new Date().toISOString())}`, `DTSTART:${f(e.start)}`, `DTEND:${f(e.end)}`,
    `SUMMARY:${e.name} — ${coupleNames}`, `LOCATION:${clean(e.venue)}, ${clean(e.address)}`, `DESCRIPTION:${e.description}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
  const a = document.createElement("a"); a.href = url; a.download = `${e.id}.ics`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function gcal(e: WeddingEvent) {
  const f = (s: string) => new Date(s).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const p = new URLSearchParams({ action: "TEMPLATE", text: `${e.name} — ${coupleNames}`, dates: `${f(e.start)}/${f(e.end)}`, details: e.description, location: `${clean(e.venue)}, ${clean(e.address)}` });
  return `https://calendar.google.com/calendar/render?${p}`;
}

const maps = (q: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

export function Celebrations() {
  return (
    <section id="celebrations" className="py-24 md:py-32 px-6 bg-muted/60">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="The celebrations" title="Join us for every moment" />
        <div className="space-y-16 md:space-y-24">
          {wedding.events.map((e, i) => (
            <Reveal key={e.id}>
              <article className={`grid md:grid-cols-2 gap-8 md:gap-14 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="relative">
                  {e.image ? (
                    <img src={e.image} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover rounded-sm" />
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center rounded-sm border border-gold/40 bg-card">
                      <Botanical className="w-1/2" />
                    </div>
                  )}
                  <span className="absolute -top-5 left-5 font-serif italic text-6xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <p className="eyebrow">{formatDate(e.start, { weekday: "long", day: "numeric", month: "long" })}</p>
                  <h3 className="text-5xl mt-2">{e.name}</h3>
                  {!isTBC(e.description) && <p className="text-muted-foreground mt-3 font-serif italic text-lg">{e.description}</p>}
                  <dl className="mt-6 space-y-3 text-sm">
                    <div className="flex gap-3"><dt className="w-20 shrink-0 text-muted-foreground uppercase tracking-widest text-[0.65rem] pt-0.5">Time</dt><dd>{e.timeIsPlaceholder ? <span className="placeholder-tag">to be confirmed</span> : <>{formatDate(e.start, { hour: "numeric", minute: "2-digit" })} – {formatDate(e.end, { hour: "numeric", minute: "2-digit" })}</>}</dd></div>
                    <div className="flex gap-3"><dt className="w-20 shrink-0 text-muted-foreground uppercase tracking-widest text-[0.65rem] pt-0.5">Venue</dt><dd><Text value={e.venue} /><br /><span className="text-muted-foreground"><Text value={e.address} /></span></dd></div>
                    {e.dressCode && <div className="flex gap-3"><dt className="w-20 shrink-0 text-muted-foreground uppercase tracking-widest text-[0.65rem] pt-0.5">Attire</dt><dd>{e.dressCode}</dd></div>}
                  </dl>
                  {(!isTBC(e.venue) && !isTBC(e.address)) || !e.timeIsPlaceholder ? (
                    <div className="flex flex-wrap gap-2 mt-7">
                      {!isTBC(e.venue) && !isTBC(e.address) && <a href={maps(`${clean(e.venue)}, ${clean(e.address)}`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-gold text-sm hover:bg-card"><MapPin className="h-4 w-4" /> Directions</a>}
                      {!e.timeIsPlaceholder && <a href={gcal(e)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-gold text-sm hover:bg-card"><CalendarPlus className="h-4 w-4" /> Google Calendar</a>}
                      {!e.timeIsPlaceholder && <button onClick={() => icsFor(e)} className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-border text-sm hover:bg-card">Apple / Outlook</button>}
                    </div>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CountdownSection() {
  return (
    <section className="py-24 md:py-32 px-6 text-center relative overflow-hidden">
      <Botanical className="absolute -left-20 bottom-0 w-56 opacity-40 sway" />
      <Reveal>
        <p className="eyebrow mb-4">{wedding.dateIsPlaceholder ? "The date" : wedding.timeIsPlaceholder ? "Save the date" : "Counting down to"}</p>
        <p className="font-serif italic text-3xl md:text-4xl mb-12">{displayedDate}</p>
        <Countdown />
      </Reveal>
    </section>
  );
}

export function Travel() {
  const t = wedding.travel;
  const items = [
    { icon: Plane, label: "By air", v: t.airport },
    { icon: Train, label: "By rail", v: t.railway },
    { icon: Car, label: "Getting around", v: t.transport },
  ];
  return (
    <section id="travel" className="py-24 md:py-32 px-6 bg-secondary/50">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="Venue & travel" title="Finding your way to us" />
        <Reveal className="text-center mb-16">
          <h3 className="text-3xl"><Text value={t.venue.name} /></h3>
          <p className="text-muted-foreground mt-2"><Text value={t.venue.address} /></p>
          <a href={maps(`${clean(t.venue.name)} ${clean(t.venue.address)}`)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground text-sm"><MapPin className="h-4 w-4" /> Open in Maps</a>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {items.map(({ icon: I, label, v }) => (
            <Reveal key={label} className="text-center md:text-left">
              <I className="h-5 w-5 text-gold mx-auto md:mx-0" />
              <p className="eyebrow mt-3">{label}</p>
              <p className="mt-2 text-sm leading-relaxed"><Text value={v} /></p>
            </Reveal>
          ))}
        </div>
        <div className="hairline my-16" />
        <div className="grid md:grid-cols-2 gap-12">
          <Reveal>
            <p className="eyebrow flex items-center gap-2"><Hotel className="h-4 w-4" /> Where to stay</p>
            <ul className="mt-5 space-y-4">
              {t.hotels.map((h, i) => <li key={i}><p className="font-serif text-2xl"><Text value={h.name} /></p><p className="text-sm text-muted-foreground"><Text value={h.note} /></p></li>)}
            </ul>
          </Reveal>
          <Reveal>
            <p className="eyebrow flex items-center gap-2"><Phone className="h-4 w-4" /> Questions? Reach out</p>
            <ul className="mt-5 space-y-4">
              {t.contacts.map((c, i) => (
                <li key={i}>
                  <p className="font-serif text-2xl"><Text value={c.name} /></p>
                  <p className="text-sm text-muted-foreground">{c.role} · {isTBC(c.phone) ? <Text value={c.phone} /> : <a className="underline" href={`tel:${c.phone}`}>{c.phone}</a>}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="py-24 md:py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <SectionHeading eyebrow="Good to know" title="Questions & answers" />
        <Reveal>
          <Accordion type="single" collapsible>
            {wedding.faq.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`}>
                <AccordionTrigger className="font-serif text-xl text-left hover:no-underline py-5">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground"><Text value={f.a} /></AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

export function Closing() {
  return (
    <footer className="relative py-28 md:py-36 px-6 text-center overflow-hidden bg-muted/60">
      <Botanical className="w-40 mx-auto mb-6 sway" />
      <Reveal>
        <p className="font-serif italic text-3xl md:text-5xl text-balance">We can't wait to celebrate with you.</p>
        <p className="font-serif text-5xl md:text-7xl mt-8">{coupleNames}</p>
        <div className="hairline w-24 mx-auto my-6" />
        <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground">{displayedDate}</p>
        <div className="mt-10"><ShareButton /></div>
      </Reveal>
    </footer>
  );
}
