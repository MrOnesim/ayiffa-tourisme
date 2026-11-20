import type { Metadata } from "next";
import { Compass, Ship, SlidersHorizontal, Users } from "lucide-react";
import { PageIntro, TextLink, FAQ, TravelCTA } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
import { getPageMetadata } from "@/lib/page-metadata";
export async function generateMetadata(): Promise<Metadata> { return getPageMetadata(await getServerLocale(), "services", "/services"); }
const serviceLinks = [
  { Icon: Compass, href: "/destinations/ouidah" },
  { Icon: Ship, href: "/circuits/gogotinkpon" },
  { Icon: SlidersHorizontal, href: "/contact" },
  { Icon: Users, href: "/contact" },
];
export default async function ServicesPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale).pages.services;
  return <><PageIntro label={t.label} title={t.titleH1} description={t.description}/><div className="container service-list">{serviceLinks.map(({ Icon, href }, index) => { const item = t.items[index]; return <Reveal key={item.label}><article className="service-row"><div className="service-icon"><Icon size={29} strokeWidth={1.2}/></div><div><p className="mini-label">{item.label}</p><h2>{item.title}</h2></div><div><p>{item.text}</p><TextLink href={href}>{item.link}</TextLink></div></article></Reveal>; })}</div><FAQ limit={4}/><TravelCTA compact/></>;
}