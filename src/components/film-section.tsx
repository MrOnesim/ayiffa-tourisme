"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { ArrowUpRight, Film, Pause, Play } from "lucide-react";
import { beninFilm } from "@/lib/film";
import { getLocalizedFilm } from "@/lib/localized-data";
import { useCinema } from "./cinema-provider";
import { AmbientVideo } from "./ambient-video";
import { Magnetic } from "./motion-primitives";
import { Reveal } from "./reveal";
import { useLocale } from "./locale-provider";
import { Lines } from "./lines";

export function FilmSection() {
  const { locale, t } = useLocale();
  const ui = t.ui;
  const film = getLocalizedFilm(locale);
  const filmLines = ui.filmHeading.split("\n");
  const { openFilm } = useCinema();
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const updateProgress = useCallback((value: number) => progress.current?.style.setProperty("--film-progress", String(value)), []);

  return <section className="film-section" id="le-film">
    <div className="container">
      <Reveal className="film-heading"><div><p className="eyebrow">{ui.filmEyebrow}</p><h2>{filmLines[0]}<br/><em>{filmLines[1]}</em></h2></div><p><Lines text={ui.filmAside}/></p></Reveal>
      <Reveal className="film-frame-reveal" variant="image">
        <div className="film-window" ref={progress}>
          <Image src={beninFilm.poster} alt={ui.filmPosterAlt} fill sizes="(max-width: 700px) 100vw, 90vw"/>
          <AmbientVideo paused={paused} manuallyStarted={manual} onPlaybackChange={setPlaying} onProgress={updateProgress} onUnavailable={() => setUnavailable(true)}/>
          <div className="film-window-shade"/>
          <div className="film-window-top"><span><Film size={13}/>{ui.filmWindowLabel}</span><span>GANVIÉ / OUIDAH</span></div>
          <div className="film-center"><Magnetic><button className="cinema-play-circle" onClick={() => openFilm()} aria-label={ui.filmPlay}><span className="play-orbit"/><Play size={29} fill="currentColor" strokeWidth={1}/></button></Magnetic><span>{ui.filmLabel}</span></div>
          <div className="film-window-bottom"><div><span className="mini-label">{ui.filmTitle}</span><p>{ui.heroTitleA} <em>{ui.heroTitleB}</em></p></div><div className="film-window-actions"><span className="film-duration">00:22</span>{!unavailable && <button onClick={() => { setManual(true); setPaused(playing); }} aria-label={playing ? ui.filmPreviewPause : ui.filmPreviewPlay}>{playing ? <Pause size={16}/> : <Play size={16}/>}</button>}</div></div>
          <div className="film-window-progress"><span/></div>
        </div>
      </Reveal>
      <div className="film-section-caption"><p><Lines text={ui.filmCaption}/></p><Link href="/credits">{ui.filmSource}<ArrowUpRight size={15}/></Link></div>
      <div className="film-chapter-links">{film.chapters.map(chapter => <button key={chapter.number} onClick={() => openFilm(chapter.start)}><span>{chapter.number}</span><strong>{chapter.title}</strong><small>{chapter.location}</small><ArrowUpRight size={19}/></button>)}</div>
    </div>
  </section>;
}
