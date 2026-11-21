import type { Metadata } from "next";
import { MapPinned, HeartHandshake, Leaf, Route } from "lucide-react";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading, TravelCTA } from "@/components/ui";
import { ExperienceShowcase } from "@/components/experience-showcase";
import { DestinationFan } from "@/components/destination-fan";
import { Gallery } from "@/components/gallery";
import { EarthStory } from "@/components/earth-story";
import { HomeCircuits } from "@/components/home-circuits";
import { TripDiscovery } from "@/components/trip-discovery";
import { LivingAtlas } from "@/components/living-atlas";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  const t = dict.pages.home;
  return <>
    <Hero/>
    <div className="container trust-strip"><span><MapPinned size={19} strokeWidth={1.35}/>{t.trustLocal}</span><span><Route size={19} strokeWidth={1.35}/>{t.trustCustom}</span><span><HeartHandshake size={20} strokeWidth={1.35}/>{t.trustAuthentic}</span><span><Leaf size={19} strokeWidth={1.35}/>{t.trustSlow}</span></div>
    <TripDiscovery/>
    <LivingAtlas/>
    <section className="section container home-destinations home-departures" id="decouvrir"><Reveal className="departure-heading" variant="soft"><p className="eyebrow">{t.destinationsEyebrow}</p><h2>{t.destinationsTitle}</h2><p>{t.destinationsSubtitle}</p></Reveal><DestinationFan/></section>
    <HomeCircuits/>
    <ExperienceShowcase/>
    <EarthStory/>
    <section className="section container home-gallery"><Reveal><SectionHeading label={t.galleryEyebrow} href="/galerie" linkText={dict.ui.galleryOpenLink}>{t.galleryTitle}</SectionHeading></Reveal><Gallery/></section>
    <TravelCTA/>
  </>;
}
