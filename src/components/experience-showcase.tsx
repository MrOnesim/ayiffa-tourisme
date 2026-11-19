"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Pause, Play } from "lucide-react";
import { journeyChapters } from "@/lib/journey";
import { Reveal } from "./reveal";
import { useCinema } from "./cinema-provider";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function ExperienceShowcase() {
  const { isOpen } = useCinema();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const markers = useRef<(HTMLDivElement | null)[]>([]);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const navigation = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [photosPaused, setPhotosPaused] = useState(false);
  const [photoTick, setPhotoTick] = useState(0);

  useEffect(() => {
    const section = root.current;
    const strip = track.current;
    if (!section || !strip) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 900px)");
    const stack = window.matchMedia("(min-width: 901px) and (min-height: 700px)");
    let frame = 0;
    let visible = false;
    let current = 0;
    let headerHeight = 92;

    function update() {
      frame = 0;
      if (!section || !strip) return;
      const canStack = stack.matches && !reduced.matches;
      section.setAttribute("data-layout", mobile.matches ? "swipe" : canStack ? "stack" : "static");
      if (!visible) return;
      let next = 0;
      if (mobile.matches) {
        const first = panels.current[0];
        const second = panels.current[1];
        if (first && second) next = Math.round(strip.scrollLeft / Math.max(1, second.offsetLeft - first.offsetLeft));
      } else {
        const starts = markers.current.map(marker => marker?.getBoundingClientRect().top ?? Infinity);
        const threshold = headerHeight + 135;
        starts.forEach((top, index) => { if (top <= threshold) next = index; });
        panels.current.forEach((panel, index) => {
          if (!panel) return;
          const arrival = index < starts.length - 1 ? clamp((window.innerHeight - starts[index + 1]) / Math.max(1, window.innerHeight - headerHeight - 100)) : 0;
          const travel = clamp((window.innerHeight - starts[index]) / (window.innerHeight + panel.offsetHeight));
          panel.style.setProperty("--chapter-cover", canStack ? String(arrival) : "0");
          panel.style.setProperty("--scene-shift", canStack ? `${(travel - .5) * -24}px` : "0px");
        });
      }
      next = Math.max(0, Math.min(journeyChapters.length - 1, next));
      if (next !== current) { current = next; setActive(next); }
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    function resize() {
      headerHeight = Math.round(document.querySelector(".site-header")?.getBoundingClientRect().height || 92);
      section?.style.setProperty("--journey-header", `${headerHeight}px`);
      schedule();
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      section.setAttribute("data-in-view", String(visible));
      schedule();
    }, { rootMargin: "100px" });
    observer.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    strip.addEventListener("scroll", schedule, { passive: true });
    reduced.addEventListener("change", resize);
    mobile.addEventListener("change", resize);
    stack.addEventListener("change", resize);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      strip.removeEventListener("scroll", schedule);
      reduced.removeEventListener("change", resize);
      mobile.removeEventListener("change", resize);
      stack.removeEventListener("change", resize);
    };
  }, []);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let disposed = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    function synchronize() {
      clearInterval(timer);
      if (disposed) return;
      const allowed = visible && !photosPaused && !isOpen && !reduced.matches && !document.hidden;
      section?.setAttribute("data-photo-running", String(allowed));
      if (allowed) timer = setInterval(() => setPhotoTick(value => value + 1), 7000);
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; synchronize(); }, { threshold: 0 });
    observer.observe(section);
    reduced.addEventListener("change", synchronize);
    document.addEventListener("visibilitychange", synchronize);
    return () => { disposed = true; clearInterval(timer); observer.disconnect(); reduced.removeEventListener("change", synchronize); document.removeEventListener("visibilitychange", synchronize); };
  }, [photosPaused, isOpen]);

  const goToChapter = useCallback((index: number) => {
    const strip = track.current;
    const target = panels.current[index];
    if (!strip || !target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    const behavior = reduced ? "instant" : "smooth";
    const header = document.querySelector(".site-header")?.getBoundingClientRect().height || 92;
    setActive(index);
    if (mobile) {
      strip.scrollTo({ left: target.offsetLeft - (panels.current[0]?.offsetLeft || 0), behavior });
      if (document.activeElement instanceof Element && document.activeElement.closest(".journey-swipe-controls")) navigation.current[index]?.focus({ preventScroll: true });
      // Use layout offsets after focus handling, not a moving smooth-scroll rectangle.
      requestAnimationFrame(() => {
        if (!strip.isConnected) return;
        let documentTop = 0;
        let ancestor: HTMLElement | null = strip;
        while (ancestor) {
          documentTop += ancestor.offsetTop;
          ancestor = ancestor.offsetParent as HTMLElement | null;
        }
        const currentHeader = document.querySelector(".site-header")?.getBoundingClientRect().height || header;
        const navigationHeight = root.current?.querySelector(".journey-navigation")?.getBoundingClientRect().height || 52;
        const targetTop = Math.max(0, documentTop - currentHeader - navigationHeight - 20);
        // Small focus-induced adjustments must not compete with a running mobile scroll.
        const alignmentBehavior = reduced || Math.abs(window.scrollY - targetTop) < 96 ? "instant" : behavior;
        window.scrollTo({ top: targetTop, behavior: alignmentBehavior });
      });
    } else {
      const marker = markers.current[index];
      const stack = window.matchMedia("(min-width: 901px) and (min-height: 700px)").matches && !reduced;
      const inset = header + 74 + (stack ? index * 10 : 0);
      window.scrollTo({ top: window.scrollY + (marker?.getBoundingClientRect().top ?? target.getBoundingClientRect().top) - inset + 1, behavior });
    }
  }, []);

  function navigate(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    goToChapter(index);
  }
  function keyboard(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? journeyChapters.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + journeyChapters.length) % journeyChapters.length;
    navigation.current[next]?.focus({ preventScroll: true });
    goToChapter(next);
  }

  return <section className="experience-journey" id="vivre-le-benin" ref={root} data-photo-paused={photosPaused} aria-labelledby="journey-title">
    <div className="container journey-intro">
      <Reveal variant="soft"><p className="eyebrow">NE FAITES PAS QUE PASSER</p><h2 id="journey-title">Le Bénin ne se visite pas.<br/><em>Il se vit.</em></h2></Reveal>
      <Reveal className="journey-intro-aside" delay={100}><p>Quatre façons de rencontrer un pays.<br/>Une seule invitation : vous laisser surprendre.</p><span><ArrowDown size={14}/>FAITES DÉFILER, LAISSEZ-VOUS EMPORTER</span></Reveal>
    </div>
    <div className="container journey-navigation">
      <nav aria-label="Chapitres des expériences béninoises">{journeyChapters.map((chapter, index) => <a ref={element => { navigation.current[index] = element; }} key={chapter.id} href={`#experience-panel-${index}`} aria-label={chapter.navigationLabel} aria-controls={`experience-panel-${index}`} aria-current={active === index ? "step" : undefined} className={active === index ? "active" : ""} onClick={event => navigate(event, index)} onKeyDown={event => keyboard(event, index)}><span>{chapter.number}</span>{chapter.shortLabel}</a>)}</nav>
      <button className="journey-motion-toggle" onClick={() => setPhotosPaused(value => !value)} aria-label={photosPaused ? "Relancer les photographies des expériences" : "Mettre les photographies des expériences en pause"} aria-pressed={photosPaused}>{photosPaused ? <Play size={13}/> : <Pause size={13}/>}<span>{photosPaused ? "Photos en pause" : "Photos en mouvement"}</span></button>
    </div>
    <div className="container journey-track" ref={track}>
      {journeyChapters.map((chapter, index) => {
        const photo = index === active ? photoTick % chapter.photos.length : 0;
        return <Fragment key={chapter.id}>
          <div className="journey-marker" ref={element => { markers.current[index] = element; }} aria-hidden="true"/>
          <article className={`journey-chapter ${active === index ? "is-current" : ""}`} id={`experience-panel-${index}`} ref={element => { panels.current[index] = element; }} style={{ "--chapter-index": index, "--chapter-accent": chapter.accent } as CSSProperties} aria-labelledby={`journey-title-${index}`} onFocusCapture={event => { if (event.target instanceof HTMLAnchorElement && active !== index) goToChapter(index); }}>
            <div className="journey-card-surface">
              <div className="journey-media">{chapter.photos.map((image, imageIndex) => <div key={image.src} className={`journey-photo ${imageIndex === photo ? "is-visible" : ""}`} aria-hidden={imageIndex !== photo}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 92vw, 90vw"/></div>)}</div>
              <div className="journey-shade"/>
              <div className="journey-card-top"><span>{chapter.eyebrow}</span><span>CHAPITRE {chapter.number} / 04</span></div>
              <div className="journey-card-copy"><h3 id={`journey-title-${index}`}><span>{chapter.verb}</span><em>{chapter.line}</em></h3><p>{chapter.description}</p><Link className="journey-card-link" href={chapter.href}>{chapter.action}<span><ArrowUpRight size={19}/></span></Link></div>
              <span className="journey-oversized-number" aria-hidden="true">{chapter.number}</span>
              <div className="journey-card-bottom"><span><MapPin size={12}/>{chapter.photos[photo].caption}</span><span>AYIFFA · LE BÉNIN DE L’INTÉRIEUR</span></div>
              <span className="journey-cover" aria-hidden="true"/>
            </div>
          </article>
        </Fragment>;
      })}
    </div>
    <div className="container journey-outro"><p>Les plus beaux souvenirs commencent par un premier pas.</p><Link href="/experiences" className="text-link">Explorer les expériences<ArrowUpRight size={17}/></Link><div className="journey-swipe-controls"><button disabled={active === 0} onClick={() => goToChapter(active - 1)} aria-label="Chapitre précédent"><ArrowLeft size={18}/></button><span>0{active + 1} / 04</span><button disabled={active === journeyChapters.length - 1} onClick={() => goToChapter(active + 1)} aria-label="Chapitre suivant"><ArrowRight size={18}/></button></div></div>
  </section>;
}
