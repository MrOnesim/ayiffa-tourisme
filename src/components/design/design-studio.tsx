"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowUpRight, Camera, Check, Columns3, Compass, Copy, Download, Info, Layers3, Monitor, MousePointer2, Palette, Pause, Play, Smartphone } from "lucide-react";
import { Brand, SunEmblem } from "@/components/brand";
import { useCinema } from "@/components/cinema-provider";
import { designDirections, directionBrief, getDesignDirection, type DesignDirectionId, type PreviewDevice } from "@/lib/design-directions";
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
  const direction = getDesignDirection(selected);
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
    const next = event.key === "Home" ? 0 : event.key === "End" ? designDirections.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + designDirections.length) % designDirections.length;
    tabs.current[next]?.focus(); choose(designDirections[next].id);
  }
  async function copyColor(value: string, name: string) {
    try { await navigator.clipboard.writeText(value); setToast(`${name} · ${value} copié.`); }
    catch { setToast(`La copie automatique n’est pas disponible. Le code est ${value}.`); }
  }
  async function share() {
    updateAddress(selected, device);
    try { await navigator.clipboard.writeText(window.location.href); setToast("Le lien de cet aperçu est copié. Aucune note privée n’est partagée."); }
    catch { setShareFallback(window.location.href); }
  }
  function exportBrief() {
    const url = URL.createObjectURL(new Blob(["\uFEFF", directionBrief(direction)], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = `ayiffa-direction-${direction.id}.txt`;
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setToast(`La fiche ${direction.name} est prête à conserver.`);
  }
  function revisitRecommendation() { choose("signature"); preview.current?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" }); }

  return <div className="design-studio" style={{ "--studio-accent": direction.palette[0].value } as CSSProperties}>
    <header className="studio-topbar"><div className="studio-shell studio-topbar-inner"><Brand/><span className="studio-topbar-title">L’IDENTITÉ AYIFFA</span><Link href="/" className="studio-return">Voir le site appliqué<ArrowUpRight size={15}/></Link></div></header>
    <div className="studio-shell">
      <AppliedIdentityStatus/>
      <section className="studio-intro"><div><p className="studio-kicker"><Palette size={13}/>IDENTITÉ VISUELLE · AYIFFA TOURISME</p><h1>Une identité.<br/><em>Trois inspirations.</em></h1></div><div className="studio-intro-aside"><p>Les trois pistes sont réunies dans une identité cohérente.<br/>Retrouvez ici les repères qui ont guidé son application.</p><button className="studio-recommendation-link" onClick={revisitRecommendation}><Check size={15}/><span>Base de l’identité : <strong>Signature</strong></span><ArrowDown size={14}/></button><small>Les aperçus ci-dessous conservent les inspirations de départ.</small></div></section>
      <div className="direction-tabs" role="tablist" aria-label="Choisir une direction artistique">{designDirections.map((item, index) => <button type="button" role="tab" key={item.id} id={`direction-tab-${item.id}`} ref={element => { tabs.current[index] = element; }} aria-selected={selected === item.id} aria-controls="direction-preview-panel" tabIndex={selected === item.id ? 0 : -1} className={`direction-tab ${selected === item.id ? "is-selected" : ""}`} onClick={() => choose(item.id)} onKeyDown={event => keyboard(event, index)}><span className="direction-tab-number">{item.number}</span><span className="direction-tab-copy"><strong>{item.name}</strong><small>{item.subtitle}</small></span><span className="direction-tab-colors" aria-hidden="true">{item.palette.slice(0,3).map(color => <span key={color.value} style={{ background: color.value }}/>)}</span>{item.recommended && <span className="direction-tab-recommended">BASE PRINCIPALE</span>}</button>)}</div>
      <div className="studio-workspace" ref={preview}>
        <section className="studio-preview-pane" aria-label="Aperçu interactif de la direction sélectionnée">
          <div className="studio-preview-toolbar"><span className="studio-preview-name"><i/>{direction.number} / {direction.name}</span><div className="studio-device-switch" role="group" aria-label="Format de l’aperçu"><button onClick={() => changeDevice("desktop")} aria-pressed={device === "desktop"} aria-label="Afficher l’aperçu large"><Monitor size={16}/><span>Large</span></button><button onClick={() => changeDevice("mobile")} aria-pressed={device === "mobile"} aria-label="Afficher l’aperçu mobile"><Smartphone size={15}/><span>Mobile</span></button></div><button className="studio-motion-toggle" onClick={() => setMotionWanted(value => !value)} disabled={reduced} aria-pressed={motionWanted && !reduced} aria-label={reduced ? "Animations réduites selon vos préférences système" : motionWanted ? "Mettre les animations de l’aperçu en pause" : "Animer l’aperçu"}>{motionWanted && !reduced ? <Pause size={14}/> : <Play size={14}/>}<span>{reduced ? "Mouvement réduit" : motionWanted ? "Animations" : "En pause"}</span></button></div>
          <div className="studio-preview-frame"><div className="studio-preview-chrome"><span className="studio-window-dots" aria-hidden="true"><i/><i/><i/></span><span>ayiffa · inspiration / direction {direction.number}</span><span className="studio-preview-badge">REPÈRES VISUELS</span></div><div className={`studio-preview-stage ${device === "mobile" ? "is-mobile" : ""}`}><div id="direction-preview-panel" role="tabpanel" aria-labelledby={`direction-tab-${selected}`} tabIndex={0} className="studio-preview-panel"><DirectionPreview direction={selected} device={device} animated={animated}/></div></div></div>
          <div className="studio-preview-caption"><span><Layers3 size={13}/>Les inspirations de départ</span><button onClick={share}><Copy size={13}/>Partager cet aperçu</button></div>
          {shareFallback && <label className="studio-share-fallback">Copiez le lien de cet aperçu<input readOnly value={shareFallback} autoFocus onFocus={event => event.currentTarget.select()}/></label>}
          <div className="studio-preview-note"><Info size={14}/><p>Les liens ouvrent le site appliqué. Les aperçus conservent les trois inspirations d’origine ; enregistrer un avis ne modifie pas automatiquement les pages publiques.</p></div>
          <div className="studio-concept-reasons"><div><h3>Le bon objectif</h3><p>{direction.idealFor}</p></div><div><h3>À garder en tête</h3><p>{direction.watchpoint}</p></div></div>
          <button className="studio-compare-button" onClick={() => { comparison.current?.showModal(); setComparing(true); }}><Columns3 size={18}/><span>Comparer les trois directions<small>Ambiance, lisibilité, mouvements et points d’attention.</small></span><ArrowUpRight size={18}/></button>
        </section>
        <aside className="studio-sidebar"><section className="direction-brief" aria-labelledby="direction-brief-title"><div className="direction-brief-top"><p className="studio-kicker">LES REPÈRES DE CETTE INSPIRATION</p>{direction.recommended && <span className="studio-recommended"><Check size={11}/>Base appliquée</span>}</div><h2 id="direction-brief-title">{direction.name}</h2><p className="direction-personality">{direction.personality}</p><p className="direction-description">{direction.description}</p><div className="direction-palette"><h3>La palette</h3><div>{direction.palette.map(color => <button key={color.value} onClick={() => copyColor(color.value, color.name)} aria-label={`Copier la couleur ${color.name} ${color.value}`}><span style={{ background: color.value }}/><strong>{color.name}</strong><small>{color.value}</small></button>)}</div></div><div className={`direction-typography type-${direction.id}`}><h3>La typographie</h3><span>{selected === "signature" ? "L’ailleurs." : selected === "terre-vivante" ? "LE VIVANT." : "L’essentiel."}</span><p>{direction.displayFont}<small>+ {direction.bodyFont} pour la lecture</small></p></div><div className="direction-movements"><h3>Le mouvement</h3><ul>{direction.movements.map(movement => <li key={movement}><Check size={12}/>{movement}</li>)}</ul></div><button className="direction-export" onClick={exportBrief} aria-label={`Exporter la fiche de ${direction.name}`}><Download size={14}/>Exporter la fiche<span>.TXT</span></button></section><DesignPreferenceForm direction={direction} onSelect={choose}/></aside>
      </div>
      <section className="studio-recommendation"><div className="studio-recommendation-copy"><p className="studio-kicker"><SunEmblem/>LA SIGNATURE DÉSORMAIS EN PLACE</p><h2>Signature.<br/><em>Vivante et claire.</em></h2><p><strong>Signature</strong> apporte l’immersion et l’élégance. <strong>Terre vivante</strong> donne la chaleur des accents et la place des rencontres. <strong>Ligne claire</strong> guide la recherche, les fiches et la demande de voyage.</p><Link href="/" className="studio-button studio-button-cream">Découvrir la version appliquée<ArrowUpRight size={17}/></Link></div><div className="studio-recommendation-points"><div><Camera size={23} strokeWidth={1.3}/><h3>Faire ressentir.</h3><p>Des images du Bénin, un film local et un rythme de découverte maîtrisé.</p></div><div><Compass size={23} strokeWidth={1.3}/><h3>Affirmer le vivant.</h3><p>Une présence culturelle, des portraits et des accents terracotta, sans surcharge.</p></div><div><MousePointer2 size={23} strokeWidth={1.3}/><h3>Faciliter le premier pas.</h3><p>Une recherche visible, des catalogues clairs et un formulaire structuré.</p></div></div><span className="studio-recommendation-number" aria-hidden="true">01</span></section>
      <footer className="studio-footer"><Link href="/" className="studio-back-link"><ArrowLeft size={14}/>Retour au site appliqué</Link><span>AYIFFA TOURISME · repères de l’identité, non indexés.</span><div><Link href="/credits">Crédits des images</Link><Link href="/confidentialite#preferences-design">Données & préférences</Link></div></footer>
    </div>
    <DesignComparison dialogRef={comparison} onSelect={choose} onClose={() => setComparing(false)}/>
    {toast && <div className="studio-toast" role="status"><Check size={15}/>{toast}</div>}
  </div>;
}
