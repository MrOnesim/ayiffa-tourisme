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
import {
  BENIN_MAP,
  BENIN_MAP_ATTRIBUTION,
  beninContextCities,
  beninCountryPath,
  beninDepartmentPaths,
  beninNeighbourPaths,
  projectBenin,
} from "@/lib/benin-map";
import { getLocalizedAtlasStops } from "@/lib/localized-data";
import { useContent } from "@/lib/use-content";
import { EmLines } from "./lines";
import { useLocale } from "./locale-provider";

const MAP = { x: 0, y: 0, width: BENIN_MAP.width, height: BENIN_MAP.height };
const viewBox = `${MAP.x} ${MAP.y} ${MAP.width} ${MAP.height}`;

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
          <clipPath id={`${idPrefix}-frame`}><rect x="0" y="0" width={MAP.width} height={MAP.height}/></clipPath>
        </defs>
        <g clipPath={`url(#${idPrefix}-frame)`}>
          <rect x="0" y="0" width={MAP.width} height={MAP.height} fill="#e8f0eb" pointerEvents="none"/>
          <rect x="0" y="690" width={MAP.width} height="40" fill={`url(#${idPrefix}-ocean)`} pointerEvents="none"/>
          {Object.entries(beninNeighbourPaths).map(([key, d]) => <path key={key} className={`map-country map-country-${key}`} d={d}/>)}
          <g className="benin-focus" filter={`url(#${idPrefix}-shadow)`}><path d={beninCountryPath}/></g>
          {beninDepartmentPaths.map(department => <path key={department.name} className="map-department" d={department.d}/>)}
          {beninContextCities.map(city => {
            const point = projectBenin(city.lon, city.lat);
            return <g key={city.name} className={`map-context-city map-context-${city.side}`}>
              <circle cx={point.x} cy={point.y} r="3.2"/>
              <text x={point.x + (city.side === "left" ? -9 : 9 + city.dx)} y={point.y + 3} textAnchor={city.side === "left" ? "end" : "start"}>{city.name}</text>
            </g>;
          })}
          <text className="map-ocean-label" x="370" y="722" textAnchor="middle">{ui.atlasOceanLabel}</text>
          <text className="map-neighbor-label" x="115" y="80">BURKINA FASO</text>
          <text className="map-neighbor-label" x="625" y="80">NIGER</text>
          <text className="map-neighbor-label" x="240" y="390">TOGO</text>
          <text className="map-neighbor-label" x="70" y="490">GHANA</text>
          <text className="map-neighbor-label" x="620" y="470">NIGERIA</text>
          <text className="map-compass-rose" x="700" y="42" textAnchor="middle">N</text>
        </g>
      </svg>
      <div className="atlas-marker-layer" style={overlay.style}>
        {atlasStops.map((item, index) => <button
          key={item.slug}
          ref={element => { markerRefs[index] = element; }}
          type="button"
          className={`atlas-stop atlas-stop-${item.slug} ${active === index ? "is-active" : ""} atlas-stop-${item.labelSide}`}
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
            <div className="atlas-map-footer"><span>{ui.benin.toUpperCase()}</span><span>{BENIN_MAP_ATTRIBUTION}</span></div>
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
