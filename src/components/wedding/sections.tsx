import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Plane, Train, Bus, ChevronDown } from "lucide-react";
import botanical from "@/assets/botanical.png";
import { clean, coupleNames, formatDate, isTBC, wedding, type WeddingEvent } from "@/config/wedding";
import { Monogram, Reveal, SectionHeading, Text } from "./ui";
import { Countdown } from "./countdown";
import { ShareButton } from "./share";

const fullDate = formatDate(wedding.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const displayedDate = wedding.dateIsPlaceholder ? "Date to be announced" : fullDate;

const NAV = [
  ["celebrations", "Events"], ["travel", "Travel"], ["rsvp", "RSVP"], ["gallery", "Gallery"],
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
  return (
    <header id="top" className="relative min-h-[100svh] flex flex-col items-center justify-end overflow-hidden">
      <picture>
        <source media="(orientation: landscape)" srcSet={wedding.heroImageLandscape} />
        <img src={wedding.heroImage} alt="A lantern-lit aisle leading to a floral mandap at night" className="absolute inset-0 h-full w-full object-cover" width={941} height={1672} fetchPriority="high" />
      </picture>
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="hero-copy relative z-10 text-center px-6 pb-16 pt-24 max-w-2xl animate-in fade-in duration-1000">
        <Monogram light className="h-20 w-20 mx-auto mb-6" />
        <h1 className="text-on-image text-6xl sm:text-7xl md:text-8xl leading-[0.95]">
          {wedding.bride} <span className="italic text-champagne">&amp;</span><br className="sm:hidden" /> {wedding.groom}
        </h1>
        <p className="text-on-image mt-6 text-base md:text-lg font-serif italic text-balance">{wedding.invitation}</p>
        <div className="hairline w-32 mx-auto my-6" />
        <p className="text-on-image text-base md:text-lg font-semibold tracking-[0.2em] uppercase">{displayedDate}</p>
        <p className="text-on-image text-sm mt-1">{clean(wedding.location)}{isTBC(wedding.location) && " · details to follow"}</p>
        {wedding.hashtag && <p className="text-champagne font-serif italic text-lg md:text-xl mt-3 tracking-wide">{wedding.hashtag}</p>}
        {wedding.hashtagTagline && <p className="text-on-image font-serif italic text-base mt-1">{wedding.hashtagTagline}</p>}
        {!wedding.dateIsPlaceholder && <div className="mt-8"><Countdown compact light /></div>}
        <a href="#celebrations" className="mt-10 inline-flex items-center gap-2 h-12 px-8 rounded-full bg-ivory text-forest text-sm tracking-wide [text-shadow:none] hover:opacity-90 transition">
          Explore Our Wedding <ChevronDown className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}

function Botanical({ className = "" }: { className?: string }) {
  return <img src={botanical} alt="" aria-hidden className={`pointer-events-none select-none ${className}`} loading="lazy" width={1024} height={1024} />;
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
                </div>
                <div>
                  <h3 className="text-4xl md:text-[2.75rem] leading-tight">{e.name}</h3>
                  {!isTBC(e.description) && <p className="text-muted-foreground mt-3 font-serif italic text-xl md:text-2xl">{e.description}</p>}
                  <p className="mt-4 flex items-center gap-2 text-sm md:text-base font-medium uppercase tracking-[0.14em] text-forest">
                    <CalendarDays className="h-4 w-4 text-gold" aria-hidden />
                    {formatDate(e.start, { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                  <dl className="mt-6 space-y-4 text-base md:text-lg">
                    <div className="flex gap-3"><dt className="w-24 shrink-0 text-muted-foreground uppercase tracking-widest text-xs pt-1.5">Time</dt><dd>{e.timeIsPlaceholder ? <span className="placeholder-tag">to be confirmed</span> : <>{formatDate(e.start, { hour: "numeric", minute: "2-digit" })}{e.end === e.start ? " onwards" : <> – {formatDate(e.end, { hour: "numeric", minute: "2-digit" })}</>}</>}</dd></div>
                    <div className="flex gap-3"><dt className="w-24 shrink-0 text-muted-foreground uppercase tracking-widest text-xs pt-1.5">Venue</dt><dd><Text value={e.venue} /><br /><span className="text-muted-foreground"><Text value={e.address} /></span></dd></div>
                    {e.dressCode && <div className="flex gap-3"><dt className="w-24 shrink-0 text-muted-foreground uppercase tracking-widest text-xs pt-1.5">Dress code</dt><dd className="font-serif italic">{e.dressCode}</dd></div>}
                  </dl>
                  {!isTBC(e.venue) && !isTBC(e.address) && !e.hideDirections && (
                    <div className="mt-7">
                      <a href={maps(`${clean(e.venue)}, ${clean(e.address)}`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-gold text-base hover:bg-card"><MapPin className="h-4 w-4" /> Open in Google Maps</a>
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Travel() {
  const t = wedding.travel;
  const items = [
    { icon: Plane, label: "By air", v: t.airport },
    { icon: Bus, label: "By road", v: t.road },
  ];
  return (
    <section id="travel" className="py-24 md:py-32 px-6 bg-secondary/50">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="Venue & travel" title="Finding your way to us" />
        <Reveal className="text-center mb-16">
          <h3 className="text-3xl"><Text value={t.venue.name} /></h3>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto"><Text value={t.venue.address} /></p>
          <a href={maps(clean(t.venue.name))} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground text-sm"><MapPin className="h-4 w-4" /> Open in Maps</a>
        </Reveal>
        <Reveal className="mb-12 md:mb-14 max-w-3xl mx-auto text-center md:text-left">
          <Train className="h-5 w-5 text-gold mx-auto md:mx-0" />
          <p className="eyebrow mt-3">By rail from Delhi</p>
          <p className="mt-2 text-sm leading-relaxed">{t.railway.intro}</p>
          <ul className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-left">
            {t.railway.trains.map((tr) => (
              <li key={tr.no} className="border-l border-gold/60 pl-3">
                <span className="font-medium">{tr.no}</span> {tr.name}
                <span className="block text-muted-foreground">{tr.note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">{t.railway.outro}</p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-10 md:gap-8 max-w-3xl mx-auto">
          {items.map(({ icon: I, label, v }) => (
            <Reveal key={label} className="text-center md:text-left">
              <I className="h-5 w-5 text-gold mx-auto md:mx-0" />
              <p className="eyebrow mt-3">{label}</p>
              <p className="mt-2 text-sm leading-relaxed"><Text value={v} /></p>
            </Reveal>
          ))}
        </div>
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
