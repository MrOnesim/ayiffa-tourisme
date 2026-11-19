"use client";

import { useEffect, useRef, useState } from "react";
import { beninFilm } from "@/lib/film";
import { useCinema } from "./cinema-provider";

type AmbientVideoProps = {
  active?: boolean;
  paused?: boolean;
  manuallyStarted?: boolean;
  className?: string;
  onPlaybackChange?: (playing: boolean) => void;
  onProgress?: (progress: number) => void;
  onUnavailable?: () => void;
};

export function AmbientVideo({ active = true, paused = false, manuallyStarted = false, className = "", onPlaybackChange, onProgress, onUnavailable }: AmbientVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const { isOpen } = useCinema();

  useEffect(() => {
    const player = ref.current;
    if (!player) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 701px)");
    let inView = false;
    let disposed = false;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;

    function sync() {
      if (!player || disposed) return;
      const automatic = !reduced.matches && desktop.matches && !connection?.saveData && !["slow-2g", "2g"].includes(connection?.effectiveType || "");
      const shouldPlay = active && !paused && !isOpen && inView && !document.hidden && (manuallyStarted || automatic);
      if (shouldPlay) {
        if (!player.getAttribute("src")) player.setAttribute("src", beninFilm.ambient);
        void player.play().catch(() => { /* The immediate photograph remains visible if autoplay is blocked. */ });
      } else {
        player.pause();
      }
    }

    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting && entry.intersectionRatio > .12; sync(); }, { threshold: [0, .12, .2] });
    observer.observe(player);
    reduced.addEventListener("change", sync);
    desktop.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      disposed = true;
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      desktop.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      player.pause();
    };
  }, [active, paused, manuallyStarted, isOpen]);

  return <video ref={ref} className={`ambient-video ${ready ? "is-ready" : ""} ${className}`} muted loop playsInline preload="none" disablePictureInPicture tabIndex={-1} aria-hidden="true" onPlaying={() => { setReady(true); onPlaybackChange?.(true); }} onPause={() => onPlaybackChange?.(false)} onTimeUpdate={event => { const player = event.currentTarget; onProgress?.(player.duration ? player.currentTime / player.duration : 0); }} onError={() => { setReady(false); onPlaybackChange?.(false); onUnavailable?.(); }}/>
}
