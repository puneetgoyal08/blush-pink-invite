import { useEffect, useState, type ReactNode } from "react";
import { MapPin, Plane, Train, Bus, ChevronDown } from "lucide-react";
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

function FamilyMember({ name, relation, parents }: { name: string; relation: string; parents: string }) {
  return (
    <div>
      <p className="font-serif text-5xl md:text-6xl">{name}</p>
      <p className="eyebrow mt-4">{relation}</p>
      <p className="font-serif text-xl md:text-2xl mt-2 text-balance">{parents}</p>
    </div>
  );
}

// Parents' names come straight after the hero, as on a traditional printed card.
export function Families() {
  return (
    <section aria-labelledby="families-heading" className="py-20 md:py-28 px-6 text-center">
      <Reveal className="max-w-4xl mx-auto">
        <h2 id="families-heading" className="eyebrow text-balance">With the blessings of our families</h2>
        <div className="hairline w-24 mx-auto mt-6 mb-12" />
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-12">
          <FamilyMember name={wedding.bride} relation="Daughter of" parents={wedding.brideParents} />
          <span aria-hidden className="font-serif italic text-5xl text-gold">&amp;</span>
          <FamilyMember name={wedding.groom} relation="Son of" parents={wedding.groomParents} />
        </div>
      </Reveal>
    </section>
  );
}

function Botanical({ className = "" }: { className?: string }) {
  return <img src={botanical} alt="" aria-hidden className={`pointer-events-none select-none ${className}`} loading="lazy" width={1024} height={1024} />;
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3">
      <dt className="eyebrow tracking-[0.2em]">{label}</dt>
      <dd className="font-serif text-xl md:text-[1.35rem] leading-snug">{children}</dd>
    </div>
  );
}

const maps =(q: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

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
                  <h3 className="text-4xl md:text-[2.75rem] leading-[1.1]">{e.name}</h3>
                  {!isTBC(e.description) && <p className="text-muted-foreground mt-1 font-serif italic text-xl md:text-2xl">{e.description}</p>}
                  <div className="mt-5 h-px w-12 bg-gold/60" />
                  <dl className="mt-5 space-y-3">
                    <Detail label="Date"><span className="font-medium">{formatDate(e.start, { weekday: "long", day: "numeric", month: "long" })}</span></Detail>
                    <Detail label="Time">{e.timeIsPlaceholder ? <span className="text-muted-foreground">To be confirmed</span> : <>{formatDate(e.start, { hour: "numeric", minute: "2-digit" })}{e.end === e.start ? " onwards" : <> – {formatDate(e.end, { hour: "numeric", minute: "2-digit" })}</>}</>}</Detail>
                    <Detail label="Venue"><Text value={e.venue} />{e.address && <><br /><span className="text-muted-foreground"><Text value={e.address} /></span></>}</Detail>
                    {e.dressCode && <Detail label="Dress code"><span className="italic">{e.dressCode}</span></Detail>}
                  </dl>
                  {!isTBC(e.venue) && !isTBC(e.address) && !e.hideDirections && (
                    <div className="mt-7">
                      <a href={e.mapUrl ?? maps(`${clean(e.venue)}, ${clean(e.address)}`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-gold text-base hover:bg-card"><MapPin className="h-4 w-4" /> Open in Google Maps</a>
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
  return (
    <section id="travel" className="py-24 md:py-32 px-6 bg-secondary/50">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="Venue & travel" title="Finding your way to us" />
        <Reveal className="text-center mb-16">
          <h3 className="text-3xl"><Text value={t.venue.name} /></h3>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto"><Text value={t.venue.address} /></p>
          <a href={t.venue.mapUrl ?? maps(clean(t.venue.name))} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground text-sm"><MapPin className="h-4 w-4" /> Open in Maps</a>
        </Reveal>
        <Reveal className="mb-8 max-w-3xl mx-auto text-center md:text-left">
          <Plane className="h-5 w-5 text-gold mx-auto md:mx-0" />
          <p className="eyebrow mt-3">By air</p>
          <p className="mt-2 text-sm leading-relaxed"><Text value={t.airport} /></p>
        </Reveal>
        <Reveal className="mb-8 max-w-3xl mx-auto text-center md:text-left">
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
        <Reveal className="max-w-3xl mx-auto text-center md:text-left">
          <Bus className="h-5 w-5 text-gold mx-auto md:mx-0" />
          <p className="eyebrow mt-3">By road</p>
          <p className="mt-2 text-sm leading-relaxed"><Text value={t.road} /></p>
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
