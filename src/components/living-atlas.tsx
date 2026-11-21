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

const MAP = { x: 0, y: 0, width: 740, height: 730 };
const viewBox = `${MAP.x} ${MAP.y} ${MAP.width} ${MAP.height}`;

// Fond de carte schématique : le Bénin est un pays étroit, allongé nord-sud.
// Les voisins sont dessinés autour, jamais par-dessus le territoire béninois.
const mapPaths = [
  { id: "benin", d: "M300,20 L500,20 L500,110 L485,190 L500,270 L480,350 L470,430 L455,510 L440,590 L420,650 L385,658 L350,650 L335,590 L320,510 L330,430 L315,350 L300,270 L310,190 L300,110 Z" },
  { id: "burkina-faso", d: "M0,0 L300,0 L300,160 L0,160 Z" },
  { id: "niger", d: "M500,0 L740,0 L740,140 L500,140 Z" },
  { id: "ghana", d: "M0,160 L185,160 L185,650 L0,650 Z" },
  { id: "togo", d: "M185,160 L300,160 L300,640 L185,650 Z" },
  { id: "nigeria", d: "M500,140 L740,140 L740,670 L420,670 L440,590 L455,510 L470,430 L480,350 L500,270 L485,190 L500,110 Z" },
];

// Le SVG est centré dans son conteneur (preserveAspectRatio="meet"). Les points
// HTML doivent suivre exactement cette zone rendue, sinon ils se décalent.
function useMapOverlay() {
  const wrap = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ left: 0, top: 0, width: "100%", height: "100%" });
  useEffect(() => {
    const element = wrap.current;
    if (!element) return;
    const update = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      const scale = Math.min(width / MAP.width, height / MAP.height);
      const renderedWidth = MAP.width * scale;
      const renderedHeight = MAP.height * scale;
      setStyle({ left: (width - renderedWidth) / 2, top: (height - renderedHeight) / 2, width: renderedWidth, height: renderedHeight });
    };
    update();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { wrap, style };
}

export function LivingAtlas() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const markerButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const largeMarkerButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const mainMap = useMapOverlay();
  const largeMap = useMapOverlay();
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

  const renderMap = (idPrefix: string, markerRefs: (HTMLButtonElement | null)[], ariaLabel: string, overlay: ReturnType<typeof useMapOverlay>) => (
    <div className="atlas-map-wrap" ref={overlay.wrap}>
      <svg className="atlas-map" viewBox={viewBox} role="img" aria-label={ariaLabel}>
        <defs>
          <pattern id={`${idPrefix}-ocean`} patternUnits="userSpaceOnUse" width="9" height="9"><path d="M0 9L9 0" stroke="#a9c1bd" strokeWidth=".35" opacity=".35"/></pattern>
          <filter id={`${idPrefix}-shadow`} x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#15392c" floodOpacity=".13"/></filter>
        </defs>
        <rect x="-20" y="-20" width="780" height="780" fill="#e8f0eb" pointerEvents="none"/>
        <rect x="-20" y="650" width="780" height="120" fill={`url(#${idPrefix}-ocean)`} pointerEvents="none"/>
        {mapPaths.map(path => <path key={path.id} className={`map-country map-country-${path.id}`} d={path.d}/>)}
        <text className="map-ocean-label" x="370" y="674" textAnchor="middle">{ui.atlasOceanLabel}</text>
        <text className="map-neighbor-label" x="150" y="90">BURKINA FASO</text>
        <text className="map-neighbor-label" x="620" y="80">NIGER</text>
        <text className="map-neighbor-label" x="235" y="300">TOGO</text>
        <text className="map-neighbor-label" x="95" y="350">GHANA</text>
        <text className="map-neighbor-label" x="610" y="350">NIGERIA</text>
        <g className="benin-focus" filter={`url(#${idPrefix}-shadow)`}><path d={mapPaths[0].d}/></g>
        <text className="map-compass-rose" x="700" y="40" textAnchor="middle">N</text>
      </svg>
      <div className="atlas-marker-layer" style={overlay.style}>
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
            {renderMap("atlas", markerButtons.current, ui.atlasMapAria, mainMap)}
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
            <div className="atlas-map-shell">{renderMap("atlas-lg", largeMarkerButtons.current, ui.atlasExpandedMapAria, largeMap)}</div>
          </div>
          <aside className="atlas-dialog-side">
            <p className="atlas-dialog-hint">{ui.atlasDialogHint}</p>
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
