"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Maximize2, Pause, Play, RotateCcw, X } from "lucide-react";
import { beninFilm, formatFilmTime } from "@/lib/film";
import { getLocalizedFilm } from "@/lib/localized-data";
import { useLocale } from "./locale-provider";

const CinemaContext = createContext<{ openFilm: (start?: number) => void; isOpen: boolean } | null>(null);

export function useCinema() {
  const context = useContext(CinemaContext);
  if (!context) throw new Error("Cinema controls require CinemaProvider");
  return context;
}

export function CinemaProvider({ children }: { children: ReactNode }) {
  const { locale, t } = useLocale();
  const ui = t.ui;
  const film = getLocalizedFilm(locale);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState("");

  const openFilm = useCallback((start = 0) => {
    const player = video.current;
    if (!player) return;
    setFailed(false);
    setMessage("");
    if (!player.getAttribute("src")) player.setAttribute("src", beninFilm.hd);
    const seek = () => { player.currentTime = Math.min(start, beninFilm.duration - .1); };
    if (player.readyState >= 1) seek();
    else player.addEventListener("loadedmetadata", seek, { once: true });
    dialog.current?.showModal();
    setIsOpen(true);
    void player.play().catch(() => setMessage(ui.cinemaPlayHint));
  }, []);

  const closeFilm = useCallback(() => {
    video.current?.pause();
    dialog.current?.close();
    setIsOpen(false);
  }, []);

  useEffect(() => {
    dialog.current?.close();
    video.current?.pause();
  }, [pathname]);

  useEffect(() => {
    const player = video.current;
    return () => player?.pause();
  }, []);

  function togglePlayback() {
    const player = video.current;
    if (!player) return;
    if (player.paused) void player.play().catch(() => setMessage(ui.cinemaPlayStartError));
    else player.pause();
  }

  async function fullscreen() {
    const player = video.current;
    if (!player) return;
    try {
      if (player.requestFullscreen) await player.requestFullscreen();
      else setMessage(ui.cinemaFullscreenHint);
    } catch {
      setMessage(ui.cinemaFullscreenUnavailable);
    }
  }

  function seekChapter(start: number) {
    const player = video.current;
    if (!player || player.readyState < 1) return;
    player.currentTime = start;
    void player.play().catch(() => setMessage("Utilisez le bouton lecture pour reprendre."));
  }

  const currentChapter = Math.max(0, film.chapters.findLastIndex(chapter => time >= chapter.start));
  const value = useMemo(() => ({ openFilm, isOpen }), [openFilm, isOpen]);

  return <CinemaContext.Provider value={value}>
    {children}
    <dialog className="cinema-dialog" ref={dialog} aria-labelledby="cinema-title" aria-describedby="cinema-description" onCancel={event => { event.preventDefault(); closeFilm(); }} onClose={() => { video.current?.pause(); setIsOpen(false); }} onClick={event => { if (event.target === event.currentTarget) closeFilm(); }}>
      <div className="cinema-shell">
        <div className="cinema-topbar"><div><span className="cinema-edition">{ui.cinemaEdition}</span><h2 id="cinema-title">{ui.cinemaHeadingLead} <em>{ui.cinemaHeadingEm}</em></h2></div><button className="cinema-close" onClick={closeFilm} aria-label={ui.cinemaClose}><span>{ui.cinemaClose}</span><X size={21}/></button></div>
        <div className="cinema-screen">
          <video ref={video} className="cinema-player" controls playsInline preload="none" poster={isOpen ? beninFilm.poster : undefined} aria-label={ui.cinemaVideoAria} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={event => setTime(event.currentTarget.currentTime)} onError={() => { setFailed(true); setPlaying(false); }}>
            <track kind="captions" src={beninFilm.captions} srcLang="fr" label={ui.cinemaCaptionLabel}/>
            {ui.cinemaVideoUnsupported}
          </video>
          {failed && <div className="cinema-fallback" role="alert"><p>{ui.cinemaFail}</p><button className="button button-lime" onClick={() => { setFailed(false); video.current?.load(); void video.current?.play().catch(() => setFailed(true)); }}>{ui.cinemaRetry}<RotateCcw size={16}/></button><Link href="/galerie" onClick={closeFilm}>{ui.cinemaOpenGallery}<ArrowUpRight size={16}/></Link></div>}
        </div>
        <div className="cinema-transport"><button onClick={togglePlayback} aria-label={playing ? ui.cinemaPauseAria : ui.cinemaPlayAria}>{playing ? <Pause size={17}/> : <Play size={17}/>}<span>{playing ? ui.cinemaPauseLabel : ui.cinemaPlayLabel}</span></button><span className="cinema-time">{formatFilmTime(time)} / 00:22</span><span className="cinema-silent">{ui.cinemaSilent}</span><button className="cinema-fullscreen" onClick={fullscreen} aria-label={ui.cinemaFullscreenAria}><Maximize2 size={17}/><span>{ui.cinemaFullscreen}</span></button></div>
        <div className="cinema-chapters" aria-label={ui.cinemaChaptersAria}>{film.chapters.map((chapter, index) => <button key={chapter.number} onClick={() => seekChapter(chapter.start)} className={currentChapter === index ? "active" : ""} aria-pressed={currentChapter === index}><span>{chapter.number}</span><span>{chapter.title}<small>{chapter.location}</small></span><span>{formatFilmTime(chapter.start)}</span></button>)}</div>
        <div className="cinema-bottom"><p id="cinema-description">{ui.cinemaBottomDescription}<br/><Link href="/credits" onClick={closeFilm}>{ui.cinemaCreditsLink}</Link></p><Link href="/contact" className="text-link" onClick={closeFilm}>{ui.cinemaContinue}<ArrowUpRight size={17}/></Link></div>
        {message && <p className="cinema-message" role="status">{message}</p>}
      </div>
    </dialog>
  </CinemaContext.Provider>;
}
