"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
type AtlasKeyboardEvent = {
  key: string;
  preventDefault: () => void;
  currentTarget: { closest: (selector: string) => Element | null };
};
import { ArrowUpRight, Compass, MapPin, MoveUpRight } from "lucide-react";
import { atlasDestination, atlasStops } from "@/lib/atlas";
import { useContent } from "@/lib/use-content";

const mapPaths = [
  { id: "benin", d: "M90.4,-130.6 L279.0,-130.6 L469.3,-130.6 L561.0,-130.6 L615.4,-91.8 L615.4,45.2 L600.2,141.8 L561.0,202.4 L615.4,298.2 L561.0,394.8 L543.4,443.6 L469.3,472.7 L377.6,463.1 L279.0,472.7 L203.6,463.1 L147.4,443.6 L90.4,347.9 L71.4,250.9 L90.4,154.5 L90.4,45.2 Z" },
  { id: "togo", d: "M15,45.2 L90.4,45.2 L90.4,154.5 L90.4,347.9 L71.4,443.6 L52.4,472.7 L15,463.1 L15,347.9 L15,202.4 Z" },
  { id: "nigeria", d: "M615.4,-91.8 L675,-91.8 L675,491.8 L469.3,472.7 L543.4,443.6 L561.0,394.8 L615.4,298.2 L561.0,202.4 L600.2,141.8 Z" },
  { id: "ghana", d: "M15,45.2 L15,202.4 L15,347.9 L15,463.1 L-24,463.1 L-24,45.2 Z" },
  { id: "burkina-faso", d: "M90.4,-130.6 L90.4,45.2 L15,45.2 L15,-130.6 L90.4,-130.6 Z" },
  { id: "niger", d: "M561.0,-130.6 L675,-130.6 L675,-91.8 L615.4,-91.8 L561.0,-130.6 Z" },
];

export function LivingAtlas() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const markerButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const { destinations } = useContent();
  const stop = atlasStops[active];
  const destination = destinations.find(d => d.slug === stop.slug);

  const select = useCallback((index: number) => {
    setActive((index + atlasStops.length) % atlasStops.length);
  }, []);

  function keyboard(event: AtlasKeyboardEvent, index: number) {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? atlasStops.length - 1 : (index + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) + atlasStops.length) % atlasStops.length;
    select(next);
    const target = event.currentTarget.closest(".atlas-panel-list") ? buttons.current[next] : markerButtons.current[next];
    window.requestAnimationFrame(() => target?.focus({ preventScroll: true }));
  }

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest(".atlas-map")) return;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) event.preventDefault();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return <section className="living-atlas" id="atlas-vivant" aria-labelledby="atlas-title">
    <div className="container">
      <div className="atlas-heading"><div><p className="eyebrow">ATLAS VIVANT / CINQ ESCALES</p><h2 id="atlas-title">Le Bénin,<br/><em>à la carte.</em></h2></div><div><p>Sélectionnez un repère pour découvrir le lieu et ouvrir sa fiche.</p><Link href="/destinations" className="text-link">Toutes les destinations<ArrowUpRight size={17}/></Link></div></div>
      <div className="atlas-layout">
        <div className="atlas-map-shell">
          <div className="atlas-map-top"><span className="atlas-region-tag"><MapPin size={12}/>NORD · SUD</span><span className="atlas-compass" aria-hidden="true"><span>N</span><i/></span></div>
          <div className="atlas-map-wrap">
            <svg className="atlas-map" viewBox="15 -150 660 640" role="img" aria-label="Carte indicative du Bénin et de ses voisins avec cinq escales numérotées de 01 à 05">
              <defs><pattern id="atlasOcean" patternUnits="userSpaceOnUse" width="9" height="9"><path d="M0 9L9 0" stroke="#a9c1bd" strokeWidth=".35" opacity=".35"/></pattern><filter id="atlasShadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#15392c" floodOpacity=".13"/></filter></defs>
              <rect x="-100" y="-300" width="1000" height="1100" fill="#e8f0eb" pointerEvents="none"/>
              <rect x="-100" y="410" width="1000" height="390" fill="url(#atlasOcean)" pointerEvents="none"/>
              {mapPaths.map(path => <path key={path.id} className={`map-country map-country-${path.id}`} d={path.d}/>)}
              <text className="map-ocean-label" x="640" y="523">OCÉAN ATLANTIQUE</text>
              <text className="map-neighbor-label" x="157" y="255">GHANA</text>
              <text className="map-neighbor-label" x="276" y="106">TOGO</text>
              <text className="map-neighbor-label" x="536" y="195">NIGERIA</text>
              <text className="map-neighbor-label" x="110" y="75">BURKINA FASO</text>
              <text className="map-neighbor-label" x="519" y="-124">NIGER</text>
              <g className="benin-focus" filter="url(#atlasShadow)"><path d={mapPaths[0].d}/></g>
              <text className="map-compass-rose" x="457" y="-67" textAnchor="middle">N</text>
            </svg>
            <div className="atlas-marker-layer">
              {atlasStops.map((item, index) => <button
                key={item.slug}
                ref={element => { markerButtons.current[index] = element; }}
                type="button"
                className={`atlas-stop ${active === index ? "is-active" : ""} atlas-stop-${item.labelSide}`}
                aria-label={`Escale ${item.number} : ${item.shortName}`}
                aria-pressed={active === index}
                style={{ left: `${((item.x - 15) / 660) * 100}%`, top: `${((item.y + 150) / 640) * 100}%` }}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                onKeyDown={event => keyboard(event, index)}
              ><span className="atlas-stop-dot">{item.number}</span><span className="atlas-stop-label">{item.shortName}</span></button>)}
            </div>
          </div>
          <div className="atlas-map-footer"><span><i/> BÉNIN</span><span>Carte indicative · Natural Earth</span><span>Positions des escales : repères illustratifs</span></div>
        </div>
        <div className="atlas-panel">
          <div className="atlas-panel-top"><span>ESCALE {stop.number}</span><span>0{active + 1} / 0{atlasStops.length}</span></div>
          <div className="atlas-panel-image"><Image key={stop.slug} src={destination?.image || "/images/ganvie.jpg"} alt={destination?.imageAlt || stop.name} fill sizes="(max-width: 900px) 90vw, 35vw"/><span className="atlas-panel-category">{stop.category}</span></div>
          <div className="atlas-panel-content"><span className="atlas-panel-region"><MapPin size={13}/>{stop.region}, Bénin</span><h3>{stop.name}</h3><p>{stop.description}</p>{destination?.imageNote && <small>{destination.imageNote}</small>}<Link href={`/destinations/${stop.slug}`} className="button button-terra">Découvrir cette destination<ArrowUpRight size={18}/></Link></div>
          <div className="atlas-panel-list" role="group" aria-label="Choisir une escale">{atlasStops.map((item, index) => <button key={item.slug} ref={element => { buttons.current[index] = element; }} onClick={() => select(index)} aria-pressed={active === index} className={active === index ? "is-active" : ""}><span>{item.number}</span>{item.shortName}{active === index && <MoveUpRight size={14}/>}</button>)}</div>
        </div>
      </div>
    </div>
  </section>;
}
