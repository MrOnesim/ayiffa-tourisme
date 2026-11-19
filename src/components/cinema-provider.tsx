"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Maximize2, Pause, Play, RotateCcw, X } from "lucide-react";
import { beninFilm, formatFilmTime } from "@/lib/film";

const CinemaContext = createContext<{ openFilm: (start?: number) => void; isOpen: boolean } | null>(null);

export function useCinema() {
  const context = useContext(CinemaContext);
  if (!context) throw new Error("Cinema controls require CinemaProvider");
  return context;
}

export function CinemaProvider({ children }: { children: ReactNode }) {
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
    void player.play().catch(() => setMessage("Appuyez sur lecture pour commencer votre découverte."));
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
    if (player.paused) void player.play().catch(() => setMessage("La lecture n’a pas démarré. Essayez les commandes du lecteur."));
    else player.pause();
  }

  async function fullscreen() {
    const player = video.current;
    if (!player) return;
    try {
      if (player.requestFullscreen) await player.requestFullscreen();
      else setMessage("Utilisez l’icône plein écran dans les commandes de la vidéo.");
    } catch {
      setMessage("Le plein écran n’est pas disponible dans ce cadre. Le lecteur reste utilisable ici.");
    }
  }

  function seekChapter(start: number) {
    const player = video.current;
    if (!player || player.readyState < 1) return;
    player.currentTime = start;
    void player.play().catch(() => setMessage("Utilisez le bouton lecture pour reprendre."));
  }

  const currentChapter = Math.max(0, beninFilm.chapters.findLastIndex(chapter => time >= chapter.start));
  const value = useMemo(() => ({ openFilm, isOpen }), [openFilm, isOpen]);

  return <CinemaContext.Provider value={value}>
    {children}
    <dialog className="cinema-dialog" ref={dialog} aria-labelledby="cinema-title" aria-describedby="cinema-description" onCancel={event => { event.preventDefault(); closeFilm(); }} onClose={() => { video.current?.pause(); setIsOpen(false); }} onClick={event => { if (event.target === event.currentTarget) closeFilm(); }}>
      <div className="cinema-shell">
        <div className="cinema-topbar"><div><span className="cinema-edition">AYIFFA / CARNET VISUEL N° 01</span><h2 id="cinema-title">Le Bénin, <em>intensément.</em></h2></div><button className="cinema-close" onClick={closeFilm} aria-label="Fermer le film"><span>Fermer</span><X size={21}/></button></div>
        <div className="cinema-screen">
          <video ref={video} className="cinema-player" controls playsInline preload="none" poster={isOpen ? beninFilm.poster : undefined} aria-label="Carnet visuel du Bénin, 22 secondes, sans dialogue" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={event => setTime(event.currentTarget.currentTime)} onError={() => { setFailed(true); setPlaying(false); }}>
            <track kind="captions" src={beninFilm.captions} srcLang="fr" label="Description des images en français"/>
            Votre navigateur ne prend pas en charge cette vidéo.
          </video>
          {failed && <div className="cinema-fallback" role="alert"><p>Ces images prennent un peu de temps à nous rejoindre.</p><button className="button button-lime" onClick={() => { setFailed(false); video.current?.load(); void video.current?.play().catch(() => setFailed(true)); }}>Réessayer<RotateCcw size={16}/></button><Link href="/galerie" onClick={closeFilm}>Ouvrir le carnet photographique<ArrowUpRight size={16}/></Link></div>}
        </div>
        <div className="cinema-transport"><button onClick={togglePlayback} aria-label={playing ? "Mettre le film en pause" : "Reprendre le film"}>{playing ? <Pause size={17}/> : <Play size={17}/>}<span>{playing ? "Pause" : "Lecture"}</span></button><span className="cinema-time">{formatFilmTime(time)} / 00:22</span><span className="cinema-silent">Un instant à contempler · film muet</span><button className="cinema-fullscreen" onClick={fullscreen} aria-label="Afficher le film en plein écran"><Maximize2 size={17}/><span>Plein écran</span></button></div>
        <div className="cinema-chapters" aria-label="Chapitres du carnet visuel">{beninFilm.chapters.map((chapter, index) => <button key={chapter.number} onClick={() => seekChapter(chapter.start)} className={currentChapter === index ? "active" : ""} aria-pressed={currentChapter === index}><span>{chapter.number}</span><span>{chapter.title}<small>{chapter.location}</small></span><span>{formatFilmTime(chapter.start)}</span></button>)}</div>
        <div className="cinema-bottom"><p id="cinema-description">Photographies animées de Ganvié et séquence aérienne de Ouidah.<br/><Link href="/credits" onClick={closeFilm}>Auteurs & crédits du film</Link></p><Link href="/contact" className="text-link" onClick={closeFilm}>Et si vous écriviez la suite ?<ArrowUpRight size={17}/></Link></div>
        {message && <p className="cinema-message" role="status">{message}</p>}
      </div>
    </dialog>
  </CinemaContext.Provider>;
}
