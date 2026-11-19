"use client";
import { Reveal } from "./reveal";
import { SectionHeading, CircuitCard } from "./ui";
import { useContent } from "@/lib/use-content";
import { useLocale } from "@/components/locale-provider";
import { getDictionary } from "@/lib/get-dictionary";

export function HomeCircuits() {
  const { circuits } = useContent();
  const { locale } = useLocale();
  const t = getDictionary(locale).pages.home;
  return <section className="section section-sage home-circuits"><div className="container"><Reveal><SectionHeading label={t.circuitsEyebrow} href="/circuits" linkText={t.circuitsLink ?? "Voir tous les voyages"} description={t.circuitsSubtitle}>{t.circuitsTitle}</SectionHeading></Reveal><div className="circuit-grid">{circuits.slice(0,2).map((circuit,index) => <Reveal key={circuit.slug} delay={index * 80}><CircuitCard circuit={circuit}/></Reveal>)}</div><p className="section-footnote">{t.circuitsFootnote}</p></div></section>;
}