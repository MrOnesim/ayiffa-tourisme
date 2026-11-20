"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal, MousePointer2 } from "lucide-react";
import { getLocalizedPostcards } from "@/lib/localized-data";
import { useLocale } from "./locale-provider";

export function DestinationFan() {
  const { locale, t } = useLocale();
  const ui = t.ui;
  const departurePostcards = getLocalizedPostcards(locale);
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const element = root.current;
    const track = rail.current;
    if (!element || !track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 900px)");
    let visible = false;
    let frame = 0;
    let current = 0;

    function update() {
      frame = 0;
      if (!element || !track) return;
      if (mobile.matches) {
        const cards = Array.from(track.querySelectorAll<HTMLElement>(".departure-position"));
        if (cards.length > 1) {
          const step = cards[1].offsetLeft - cards[0].offsetLeft;
          const next = Math.min(cards.length - 1, Math.max(0, Math.round(track.scrollLeft / Math.max(1, step))));
          if (next !== current) { current = next; setSelected(next); }
        }
        return;
      }
      if (reduced.matches) { element.style.setProperty("--fan-spread", "1"); element.style.setProperty("--fan-lift", "0px"); return; }
      if (!visible) return;
      const bounds = element.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * .86 - bounds.top) / (window.innerHeight * .7)));
      element.style.setProperty("--fan-spread", String(.68 + progress * .32));
      element.style.setProperty("--fan-lift", `${(1 - progress) * 34}px`);
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, { rootMargin: "100px" });
    observer.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    track.addEventListener("scroll", schedule, { passive: true });
    reduced.addEventListener("change", schedule);
    mobile.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      track.removeEventListener("scroll", schedule);
      reduced.removeEventListener("change", schedule);
      mobile.removeEventListener("change", schedule);
    };
  }, []);

  function go(direction: number) {
    const track = rail.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".departure-position"));
    const target = Math.min(cards.length - 1, Math.max(0, selected + direction));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: cards[target].offsetLeft - cards[0].offsetLeft, behavior: reduced ? "instant" : "smooth" });
  }

  return <div ref={root} className="departure-fan">
    <div ref={rail} className="departure-rail" role="group" aria-label={ui.departuresAria}>
      {departurePostcards.map((card, index) => {
        const slot = index - (departurePostcards.length - 1) / 2;
        return <div key={card.title} className="departure-position" style={{ "--fan-slot": slot, "--fan-angle": `${slot * 4.5}deg`, "--fan-arc": `${Math.abs(slot) * 17}px`, "--fan-order": 10 - Math.abs(slot) } as CSSProperties}>
          <Link href={card.href} className={`departure-card card-lift`} aria-label={`${ui.departureExploreAria} ${card.title}`}>
            <Image src={card.image} alt={card.alt} fill sizes="(max-width: 900px) 78vw, 260px"/>
            <div className="departure-shade"/>
            <span className="departure-label">{card.label}</span>
            <span className="departure-number">0{index + 1}</span>
            <div className="departure-caption"><h3>{card.title}</h3><span>{card.note}</span></div>
            <span className="departure-arrow" aria-hidden="true"><ArrowUpRight size={19} strokeWidth={1.5}/></span>
          </Link>
        </div>;
      })}
    </div>
    <div className="departure-toolbar">
      <span className="departure-hint"><MousePointer2 size={14}/><span className="fan-desktop-hint">{ui.fanDesktopHint}</span><span className="fan-mobile-hint">{ui.fanMobileHint}</span></span>
      <div className="departure-controls" aria-label={ui.departureControlsAria}><button onClick={() => go(-1)} disabled={selected === 0} aria-label={ui.departurePrev}><ArrowLeft size={18}/></button><span aria-live="polite">0{selected + 1} / 0{departurePostcards.length}</span><button onClick={() => go(1)} disabled={selected === departurePostcards.length - 1} aria-label={ui.departureNext}><ArrowRight size={18}/></button></div>
      <Link className="text-link" href="/destinations">{ui.departureAllLink}<ArrowUpRight size={17}/></Link>
    </div>
    <p className="departure-access-note"><MoveHorizontal size={12}/>{ui.departureAccessNote}</p>
  </div>;
}
