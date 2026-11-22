"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { Reveal } from "./reveal";
import { useLocale } from "./locale-provider";

export function CircuitCompare() {
  const { circuits } = useContent();
  const { t } = useLocale();
  const ui = t.ui;
  const formats = circuits.filter(circuit => circuit.days >= 8).sort((a, b) => a.days - b.days);
  const title = ui.compareTitle.split("\n");

  return (
    <section className="section circuit-compare" aria-labelledby="compare-title">
      <div className="container">
        <Reveal>
          <div className="compare-heading">
            <div><p className="eyebrow">{ui.compareEyebrow}</p><h2 id="compare-title">{title[0]}<br/><em>{title[1]}</em></h2></div>
            <p>{ui.compareIntro}</p>
          </div>
        </Reveal>
        <div className="compare-grid">
          {formats.map(circuit => <article className="compare-column" key={circuit.slug}>
            <header><span>{circuit.duration}</span><h3>{circuit.name}</h3></header>
            <dl>
              <div><dt>{ui.compareRhythm}</dt><dd>{circuit.subtitle}</dd></div>
              <div><dt>{ui.compareStops}</dt><dd>{circuit.highlights[1]}</dd></div>
            </dl>
            <Link href={`/contact?circuit=${circuit.slug}`} className="button button-terra compare-choose">{ui.compareChoose}<ArrowUpRight size={16}/></Link>
          </article>)}
        </div>
        <p className="compare-note">{ui.compareIncludedNote}</p>
      </div>
    </section>
  );
}
