import { useCallback, useEffect, useRef, useState } from "react";
import { coupleNames } from "@/config/wedding";
import { Monogram } from "./ui";
import { ArrowRight } from "lucide-react";
import doorsLandscape from "@/assets/opener-landscape.jpg";
import doorsPortrait from "@/assets/opener-portrait.jpg";

export function InvitationOpener({ onOpened }: { onOpened: () => void }) {
  const [isOpening, setIsOpening] = useState(false);
  const timer = useRef<number | null>(null);

  const startOpening = useCallback((animate = true) => {
    if (isOpening) return;

    if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onOpened();
      return;
    }

    setIsOpening(true);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      onOpened();
    }, 1250);
  }, [isOpening, onOpened]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") startOpening(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [startOpening]);

  return (
    <div
      className={`invitation-opening${isOpening ? " is-opening" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="invitation-opening-title"
      aria-describedby="invitation-opening-description"
    >
      {(["left", "right"] as const).map((side) => (
        <div key={side} className={`invitation-opening__panel invitation-opening__panel--${side}`} aria-hidden="true">
          <picture>
            <source media="(orientation: landscape)" srcSet={doorsLandscape} />
            <img src={doorsPortrait} alt="" fetchPriority="high" />
          </picture>
        </div>
      ))}
      <div className="invitation-opening__content">
        <p id="invitation-opening-description" className="invitation-opening__description">
          You are warmly invited to celebrate
        </p>
        <Monogram light className="invitation-opening__monogram" />
        <h1 id="invitation-opening-title" className="invitation-opening__title" aria-label={coupleNames}>
          {coupleNames.split(" & ").map((name, index) => (
            <span key={name}>
              {index > 0 && <i>&amp;</i>}
              {name}
            </span>
          ))}
        </h1>

        <button
          type="button"
          className="invitation-opening__open"
          onClick={() => startOpening()}
          disabled={isOpening}
          aria-label={`Open ${coupleNames}'s wedding invitation`}
          autoFocus
        >
          Open the invitation <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="invitation-opening__ornament" aria-hidden="true">
          ❦
        </span>
      </div>
    </div>
  );
}
