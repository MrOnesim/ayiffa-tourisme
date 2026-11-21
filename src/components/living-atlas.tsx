"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
type AtlasKeyboardEvent = {
  key: string;
  preventDefault: () => void;
  currentTarget: { closest: (selector: string) => Element | null };
};
import { ArrowUpRight, MapPin, Maximize2, MoveUpRight, X } from "lucide-react";
import { getLocalizedAtlasStops } from "@/lib/localized-data";
import { useContent } from "@/lib/use-content";
import { EmLines } from "./lines";
import { useLocale } from "./locale-provider";

const MAP = { x: 15, y: -150, width: 660, height: 730 };
const viewBox = `${MAP.x} ${MAP.y} ${MAP.width} ${MAP.height}`;

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
  const [expanded, setExpanded] = useState(false);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const markerButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const largeMarkerButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const { destinations } = useContent();
  const { locale, t } = useLocale();
  const ui = t.ui;
  const atlasStops = getLocalizedAtlasStops(locale);
  const atlasLines = ui.atlasTitle.split("\n");
  const stop = atlasStops[active];
  const destination = destinations.find(d => d.slug === stop.slug);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (expanded && !element.open) element.showModal();
    if (!expanded && element.open) element.close();
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [expanded]);

  const select = useCallback((index: number) => {
    setActive((index + atlasStops.length) % atlasStops.length);
  }, [atlasStops.length]);

  function keyboard(event: AtlasKeyboardEvent, index: number) {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? atlasStops.length - 1 : (index + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) + atlasStops.length) % atlasStops.length;
    select(next);
    const target = event.currentTarget.closest(".atlas-dialog")
      ? largeMarkerButtons.current[next]
      : event.currentTarget.closest(".atlas-panel-list")
        ? buttons.current[next]
        : markerButtons.current[next];
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

  const markerStyle = (item: { x: number; y: number }): CSSProperties => ({
    left: `${((item.x - MAP.x) / MAP.width) * 100}%`,
    top: `${((item.y - MAP.y) / MAP.height) * 100}%`,
  });

  const renderMap = (idPrefix: string, markerRefs: (HTMLButtonElement | null)[], ariaLabel: string) => (
    <div className="atlas-map-wrap">
      <svg className="atlas-map" viewBox={viewBox} role="img" aria-label={ariaLabel}>
        <defs>
          <pattern id={`${idPrefix}-ocean`} patternUnits="userSpaceOnUse" width="9" height="9"><path d="M0 9L9 0" stroke="#a9c1bd" strokeWidth=".35" opacity=".35"/></pattern>
          <filter id={`${idPrefix}-shadow`} x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#15392c" floodOpacity=".13"/></filter>
        </defs>
        <rect x="-100" y="-300" width="1000" height="1100" fill="#e8f0eb" pointerEvents="none"/>
        <rect x="-100" y="410" width="1000" height="390" fill={`url(#${idPrefix}-ocean)`} pointerEvents="none"/>
        {mapPaths.map(path => <path key={path.id} className={`map-country map-country-${path.id}`} d={path.d}/>)}
        <text className="map-ocean-label" x="640" y="505">{ui.atlasOceanLabel}</text>
        <text className="map-neighbor-label" x="157" y="255">GHANA</text>
        <text className="map-neighbor-label" x="276" y="106">TOGO</text>
        <text className="map-neighbor-label" x="536" y="195">NIGERIA</text>
        <text className="map-neighbor-label" x="110" y="75">BURKINA FASO</text>
        <text className="map-neighbor-label" x="519" y="-124">NIGER</text>
        <g className="benin-focus" filter={`url(#${idPrefix}-shadow)`}><path d={mapPaths[0].d}/></g>
        <text className="map-compass-rose" x="457" y="-67" textAnchor="middle">N</text>
      </svg>
      <div className="atlas-marker-layer">
        {atlasStops.map((item, index) => <button
          key={item.slug}
          ref={element => { markerRefs[index] = element; }}
          type="button"
          className={`atlas-stop ${active === index ? "is-active" : ""} atlas-stop-${item.labelSide}`}
          aria-label={`${ui.atlasStopAria} ${item.number} : ${item.shortName}`}
          aria-pressed={active === index}
          style={markerStyle(item)}
          onMouseEnter={() => setActive(index)}
          onFocus={() => setActive(index)}
          onClick={() => setActive(index)}
          onKeyDown={event => keyboard(event, index)}
        ><span className="atlas-stop-dot">{item.number}</span><span className="atlas-stop-label">{item.shortName}</span></button>)}
      </div>
    </div>
  );

  return <>
    <section className="living-atlas" id="atlas-vivant" aria-labelledby="atlas-title">
      <div className="container">
        <div className="atlas-heading"><div><p className="eyebrow">{ui.atlasEyebrow}</p><h2 id="atlas-title">{atlasLines[0]}<br/><em>{atlasLines[1]}</em></h2></div><div><p>{ui.atlasIntro}</p><Link href="/destinations" className="text-link">{ui.atlasAll}<ArrowUpRight size={17}/></Link></div></div>
        <div className="atlas-layout">
          <div className="atlas-map-shell">
            <div className="atlas-map-top"><span className="atlas-region-tag"><MapPin size={12}/>{ui.atlasRegionTag}</span><span className="atlas-compass" aria-hidden="true"/></div>
            {renderMap("atlas", markerButtons.current, ui.atlasMapAria)}
            <button type="button" className="atlas-expand" onClick={() => setExpanded(true)} aria-label={ui.atlasExpand}><Maximize2 size={15}/><span>{ui.atlasExpand}</span></button>
            <div className="atlas-map-footer"><span>{ui.benin.toUpperCase()}</span><span>{ui.atlasFooterCredit}</span><span>{ui.atlasFooterPositions}</span></div>
          </div>
          <div className="atlas-panel">
            <div className="atlas-panel-top"><span>{ui.atlasPanelEscale} {stop.number}</span><span>0{active + 1} / 0{atlasStops.length}</span></div>
            <div className="atlas-panel-image"><Image key={stop.slug} src={destination?.image || "/images/ganvie.jpg"} alt={destination?.imageAlt || stop.name} fill sizes="(max-width: 900px) 90vw, 35vw"/><span className="atlas-panel-category">{stop.category}</span></div>
            <div className="atlas-panel-content"><span className="atlas-panel-region"><MapPin size={13}/>{stop.region}, {ui.benin}</span><h3>{stop.name}</h3><p>{stop.description}</p>{destination?.imageNote && <small>{destination.imageNote}</small>}<Link href={`/destinations/${stop.slug}`} className="button button-terra">{ui.atlasDiscover}<ArrowUpRight size={18}/></Link></div>
            <div className="atlas-panel-list" role="group" aria-label={ui.atlasChooseStop}>{atlasStops.map((item, index) => <button key={item.slug} ref={element => { buttons.current[index] = element; }} onClick={() => select(index)} aria-pressed={active === index} className={active === index ? "is-active" : ""}><span>{item.number}</span>{item.shortName}{active === index && <MoveUpRight size={14}/>}</button>)}</div>
          </div>
        </div>
      </div>
    </section>

    <dialog ref={dialog} className="atlas-dialog" aria-labelledby="atlas-dialog-title" onClose={() => setExpanded(false)} onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className="atlas-dialog-inner">
        <div className="atlas-dialog-head">
          <div><p className="eyebrow">{ui.atlasEyebrow}</p><h2 id="atlas-dialog-title"><EmLines text={ui.atlasTitle}/></h2></div>
          <button type="button" className="atlas-dialog-close" onClick={() => dialog.current?.close()} aria-label={ui.atlasClose}><X size={20}/></button>
        </div>
        <div className="atlas-dialog-body">
          <div className="atlas-dialog-map">
            <div className="atlas-map-shell">{renderMap("atlas-lg", largeMarkerButtons.current, ui.atlasExpandedMapAria)}</div>
          </div>
          <aside className="atlas-dialog-side">
            <p className="atlas-dialog-hint">{ui.atlasIntro}</p>
            <div className="atlas-dialog-stops" role="group" aria-label={ui.atlasChooseStop}>
              {atlasStops.map((item, index) => <button key={item.slug} type="button" className={`atlas-dialog-stop ${active === index ? "is-active" : ""}`} aria-pressed={active === index} onClick={() => setActive(index)}><span>{item.number}</span><strong>{item.shortName}</strong><small>{item.region}</small></button>)}
            </div>
            <div className="atlas-dialog-detail">
              <span className="atlas-panel-region"><MapPin size={13}/>{stop.region}, {ui.benin}</span>
              <h3>{stop.name}</h3>
              <p>{stop.description}</p>
              <Link href={`/destinations/${stop.slug}`} className="button button-terra" onClick={() => setExpanded(false)}>{ui.atlasDiscover}<ArrowUpRight size={18}/></Link>
            </div>
          </aside>
        </div>
      </div>
    </dialog>
  </>;
}
