import type { Metadata } from "next";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { PageIntro, TextLink, SectionHeading, TravelCTA } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { EmLines } from "@/components/lines";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
import { getPageMetadata } from "@/lib/page-metadata";
export async function generateMetadata(): Promise<Metadata> { return getPageMetadata(await getServerLocale(), "about", "/a-propos"); }
export default async function AboutPage() {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  const t = dict.pages.about;
  const ui = dict.ui;
  return <><PageIntro label={t.label} title={t.titleH1} description={t.description}/><section className="container section editorial-split"><Reveal className="editorial-image"><Image src="/images/ouidah vu du ciel 1.jpeg" alt={ui.storyImageAlt1} fill sizes="(max-width: 700px) 100vw, 45vw"/><span><MapPin size={14}/>{ui.aboutPlace}</span></Reveal><Reveal className="editorial-copy"><p className="eyebrow">{ui.aboutEyebrow}</p><h2><EmLines text={ui.aboutTitle}/></h2><p>{ui.aboutP1}</p><p>{ui.aboutP2}</p><p>{ui.aboutP3}</p><TextLink href="/contact">{ui.aboutLink}</TextLink></Reveal></section><section className="statement-section"><div className="container"><p className="eyebrow">{ui.statementEyebrow}</p><h2><EmLines text={ui.statementTitle}/></h2><p>{ui.statementText}</p></div></section><section className="section container"><Reveal><SectionHeading label={ui.valuesLabel}><>{ui.valuesTitleLead} <em>{ui.valuesTitleEm}</em></></SectionHeading></Reveal></section><TravelCTA/></>;
}
