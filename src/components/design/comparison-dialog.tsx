"use client";

import { type RefObject } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { DesignDirectionId } from "@/lib/design-directions";
import { useLocale } from "@/components/locale-provider";
import { getLocalizedDesignDirections } from "@/lib/design-directions-locales";

export function DesignComparison({ dialogRef, onSelect, onClose }: { dialogRef: RefObject<HTMLDialogElement | null>; onSelect: (id: DesignDirectionId) => void; onClose: () => void }) {
  const { locale, t } = useLocale();
  const studio = t.studio;
  const directions = getLocalizedDesignDirections(locale);
  const rows = [
    { label: studio.impression, field: "personality" },
    { label: studio.composition, field: "composition" },
    { label: studio.typography, field: "typography" },
    { label: studio.idealFor, field: "idealFor" },
    { label: studio.watchpoint, field: "watchpoint" },
  ] as const;
  return <dialog className="design-comparison-dialog" ref={dialogRef} aria-labelledby="comparison-title" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
    <div className="comparison-top"><div><p className="studio-kicker">{studio.compareKicker}</p><h2 id="comparison-title">{studio.compareTitle}</h2></div><button className="studio-icon-button" onClick={() => dialogRef.current?.close()} aria-label={studio.compareClose}><X size={21}/></button></div>
    <p className="comparison-intro">{studio.compareIntro}</p>
    <p className="comparison-mobile-hint">{studio.compareMobileHint}</p>
    <div className="comparison-scroll"><table className="design-comparison-table"><thead><tr><th scope="col">{studio.compareCriteria}</th>{directions.map(direction => <th key={direction.id} scope="col"><span className="comparison-number">{direction.number}</span><strong>{direction.name}</strong><span className="comparison-subtitle">{direction.subtitle}</span>{direction.recommended && <span className="studio-recommended">{studio.baseIdentityName}</span>}</th>)}</tr></thead><tbody><tr><th scope="row">{studio.comparePalette}</th>{directions.map(direction => <td key={direction.id}><div className="comparison-palette">{direction.palette.map(color => <span key={color.value} style={{ background: color.value }} title={`${color.name} · ${color.value}`} aria-label={`${color.name} ${color.value}`}/>)}</div></td>)}</tr>{rows.map(row => <tr key={row.field}><th scope="row">{row.label}</th>{directions.map(direction => <td key={direction.id}>{direction[row.field]}</td>)}</tr>)}<tr><th scope="row">{studio.compareDiscover}</th>{directions.map(direction => <td key={direction.id}><button className="comparison-select" onClick={() => { onSelect(direction.id); dialogRef.current?.close(); }}>{studio.compareView} {direction.name}<ArrowUpRight size={15}/></button></td>)}</tr></tbody></table></div>
    <p className="comparison-disclaimer">{studio.compareDisclaimer}</p>
  </dialog>;
}
