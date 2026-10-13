import { useEffect, useState } from "react";
import { wedding } from "@/config/wedding";

function diff(target: number, now: number) {
  const d = Math.max(0, target - now);
  return {
    past: target <= now,
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

export function useCountdown() {
  const target = new Date(wedding.date).getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now === null ? null : diff(target, now);
}

export function Countdown({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  const c = useCountdown();
  const tone = light ? "text-on-image" : "text-forest";
  if (c?.past) {
    return <p className={`font-serif italic text-2xl md:text-3xl ${tone}`}>We're married — thank you for celebrating with us.</p>;
  }
  const units: [string, number | undefined][] = [
    ["Days", c?.days], ["Hours", c?.hours], ["Minutes", c?.minutes], ["Seconds", c?.seconds],
  ];
  return (
    <div className={`flex items-start justify-center ${compact ? "gap-5" : "gap-6 md:gap-14"}`} aria-live="off">
      {units.map(([label, v], i) => (
        <div key={label} className="flex items-start">
          <div className="text-center">
            <div className={`font-serif tabular-nums ${tone} ${compact ? "text-3xl" : "text-5xl md:text-7xl"}`}>
              {v === undefined ? "—" : String(v).padStart(2, "0")}
            </div>
            <div className={`mt-1 uppercase tracking-[0.25em] ${compact ? "text-[0.6rem]" : "text-[0.65rem] md:text-xs"} ${light ? "text-on-image opacity-80" : "text-muted-foreground"}`}>{label}</div>
          </div>
          {i < 3 && <span className={`text-gold ${compact ? "ml-5 text-xl" : "ml-6 md:ml-14 text-3xl"} font-serif`}>·</span>}
        </div>
      ))}
    </div>
  );
}
