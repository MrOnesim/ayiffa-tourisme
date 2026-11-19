"use client";

import { type RefObject } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { designDirections, type DesignDirectionId } from "@/lib/design-directions";

export function DesignComparison({ dialogRef, onSelect, onClose }: { dialogRef: RefObject<HTMLDialogElement | null>; onSelect: (id: DesignDirectionId) => void; onClose: () => void }) {
  const rows = [
    { label: "L’impression", field: "personality" },
    { label: "La composition", field: "composition" },
    { label: "La typographie", field: "typography" },
    { label: "Le meilleur usage", field: "idealFor" },
    { label: "Le point d’attention", field: "watchpoint" },
  ] as const;
  return <dialog className="design-comparison-dialog" ref={dialogRef} aria-labelledby="comparison-title" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
    <div className="comparison-top"><div><p className="studio-kicker">CHOISIR UNE INTENTION, PAS SEULEMENT UNE COULEUR.</p><h2 id="comparison-title">Trois regards sur le Bénin.</h2></div><button className="studio-icon-button" onClick={() => dialogRef.current?.close()} aria-label="Fermer la comparaison"><X size={21}/></button></div>
    <p className="comparison-intro">Aucune piste n’est « meilleure » dans l’absolu : chacune met une priorité différente au premier plan.</p>
    <p className="comparison-mobile-hint">Faites glisser le tableau pour comparer les trois pistes.</p>
    <div className="comparison-scroll"><table className="design-comparison-table"><thead><tr><th scope="col">Les repères</th>{designDirections.map(direction => <th key={direction.id} scope="col"><span className="comparison-number">{direction.number}</span><strong>{direction.name}</strong><span className="comparison-subtitle">{direction.subtitle}</span>{direction.recommended && <span className="studio-recommended">Base de l’identité</span>}</th>)}</tr></thead><tbody><tr><th scope="row">La palette</th>{designDirections.map(direction => <td key={direction.id}><div className="comparison-palette">{direction.palette.map(color => <span key={color.value} style={{ background: color.value }} title={`${color.name} · ${color.value}`} aria-label={`${color.name} ${color.value}`}/>)}</div></td>)}</tr>{rows.map(row => <tr key={row.field}><th scope="row">{row.label}</th>{designDirections.map(direction => <td key={direction.id}>{direction[row.field]}</td>)}</tr>)}<tr><th scope="row">Découvrir</th>{designDirections.map(direction => <td key={direction.id}><button className="comparison-select" onClick={() => { onSelect(direction.id); dialogRef.current?.close(); }}>Voir {direction.name}<ArrowUpRight size={15}/></button></td>)}</tr></tbody></table></div>
    <p className="comparison-disclaimer">Ces repères sont des recommandations de conception, pas des résultats mesurés ni des promesses de conversion.</p>
  </dialog>;
}
