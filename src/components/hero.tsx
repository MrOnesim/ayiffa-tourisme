"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Calendar, MapPin, Pause, Play, Users } from "lucide-react";
import { beninFilm } from "@/lib/film";
import { AmbientVideo } from "./ambient-video";
import { useCinema } from "./cinema-provider";
import { Magnetic, WordReveal } from "./motion-primitives";
import { TripDiscovery } from "./trip-discovery";
import { Reveal } from "./reveal";
import { site } from "@/lib/content";

const MotionLink = motion.create(Link);

const slides = [
  { image: beninFilm.poster, alt: "Une pirogue à voile sur le lac Nokoué, ouverture du carnet visuel du Bénin", name: "Le Bénin en mouvement", caption: "Ganvié · Ouidah · Un autre regard", href: "/galerie", label: "L’immersion" },
  { image: "/images/ganvie.jpg", alt: "Une pirogue et sa voile colorée sur le lac Nokoué à Ganvié", name: "Ganvié, Bénin", caption: "Une autre vie, au fil de l’eau", href: "/destinations/ganvie", label: "Au fil de l’eau" },
  { image: "/images/grand-popo.jpg", alt: "Le rivage de Grand-Popo, entre Atlantique et cocotiers", name: "Grand-Popo, Bénin", caption: "L’art de ralentir, entre terre et océan", href: "/destinations/grand-popo", label: "L’horizon" },
];

export function Hero() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const { openFilm } = useCinema();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const updateProgress = useCallback((value: number) => hero.current?.style.setProperty("--film-progress", String(value)), []);
  function searchTrips(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const destination = String(formData.get("destination") || "").trim();
    const startDate = String(formData.get("startDate") || "");
    const travellers = String(formData.get("travellers") || "");
    if (destination) params.set("destination", destination);
    if (startDate) params.set("startDate", startDate);
    if (travellers) params.set("voyageurs", travellers);
    const query = params.toString();
    router.push(query ? `/destinations?${query}` : "/destinations");
  }

  return <>
    <section className="hero cinematic-hero signature-hero" ref={hero} data-playing={playing && active === 0} aria-roledescription="carrousel" aria-label="Une invitation au Bénin">
      {slides.map((slide, index) => <motion.div key={slide.image} className={`hero-image shimmer-container ${index === active ? "hero-image-active" : ""}`} aria-hidden={index !== active} inert={index !== active} initial={false} animate={{ opacity: index === active ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.9, ease: "easeOut" }}>
        <Image src={slide.image} alt={slide.alt} fill sizes="100vw" preload={index === 0} loading={index === 0 ? undefined : "lazy"} quality={85}/>
        <span className="shimmer-overlay" aria-hidden="true"/>
        {index === 0 && <AmbientVideo active={active === 0} paused={paused} manuallyStarted={manual} onPlaybackChange={setPlaying} onProgress={updateProgress} onUnavailable={() => setUnavailable(true)}/>}
      </motion.div>)}
      <div className="hero-shade" aria-hidden="true"/>
      <div className="cinematic-grain" aria-hidden="true"/>
      <div className="container hero-inner">
        <div className="hero-copy">
          <div className="hero-topline"><span className="hero-edition"><span className="live-dot"/>UNE AGENCE LOCALE. UN AUTRE REGARD.</span>{active === 0 && !unavailable && <button className="hero-ambient-toggle" onClick={() => { setManual(true); setPaused(playing); }} aria-label={playing ? "Mettre l'ambiance vidéo en pause" : "Lire l'ambiance vidéo"}>{playing ? <Pause size={13}/> : <Play size={13}/>}<span>{playing ? "L'instant en mouvement" : "Animer l'instant"}</span><span className="ambient-duration">00:22</span></button>}</div>
          <Reveal variant="rise" delay={150} className="animate-fade-up">
            <p className="eyebrow hero-eyebrow"><span/>LE BÉNIN, À VOTRE RYTHME.</p>
          </Reveal>
          <Reveal variant="rise" delay={300} className="animate-fade-up">
            <h1><span className="hero-title-line"><WordReveal text="Le Bénin," delay={100}/></span><em className="hero-title-line"><WordReveal text="intensément." delay={250}/></em></h1>
          </Reveal>
          <Reveal variant="rise" delay={450} className="animate-slide-up">
            <p className="hero-description">Rencontres, paysages et cultures vivantes.<br/>Un voyage pensé autour de vous.</p>
          </Reveal>
          <Reveal variant="rise" delay={600} className="animate-slide-up">
            <div className="hero-buttons"><Magnetic><MotionLink href="/destinations" className="button button-terra" whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>Découvrir nos destinations<ArrowUpRight size={18}/></MotionLink></Magnetic><Magnetic><MotionLink href="/contact" className="button button-outline hero-contact-link" whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>Organiser mon voyage<ArrowUpRight size={18}/></MotionLink></Magnetic></div>
          </Reveal>
        </div>
        </div>

        {/* Sticky CTA bar (desktop) */}
        <Reveal variant="rise" delay={800} className="animate-slide-up">
        <div className="hero-sticky-cta">
          <div className="sticky-cta-content">
            <span className="sticky-cta-label">Prêt à découvrir le Bénin ?</span>
            <MotionLink href="/contact" className="button button-cta" whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>Organiser mon voyage<ArrowUpRight size={17}/></MotionLink>
          </div>
          </div>
        </Reveal>

        {/* Travel search bar integrated in hero */}
        <Reveal variant="rise" delay={950} className="animate-slide-up">
        <div className="hero-search">
          <div className="hero-search-card">
            <form className="hero-search-form" onSubmit={searchTrips} aria-label="Rechercher un séjour au Bénin">
              <div className="hero-search-fields">
                <div className="hero-search-field">
                  <label className="hero-search-label" htmlFor="hero-search-destination">Destination</label>
                  <div className="hero-search-input-wrap">
                    <MapPin className="hero-search-icon" size={16} aria-hidden="true"/> <input id="hero-search-destination" name="destination" className="hero-search-input" type="text" placeholder="Par ex. Ouidah, Ganvié, Grand-Popo" defaultValue={site.defaultDestination ?? ""} autoComplete="off"/>
                  </div>
                </div>
                <div className="hero-search-field">
                  <label className="hero-search-label" htmlFor="hero-search-dates">Dates</label>
                  <div className="hero-search-input-wrap">
                    <Calendar className="hero-search-icon" size={16} aria-hidden="true"/> <input id="hero-search-dates" name="startDate" className="hero-search-input" type="date" min={new Date().toISOString().slice(0, 10)} aria-label="Date souhaitée du voyage"/>
                  </div>
                </div>
                <div className="hero-search-field">
                  <label className="hero-search-label" htmlFor="hero-search-travelers">Voyageurs</label>
                  <div className="hero-search-input-wrap">
                    <Users className="hero-search-icon" size={16} aria-hidden="true"/> <input id="hero-search-travelers" name="travellers" className="hero-search-input" type="number" min={1} max={30} step={1} defaultValue={2}/>
                  </div>
                </div>
                <button className="button button-cta hero-search-submit" type="submit">Trouver mon voyage<ArrowUpRight size={16}/></button>
              </div>
            </form>
            <p className="hero-search-note">Sur devis personnalisé · Voyage sur mesure · Accompagnement local</p>
          </div>
        </div>
        </Reveal>
        <Magnetic className="signature-film-magnet"><button className="hero-film-trigger" onClick={() => openFilm()} aria-label="Voir le carnet de voyage"><span className="signature-film-orbit" aria-hidden="true"><svg className="signature-orbit-type" viewBox="0 0 160 160"><defs><path id="signature-film-circle" d="M80,80 m-63,0 a63,63 0 1,1 126,0 a63,63 0 1,1 -126,0"/></defs><text><textPath href="#signature-film-circle" textLength="389">LE BÉNIN EN MOUVEMENT · PRENEZ LE TEMPS · </textPath></text></svg><span className="hero-film-play"><Play size={24} fill="currentColor" strokeWidth={1}/></span></span><span className="signature-film-caption">Voir le carnet de voyage<small>22 SECONDES POUR RESSENTIR LE BÉNIN</small></span></button></Magnetic>
        <div className="hero-bottom"><a className="scroll-cue" href="#decouvrir"><span><ArrowDown size={17}/></span>LE VOYAGE COMMENCE ICI</a><div className="hero-place" aria-live="polite"><Link href={slides[active].href}><MapPin size={15}/><span><strong>{slides[active].name}</strong><small>{slides[active].caption}</small></span><ArrowUpRight size={17}/></Link></div><div className="slide-controls"><button aria-label="Photographie précédente" onClick={() => setActive((active + slides.length - 1) % slides.length)}><ArrowLeft size={17}/></button><span className="slide-count">0{active + 1}<i/>0{slides.length}</span><button aria-label="Photographie suivante" onClick={() => setActive((active + 1) % slides.length)}><ArrowRight size={17}/></button></div></div>
        <div className="hero-horizon-nav" aria-label="Choisir un horizon">{slides.map((slide, index) => <button key={slide.label} className={active === index ? "active" : ""} aria-pressed={active === index} onClick={() => setActive(index)}><span className={`horizon-progress ${index === 0 ? "video-progress" : ""}`}/><span>0{index + 1}</span>{slide.label}</button>)}</div>
    </section>

    {/* Mobile sticky CTA bar */}
    <div className="mobile-sticky-cta">
      <div className="mobile-sticky-cta-content">
        <span className="mobile-sticky-cta-text">Besoin d’aide ? <strong>Voyage sur mesure</strong></span>
        <MotionLink href="/contact" className="button button-cta" whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>Nous contacter</MotionLink>
      </div>
    </div>

    <TripDiscovery/>
  </>;
}
