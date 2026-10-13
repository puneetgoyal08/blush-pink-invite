import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, X, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { submitRsvp, submitWish } from "@/lib/wedding.functions";
import { wedding } from "@/config/wedding";
import { Reveal, SectionHeading, Text } from "./ui";

const field = "w-full h-12 px-4 rounded-md bg-card border border-input focus:outline-none focus:ring-2 focus:ring-ring text-base";
const label = "block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2";

export function Rsvp() {
  const send = useServerFn(submitRsvp);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<"name"|"contact"|"attending"|"events", string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [result, setResult] = useState<{ attending: boolean; updated: boolean } | null>(null);
  const [serverError, setServerError] = useState("");

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(ev.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const contact = String(fd.get("contact") || "").trim();
    const guests = Number(fd.get("guests") || 1);
    const e: Partial<Record<"name"|"contact"|"attending"|"events", string>> = {};
    if (name.length < 2) e.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(contact) && !/^\+?[\d\s-]{8,}$/.test(contact)) e.contact = "Enter a valid phone number or email.";
    if (attending === null) e.attending = "Please let us know if you can make it.";
    if (attending && events.length === 0) e.events = "Choose at least one celebration.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("sending"); setServerError("");
    try {
      const r = await send({ data: {
        name, contact, attending: !!attending, guests, events,
        dietary: String(fd.get("dietary") || ""), message: String(fd.get("message") || ""), website: String(fd.get("website") || ""),
      } });
      if (r.ok) { setResult({ attending: !!attending, updated: r.updated }); setStatus("done"); }
      else { setServerError(r.error); setStatus("error"); }
    } catch {
      setServerError("Something went wrong. Please check your details and try again."); setStatus("error");
    }
  }

  return (
    <section id="rsvp" className="py-24 md:py-32 px-6">
      <div className="max-w-xl mx-auto">
        <SectionHeading eyebrow="Kindly reply" title="Will you join us?" />
        <Reveal className="text-center -mt-6 mb-12 text-muted-foreground text-sm">Please respond by <Text value={wedding.rsvpDeadline} /></Reveal>
        {status === "done" && result ? (
          <div className="text-center py-12 border border-gold/50 rounded-lg bg-card animate-in fade-in zoom-in-95">
            <div className="h-14 w-14 rounded-full border border-gold mx-auto flex items-center justify-center"><Check className="h-6 w-6 text-gold" /></div>
            <h3 className="text-4xl mt-6">{result.attending ? "We can't wait to see you" : "You'll be missed"}</h3>
            <p className="text-muted-foreground mt-3 px-6">{result.updated ? "Your RSVP has been updated." : "Thank you — your RSVP has been received."}</p>
            <button onClick={() => { setStatus("idle"); setResult(null); }} className="mt-6 text-sm underline text-muted-foreground">Edit response</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-6">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div>
              <label htmlFor="r-name" className={label}>Your name</label>
              <input id="r-name" name="name" maxLength={100} className={field} autoComplete="name" aria-invalid={!!errors.name} />
              {errors.name && <p className="text-destructive text-sm mt-1.5">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="r-contact" className={label}>Phone or email</label>
              <input id="r-contact" name="contact" maxLength={255} className={field} inputMode="email" aria-invalid={!!errors.contact} />
              {errors.contact && <p className="text-destructive text-sm mt-1.5">{errors.contact}</p>}
            </div>
            <fieldset>
              <legend className={label}>Attendance</legend>
              <div className="grid grid-cols-2 gap-3">
                {[[true, "Accepts with pleasure"], [false, "Regretfully declines"]].map(([v, t]) => (
                  <button key={String(v)} type="button" onClick={() => setAttending(v as boolean)} aria-pressed={attending === v}
                    className={`min-h-12 px-3 py-3 rounded-md border text-sm font-serif text-lg transition ${attending === v ? "bg-primary text-primary-foreground border-primary" : "bg-card border-input hover:border-gold"}`}>{t as string}</button>
                ))}
              </div>
              {errors.attending && <p className="text-destructive text-sm mt-1.5">{errors.attending}</p>}
            </fieldset>
            {attending && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label htmlFor="r-guests" className={label}>Number of guests (including you)</label>
                  <select id="r-guests" name="guests" defaultValue="1" className={field}>
                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <fieldset>
                  <legend className={label}>Celebrations you'll attend</legend>
                  <div className="flex flex-wrap gap-2">
                    {wedding.events.map((e) => {
                      const on = events.includes(e.id);
                      return (
                        <button type="button" key={e.id} aria-pressed={on} onClick={() => setEvents(on ? events.filter((x) => x !== e.id) : [...events, e.id])}
                          className={`h-11 px-4 rounded-full border text-sm transition ${on ? "bg-sage/40 border-sage" : "bg-card border-input"}`}>{on && "✓ "}{e.name}</button>
                      );
                    })}
                  </div>
                  {errors.events && <p className="text-destructive text-sm mt-1.5">{errors.events}</p>}
                </fieldset>
                <div>
                  <label htmlFor="r-diet" className={label}>Dietary preferences</label>
                  <input id="r-diet" name="dietary" maxLength={200} placeholder="Vegetarian, Jain, allergies…" className={field} />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="r-msg" className={label}>A note for the couple (optional)</label>
              <textarea id="r-msg" name="message" maxLength={600} rows={3} className={`${field} h-auto py-3`} />
            </div>
            {serverError && <p role="alert" className="text-destructive text-sm">{serverError}</p>}
            <button type="submit" disabled={status === "sending"} className="w-full h-13 py-4 rounded-full bg-primary text-primary-foreground tracking-wide disabled:opacity-60 inline-flex items-center justify-center gap-2">
              {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />} {status === "sending" ? "Sending…" : "Send RSVP"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export function Gallery() {
  const imgs = wedding.gallery;
  const [idx, setIdx] = useState<number | null>(null);
  const go = useCallback((d: number) => setIdx((i) => (i === null ? i : (i + d + imgs.length) % imgs.length)), [imgs.length]);
  useEffect(() => {
    if (idx === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setIdx(null); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [idx, go]);
  const [tx, setTx] = useState(0);
  return (
    <section id="gallery" className="py-24 md:py-32 px-4 bg-muted/60">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Moments" title="A few frames of us" />
        <div className="columns-2 md:columns-3 gap-3 md:gap-5 [&>*]:mb-3 md:[&>*]:mb-5">
          {imgs.map((im, i) => (
            <Reveal key={i} delay={(i % 3) * 100}>
              <button onClick={() => setIdx(i)} className="block w-full overflow-hidden rounded-sm group" aria-label={`Open photo: ${im.alt}`}>
                <img src={im.src} alt={im.alt} loading="lazy" className="w-full h-auto transition duration-700 group-hover:scale-105" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      {idx !== null && (
        <div className="fixed inset-0 z-50 bg-forest/95 flex items-center justify-center animate-in fade-in" role="dialog" aria-modal="true" aria-label="Photo viewer"
          onTouchStart={(e) => setTx(e.touches[0]?.clientX ?? 0)} onTouchEnd={(e) => { const d = (e.changedTouches[0]?.clientX ?? tx) - tx; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); }}>
          <button onClick={() => setIdx(null)} className="absolute top-4 right-4 h-12 w-12 text-on-image flex items-center justify-center" aria-label="Close"><X /></button>
          <button onClick={() => go(-1)} className="absolute left-2 h-12 w-12 text-on-image hidden sm:flex items-center justify-center" aria-label="Previous"><ChevronLeft /></button>
          <img key={idx} src={imgs[idx]?.src} alt={imgs[idx]?.alt ?? ""} className="max-h-[85vh] max-w-[92vw] object-contain animate-in fade-in zoom-in-95 duration-300" />
          <button onClick={() => go(1)} className="absolute right-2 h-12 w-12 text-on-image hidden sm:flex items-center justify-center" aria-label="Next"><ChevronRight /></button>
          <p className="absolute bottom-5 text-on-image/80 text-xs tracking-[0.2em]">{idx + 1} / {imgs.length}</p>
        </div>
      )}
    </section>
  );
}

export function Wishes() {
  const send = useServerFn(submitWish);
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["wishes"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_approved_wishes");
      if (error) throw error;
      return data ?? [];
    },
  });
  const [msg, setMsg] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (state === "sending") return;
    const fd = new FormData(ev.currentTarget);
    const name = String(fd.get("name") || "").trim();
    if (name.length < 2) return setErr("Please add your name.");
    if (msg.trim().length < 3) return setErr("Please write a short message.");
    setErr(""); setState("sending");
    try {
      const r = await send({ data: { name, message: msg, website: String(fd.get("website") || "") } });
      if (r.ok) { setState("done"); setMsg(""); qc.invalidateQueries({ queryKey: ["wishes"] }); }
      else { setErr(r.error); setState("idle"); }
    } catch { setErr("Something went wrong. Please try again."); setState("idle"); }
  }

  return (
    <section id="wishes" className="py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeading eyebrow="Guest book" title="Send your blessings" />
        {state === "done" ? (
          <div className="text-center border border-gold/50 rounded-lg bg-card py-10 px-6 animate-in fade-in">
            <p className="font-serif text-3xl">Thank you for your love</p>
            <p className="text-muted-foreground mt-2 text-sm">Your wish will appear once the couple has seen it.</p>
            <button onClick={() => setState("idle")} className="mt-5 text-sm underline text-muted-foreground">Write another</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-4 max-w-xl mx-auto">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div><label htmlFor="w-name" className={label}>Your name</label><input id="w-name" name="name" maxLength={80} className={field} /></div>
            <div>
              <label htmlFor="w-msg" className={label}>Your message</label>
              <textarea id="w-msg" value={msg} onChange={(e) => setMsg(e.target.value.slice(0, 300))} rows={3} className={`${field} h-auto py-3`} />
              <p className="text-right text-xs text-muted-foreground mt-1">{msg.length}/300</p>
            </div>
            {err && <p role="alert" className="text-destructive text-sm">{err}</p>}
            <button disabled={state === "sending"} className="w-full py-4 rounded-full border border-gold hover:bg-muted transition inline-flex items-center justify-center gap-2 disabled:opacity-60">
              {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />} Send wish
            </button>
          </form>
        )}
        <div className="mt-16 grid sm:grid-cols-2 gap-5">
          {isLoading && <p className="text-center text-muted-foreground text-sm sm:col-span-2">Loading wishes…</p>}
          {isError && <p className="text-center text-muted-foreground text-sm sm:col-span-2">Wishes couldn't load right now.</p>}
          {data && data.length === 0 && <p className="text-center text-muted-foreground font-serif italic text-lg sm:col-span-2">Be the first to leave a blessing.</p>}
          {data?.map((w) => (
            <Reveal key={w.id}>
              <blockquote className="border-l-2 border-gold pl-5 py-1">
                <p className="font-serif text-xl leading-snug">“{w.message}”</p>
                <footer className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">— {w.name}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
