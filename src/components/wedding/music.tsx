import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { wedding } from "@/config/wedding";

let audio: HTMLAudioElement | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function getAudio() {
  if (!audio) {
    audio = new Audio(wedding.musicUrl);
    audio.loop = true;
    audio.addEventListener("play", notify);
    audio.addEventListener("pause", notify);
  }
  return audio;
}

// Browsers only allow sound after a tap, so call this from a click or key handler.
export function startMusic() {
  if (!wedding.musicUrl) return;
  void getAudio().play().catch(() => {});
}

function toggleMusic() {
  const a = getAudio();
  if (a.paused) void a.play().catch(() => {});
  else a.pause();
}

function useMusicPlaying() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => !!audio && !audio.paused,
    () => false,
  );
}

export function MusicToggle() {
  const playing = useMusicPlaying();
  if (!wedding.musicUrl) return null;
  return (
    <button
      type="button"
      onClick={toggleMusic}
      className="fixed bottom-5 left-5 z-40 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition"
      aria-label={playing ? "Mute music" : "Play music"}
    >
      {playing ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </button>
  );
}
