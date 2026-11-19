"use client";
import { Reveal } from "./reveal";
import { SectionHeading, CircuitCard } from "./ui";
import { useContent } from "@/lib/use-content";

export function HomeCircuits() {
  const { circuits } = useContent();
  return <section className="section section-sage home-circuits"><div className="container"><Reveal><SectionHeading label="DES VOYAGES QUI ONT UNE ÂME" href="/circuits" linkText="Explorer tous les voyages" description="Quelques idées pour commencer. La suite s'écrit avec vous.">Laissez-vous guider.<br/><em>Gardez votre liberté.</em></SectionHeading></Reveal><div className="circuit-grid">{circuits.slice(0,3).map((circuit,index) => <Reveal key={circuit.slug} delay={index * 80}><CircuitCard circuit={circuit}/></Reveal>)}</div><p className="section-footnote">Chaque programme et chaque tarif sont confirmés dans un devis personnalisé.</p></div></section>;
}