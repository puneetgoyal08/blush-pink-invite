import { useState } from "react";
import { Share2, Copy, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { coupleNames, formatDate, wedding } from "@/config/wedding";

function shareText() {
  const date = formatDate(wedding.date, { day: "numeric", month: "long", year: "numeric" });
  const invitationDate = wedding.dateIsPlaceholder ? "the date to be announced" : date;
  return `You're invited to celebrate the wedding of ${coupleNames} — ${invitationDate}. View the invitation & RSVP:`;
}

export function ShareButton({ variant = "solid", label = "Share Invitation" }: { variant?: "solid" | "outline" | "float"; label?: string }) {
  const [open, setOpen] = useState(false);

  async function onClick() {
    const url = window.location.origin;
    if (navigator.share) {
      try { await navigator.share({ title: `${coupleNames} — Wedding Invitation`, text: shareText(), url }); return; }
      catch (e) { if ((e as Error).name === "AbortError") return; }
    }
    setOpen(true);
  }

  const cls =
    variant === "float"
      ? "fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition"
      : variant === "outline"
        ? "inline-flex items-center gap-2 h-12 px-7 rounded-full border border-gold text-forest hover:bg-muted transition text-sm tracking-wide"
        : "inline-flex items-center gap-2 h-12 px-7 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition text-sm tracking-wide";

  return (
    <>
      <button type="button" onClick={onClick} className={cls} aria-label={label}>
        <Share2 className="h-4 w-4" />
        {variant !== "float" && label}
      </button>
      {open && <ShareSheet onClose={() => setOpen(false)} />}
    </>
  );
}

function ShareSheet({ onClose }: { onClose: () => void }) {
  const url = window.location.origin;
  const wa = `https://wa.me/?text=${encodeURIComponent(shareText() + " " + url)}`;
  async function copy() {
    try { await navigator.clipboard.writeText(url); toast.success("Link copied — paste it anywhere to share."); onClose(); }
    catch { toast.error("Couldn't copy. Please copy the address from your browser."); }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-forest/40 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label="Share invitation">
      <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl">Share the invitation</h3>
          <button onClick={onClose} aria-label="Close" className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 h-12 px-4 rounded-lg bg-primary text-primary-foreground mb-3">
          <MessageCircle className="h-4 w-4" /> Share on WhatsApp
        </a>
        <button onClick={copy} className="w-full flex items-center gap-3 h-12 px-4 rounded-lg border border-border hover:bg-muted">
          <Copy className="h-4 w-4" /> Copy link
        </button>
      </div>
    </div>
  );
}
