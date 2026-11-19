"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { ArrowUpRight, Film, Pause, Play } from "lucide-react";
import { beninFilm } from "@/lib/film";
import { useCinema } from "./cinema-provider";
import { AmbientVideo } from "./ambient-video";
import { Magnetic } from "./motion-primitives";
import { Reveal } from "./reveal";

export function FilmSection() {
  const { openFilm } = useCinema();
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const updateProgress = useCallback((value: number) => progress.current?.style.setProperty("--film-progress", String(value)), []);

  return <section className="film-section" id="le-film">
    <div className="container">
      <Reveal className="film-heading"><div><p className="eyebrow">LE BÉNIN EN MOUVEMENT</p><h2>Ne l’imaginez plus.<br/><em>Ressentez-le.</em></h2></div><p>Il suffit parfois d’un instant<br/>pour avoir envie de partir.<br/><span>Un carnet visuel. 22 secondes d’évasion.</span></p></Reveal>
      <Reveal className="film-frame-reveal" variant="image">
        <div className="film-window" ref={progress}>
          <Image src={beninFilm.poster} alt="Une pirogue à voile sur le lac Nokoué, première image du carnet visuel" fill sizes="(max-width: 700px) 100vw, 90vw"/>
          <AmbientVideo paused={paused} manuallyStarted={manual} onPlaybackChange={setPlaying} onProgress={updateProgress} onUnavailable={() => setUnavailable(true)}/>
          <div className="film-window-shade"/>
          <div className="film-window-top"><span><Film size={13}/>AYIFFA, INSTANT 01</span><span>GANVIÉ / OUIDAH</span></div>
          <div className="film-center"><Magnetic><button className="cinema-play-circle" onClick={() => openFilm()} aria-label="Regarder le carnet visuel du Bénin"><span className="play-orbit"/><Play size={29} fill="currentColor" strokeWidth={1}/></button></Magnetic><span>ENTREZ DANS LE VOYAGE</span></div>
          <div className="film-window-bottom"><div><span className="mini-label">UN PAYS. MILLE ÉMOTIONS.</span><p>Le Bénin, <em>intensément.</em></p></div><div className="film-window-actions"><span className="film-duration">00:22</span>{!unavailable && <button onClick={() => { setManual(true); setPaused(playing); }} aria-label={playing ? "Mettre l’aperçu du film en pause" : "Lire l’aperçu du film"}>{playing ? <Pause size={16}/> : <Play size={16}/>}</button>}</div></div>
          <div className="film-window-progress"><span/></div>
        </div>
      </Reveal>
      <div className="film-section-caption"><p>Photographies animées & vues aériennes réelles du Bénin.<br className="film-mobile-break"/> Pas de voix off. Juste l’envie d’y être.</p><Link href="/credits">Les regards derrière ces images<ArrowUpRight size={15}/></Link></div>
      <div className="film-chapter-links">{beninFilm.chapters.map(chapter => <button key={chapter.number} onClick={() => openFilm(chapter.start)}><span>{chapter.number}</span><strong>{chapter.title}</strong><small>{chapter.location}</small><ArrowUpRight size={19}/></button>)}</div>
    </div>
  </section>;
}
