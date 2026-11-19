"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { Magnetic, WordReveal } from "./motion-primitives";
import { Reveal } from "./reveal";

const MotionLink = motion.create(Link);

const slides = [
  { image: "/images/deux voi vu du ciel.jpeg", alt: "Vue aérienne du littoral de Grand-Popo avec la route côtière, les palmiers et l’océan Atlantique", name: "Grand-Popo, Bénin", caption: "L’océan, la route et le temps", href: "/destinations/grand-popo", label: "L’horizon" },
];

export function Hero() {
  const hero = useRef<HTMLElement>(null);
  const heroVideo = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (reduceMotion) heroVideo.current?.pause();
  }, [reduceMotion]);

  function toggleVideo() {
    const video = heroVideo.current;
    if (!video) return;
    if (playing) video.pause();
    else void video.play().catch(() => setPlaying(false));
  }

  return <>
    <section className="hero cinematic-hero signature-hero" ref={hero} aria-label="Une invitation au Bénin">
      {slides.map((slide, index) => <motion.div key={slide.image} className={`hero-image shimmer-container ${index === 0 ? "hero-image-active" : ""}`} aria-hidden={index !== 0} inert={index !== 0} initial={false} animate={{ opacity: index === 0 ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.9, ease: "easeOut" }}>
        <Image src={slide.image} alt={slide.alt} fill sizes="100vw" preload={index === 0} loading={index === 0 ? undefined : "lazy"} quality={85}/>
        <span className="shimmer-overlay" aria-hidden="true"/>
        {index === 0 && <video ref={heroVideo} className={`ambient-video ${playing ? "is-ready" : ""}`} src="/videos/vue-aérienne-benin-hero.mp4" poster={slide.image} muted loop playsInline autoPlay preload="metadata" disablePictureInPicture tabIndex={-1} aria-hidden="true" onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setUnavailable(true)}/>}
      </motion.div>)}
      <div className="hero-shade" aria-hidden="true"/>
      <div className="cinematic-grain" aria-hidden="true"/>
      {!unavailable && <button className="hero-video-control" type="button" onClick={toggleVideo} aria-label={playing ? "Mettre la vidéo du héros en pause" : "Lire la vidéo du héros"}>{playing ? <Pause size={16}/> : <Play size={16}/>}</button>}
      <div className="container hero-inner">
        <div className="hero-copy">
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
    </section>

  </>;
}
