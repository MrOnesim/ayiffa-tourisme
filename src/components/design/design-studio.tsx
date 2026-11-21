"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowUpRight, Camera, Check, Columns3, Compass, Copy, Download, Info, Layers3, Monitor, MousePointer2, Palette, Pause, Play, Smartphone } from "lucide-react";
import { Brand, SunEmblem } from "@/components/brand";
import { useCinema } from "@/components/cinema-provider";
import { useLocale } from "@/components/locale-provider";
import type { DesignDirectionId, PreviewDevice } from "@/lib/design-directions";
import { directionKey, getLocalizedDesignDirection, getLocalizedDesignDirections, getLocalizedDirectionBrief } from "@/lib/design-directions-locales";
import { DirectionPreview } from "./direction-preview";
import { DesignPreferenceForm } from "./preference-form";
import { DesignComparison } from "./comparison-dialog";
import { AppliedIdentityStatus } from "./applied-status";

function subscribeToReducedMotion(listener: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", listener);
  return () => preference.removeEventListener("change", listener);
}
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverReducedMotion = () => true;

export function DesignStudio({ initialDirection = "signature", initialDevice = "desktop" }: { initialDirection?: DesignDirectionId; initialDevice?: PreviewDevice }) {
  const { locale, t } = useLocale();
  const studio = t.studio;
  const directions = getLocalizedDesignDirections(locale);
  const [selected, setSelected] = useState<DesignDirectionId>(initialDirection);
  const [device, setDevice] = useState<PreviewDevice>(initialDevice);
  const [motionWanted, setMotionWanted] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [toast, setToast] = useState("");
  const [shareFallback, setShareFallback] = useState("");
  const comparison = useRef<HTMLDialogElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const preview = useRef<HTMLDivElement>(null);
  const reduced = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, serverReducedMotion);
  const { isOpen: filmOpen } = useCinema();
  const direction = getLocalizedDesignDirection(selected, locale);
  const animated = motionWanted && !reduced && !comparing && !filmOpen;

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function updateAddress(id: DesignDirectionId, format: PreviewDevice) {
    const url = new URL(window.location.href);
    url.searchParams.set("direction", id);
    if (format === "mobile") url.searchParams.set("format", "mobile");
    else url.searchParams.delete("format");
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }
  function choose(id: DesignDirectionId) { setSelected(id); setShareFallback(""); updateAddress(id, device); }
  function changeDevice(format: PreviewDevice) { setDevice(format); setShareFallback(""); updateAddress(selected, format); }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? directions.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + directions.length) % directions.length;
    tabs.current[next]?.focus(); choose(directions[next].id);
  }
  async function copyColor(value: string, name: string) {
    try { await navigator.clipboard.writeText(value); setToast(`${name} · ${value} ${studio.toastCopied}`); }
    catch { setToast(`${studio.toastCopyFailed} ${value}.`); }
  }
  async function share() {
    updateAddress(selected, device);
    try { await navigator.clipboard.writeText(window.location.href); setToast(studio.toastShareCopied); }
    catch { setShareFallback(window.location.href); }
  }
  function exportBrief() {
    const url = URL.createObjectURL(new Blob(["\uFEFF", getLocalizedDirectionBrief(direction, locale)], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = `ayiffa-direction-${direction.id}.txt`;
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setToast(`${direction.name} ${studio.toastBriefReady}`);
  }
  function revisitRecommendation() { choose("signature"); preview.current?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" }); }

  return <div className="design-studio" style={{ "--studio-accent": direction.palette[0].value } as CSSProperties}>
    <header className="studio-topbar"><div className="studio-shell studio-topbar-inner"><Brand/><span className="studio-topbar-title">{studio.topbarTitle}</span><Link href="/" className="studio-return">{studio.viewAppliedSite}<ArrowUpRight size={15}/></Link></div></header>
    <div className="studio-shell">
      <AppliedIdentityStatus/>
      <section className="studio-intro"><div><p className="studio-kicker"><Palette size={13}/>{studio.introKicker}</p><h1 dangerouslySetInnerHTML={{ __html: `${studio.introTitleA}<br/><em>${studio.introTitleB}</em>` }}/></div><div className="studio-intro-aside"><p dangerouslySetInnerHTML={{ __html: studio.introText }}/><button className="studio-recommendation-link" onClick={revisitRecommendation}><Check size={15}/><span>{studio.baseIdentity} <strong>{studio.baseIdentityName}</strong></span><ArrowDown size={14}/></button><small>{studio.previewsNote}</small></div></section>
      <div className="direction-tabs" role="tablist" aria-label={studio.tabsAria}>{directions.map((item, index) => <button type="button" role="tab" key={item.id} id={`direction-tab-${item.id}`} ref={element => { tabs.current[index] = element; }} aria-selected={selected === item.id} aria-controls="direction-preview-panel" tabIndex={selected === item.id ? 0 : -1} className={`direction-tab ${selected === item.id ? "is-selected" : ""}`} onClick={() => choose(item.id)} onKeyDown={event => keyboard(event, index)}><span className="direction-tab-number">{item.number}</span><span className="direction-tab-copy"><strong>{item.name}</strong><small>{item.subtitle}</small></span><span className="direction-tab-colors" aria-hidden="true">{item.palette.slice(0,3).map(color => <span key={color.value} style={{ background: color.value }}/>)}</span>{item.recommended && <span className="direction-tab-recommended">{studio.baseLabel}</span>}</button>)}</div>
      <div className="studio-workspace" ref={preview}>
        <section className="studio-preview-pane" aria-label={studio.previewAria}>
          <div className="studio-preview-toolbar"><span className="studio-preview-name">{direction.number} / {direction.name}</span><div className="studio-device-switch" role="group" aria-label={studio.deviceAria}><button onClick={() => changeDevice("desktop")} aria-pressed={device === "desktop"} aria-label={studio.deviceDesktopAria}><Monitor size={16}/><span>{studio.deviceDesktop}</span></button><button onClick={() => changeDevice("mobile")} aria-pressed={device === "mobile"} aria-label={studio.deviceMobileAria}><Smartphone size={15}/><span>{studio.deviceMobile}</span></button></div><button className="studio-motion-toggle" onClick={() => setMotionWanted(value => !value)} disabled={reduced} aria-pressed={motionWanted && !reduced} aria-label={reduced ? studio.motionReduced : motionWanted ? studio.motionPause : studio.motionPlay}>{motionWanted && !reduced ? <Pause size={14}/> : <Play size={14}/>}<span>{reduced ? studio.motionReducedLabel : motionWanted ? studio.motionAnimations : studio.motionPaused}</span></button></div>
          <div className="studio-preview-frame"><div className="studio-preview-chrome"><span className="studio-window-dots" aria-hidden="true"/><span>ayiffa · inspiration / direction {direction.number}</span><span className="studio-preview-badge">{studio.previewBadge}</span></div><div className={`studio-preview-stage ${device === "mobile" ? "is-mobile" : ""}`}><div id="direction-preview-panel" role="tabpanel" aria-labelledby={`direction-tab-${selected}`} tabIndex={0} className="studio-preview-panel"><DirectionPreview direction={selected} device={device} animated={animated}/></div></div></div>
          <div className="studio-preview-caption"><span><Layers3 size={13}/>{studio.inspirations}</span><button onClick={share}><Copy size={13}/>{studio.share}</button></div>
          {shareFallback && <label className="studio-share-fallback">{studio.shareFallback}<input readOnly value={shareFallback} autoFocus onFocus={event => event.currentTarget.select()}/></label>}
          <div className="studio-preview-note"><Info size={14}/><p>{studio.note}</p></div>
          <div className="studio-concept-reasons"><div><h3>{studio.idealFor}</h3><p>{direction.idealFor}</p></div><div><h3>{studio.watchpoint}</h3><p>{direction.watchpoint}</p></div></div>
          <button className="studio-compare-button" onClick={() => { comparison.current?.showModal(); setComparing(true); }}><Columns3 size={18}/><span>{studio.compare}<small>{studio.compareSubtitle}</small></span><ArrowUpRight size={18}/></button>
        </section>
        <aside className="studio-sidebar"><section className="direction-brief" aria-labelledby="direction-brief-title"><div className="direction-brief-top"><p className="studio-kicker">{studio.briefKicker}</p>{direction.recommended && <span className="studio-recommended"><Check size={11}/>{studio.appliedBadge}</span>}</div><h2 id="direction-brief-title">{direction.name}</h2><p className="direction-personality">{direction.personality}</p><p className="direction-description">{direction.description}</p><div className="direction-palette"><h3>{studio.palette}</h3><div>{direction.palette.map(color => <button key={color.value} onClick={() => copyColor(color.value, color.name)} aria-label={`${studio.copyColorAria} ${color.name} ${color.value}`}><span style={{ background: color.value }}/><strong>{color.name}</strong><small>{color.value}</small></button>)}</div></div><div className={`direction-typography type-${direction.id}`}><h3>{studio.typography}</h3><span>{studio.directions[directionKey(selected)].typeSample}</span><p>{direction.displayFont}<small>+ {direction.bodyFont} {studio.typographyBody}</small></p></div><div className="direction-movements"><h3>{studio.movement}</h3><ul>{direction.movements.map(movement => <li key={movement}><Check size={12}/>{movement}</li>)}</ul></div><button className="direction-export" onClick={exportBrief} aria-label={`${studio.exportAria} ${direction.name}`}><Download size={14}/>{studio.export}<span>.TXT</span></button></section><DesignPreferenceForm direction={direction} onSelect={choose}/></aside>
      </div>
      <section className="studio-recommendation"><div className="studio-recommendation-copy"><p className="studio-kicker"><SunEmblem/>{studio.recommendKicker}</p><h2 dangerouslySetInnerHTML={{ __html: `${studio.recommendTitleA}<br/><em>${studio.recommendTitleB}</em>` }}/><p dangerouslySetInnerHTML={{ __html: studio.recommendText }}/><Link href="/" className="studio-button studio-button-cream">{studio.discoverApplied}<ArrowUpRight size={17}/></Link></div><div className="studio-recommendation-points"><div><Camera size={23} strokeWidth={1.3}/><h3>{studio.recommendPoint1Title}</h3><p>{studio.recommendPoint1Text}</p></div><div><Compass size={23} strokeWidth={1.3}/><h3>{studio.recommendPoint2Title}</h3><p>{studio.recommendPoint2Text}</p></div><div><MousePointer2 size={23} strokeWidth={1.3}/><h3>{studio.recommendPoint3Title}</h3><p>{studio.recommendPoint3Text}</p></div></div><span className="studio-recommendation-number" aria-hidden="true">01</span></section>
      <footer className="studio-footer"><Link href="/" className="studio-back-link"><ArrowLeft size={14}/>{studio.footerBack}</Link><span>{studio.footerNote}</span><div><Link href="/credits">{studio.creditsLink}</Link><Link href="/confidentialite#preferences-design">{studio.dataLink}</Link></div></footer>
    </div>
    <DesignComparison dialogRef={comparison} onSelect={choose} onClose={() => setComparing(false)}/>
    {toast && <div className="studio-toast" role="status"><Check size={15}/>{toast}</div>}
  </div>;
}
