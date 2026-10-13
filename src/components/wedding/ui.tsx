import { useEffect, useRef, useState, type ReactNode } from "react";
import { clean, isTBC, wedding } from "@/config/wedding";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-shown={shown} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Text({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span className={className}>
      {clean(value)}
      {isTBC(value) && <span className="placeholder-tag ml-2 align-middle whitespace-nowrap">to be confirmed</span>}
    </span>
  );
}

export function Monogram({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label={`${wedding.bride[0]} and ${wedding.groom[0]} monogram`} role="img">
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-gold" />
      <circle cx="60" cy="60" r="51" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 3" className="text-gold" />
      <text x="38" y="72" fontFamily="Cormorant Garamond, serif" fontSize="38" fontStyle="italic" fill="currentColor" className={light ? "text-on-image" : "text-forest"}>N</text>
      <text x="56" y="66" fontFamily="Cormorant Garamond, serif" fontSize="16" fill="currentColor" className="text-gold">&amp;</text>
      <text x="66" y="80" fontFamily="Cormorant Garamond, serif" fontSize="38" fontStyle="italic" fill="currentColor" className={light ? "text-on-image" : "text-forest"}>P</text>
    </svg>
  );
}

export function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id?: string }) {
  return (
    <Reveal className="text-center mb-12 md:mb-16">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 id={id} className="text-4xl md:text-6xl leading-tight text-balance">{title}</h2>
      <div className="hairline w-24 mx-auto mt-6" />
    </Reveal>
  );
}
