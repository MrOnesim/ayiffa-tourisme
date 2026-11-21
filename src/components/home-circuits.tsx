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
  const featured = circuits.filter(circuit => circuit.days >= 8).sort((a, b) => a.days - b.days).slice(0, 4);
  return <section className="section section-sage home-circuits"><div className="container"><Reveal><SectionHeading label={t.circuitsEyebrow} href="/circuits" linkText={t.circuitsLink} description={t.circuitsSubtitle}>{t.circuitsTitle}</SectionHeading></Reveal><div className="circuit-grid">{featured.map((circuit,index) => <Reveal key={circuit.slug} delay={index * 80}><CircuitCard circuit={circuit}/></Reveal>)}</div><p className="section-footnote">{t.circuitsFootnote}</p></div></section>;
}