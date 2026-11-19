import type { Metadata } from "next";
import { MapPinned, HeartHandshake, Leaf, Route, SlidersHorizontal, MessagesSquare, Quote, ArrowUpRight, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading, CircuitCard, TravelCTA } from "@/components/ui";
import { ExperienceShowcase } from "@/components/experience-showcase";
import { DestinationFan } from "@/components/destination-fan";
import { Gallery } from "@/components/gallery";
import { FilmSection } from "@/components/film-section";
import { Testimonials } from "@/components/testimonials";
import { EmotionRibbon } from "@/components/motion-primitives";
import { EarthStory } from "@/components/earth-story";
import { LivingAtlas } from "@/components/living-atlas";
import { site } from "@/lib/content";
import { HomeCircuits } from "@/components/home-circuits";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const locale = await getServerLocale();
  const t = getDictionary(locale).pages.home;
  const promises = [
    { Icon: MapPinned, title: t.trustLocal, text: "" },
    { Icon: SlidersHorizontal, title: t.trustCustom, text: "" },
    { Icon: HeartHandshake, title: t.trustAuthentic, text: "" },
    { Icon: Leaf, title: t.trustSlow, text: "" },
  ];
  return <>
    <Hero/>
    <div className="container trust-strip"><span><MapPinned size={19} strokeWidth={1.35}/>{t.trustLocal}</span><span><Route size={19} strokeWidth={1.35}/>{t.trustCustom}</span><span><HeartHandshake size={20} strokeWidth={1.35}/>{t.trustAuthentic}</span><span><Leaf size={19} strokeWidth={1.35}/>{t.trustSlow}</span></div>
    <LivingAtlas/>
    <section className="section container home-destinations home-departures" id="decouvrir"><Reveal className="departure-heading" variant="soft"><p className="eyebrow"><span/>{t.destinationsEyebrow}<span/></p><h2>{t.destinationsTitle}</h2><p>{t.destinationsSubtitle}</p></Reveal><DestinationFan/></section>
    <ExperienceShowcase/>
    <EmotionRibbon/>
    <FilmSection/>
    <EarthStory/>
    <HomeCircuits/>
    <section className="section container why-section"><Reveal><SectionHeading label={t.promisesEyebrow}>{t.promisesTitle}</SectionHeading></Reveal><div className="promise-grid">{promises.map(({Icon,title},index) => <Reveal key={title} delay={index * 70}><div className="promise"><Icon size={32} strokeWidth={1.15}/><span className="promise-number">0{index + 1}</span><h3>{title}</h3></div></Reveal>)}</div></section>
    <section className="section container home-gallery"><Reveal><SectionHeading label={t.galleryEyebrow} href="/galerie" linkText="Ouvrir le carnet d’images">{t.galleryTitle}</SectionHeading></Reveal><Gallery/></section>
    <Testimonials/>
    <section className="section container trust-badges" id="confiance"><Reveal variant="soft"><p className="eyebrow"><span/>VOTRE SÉRÉNITÉ, NOTRE PRIORITÉ</p><h2>Voyagez l’esprit tranquille</h2><p>Chaque réservation est accompagnée de garanties concrètes, pour que votre voyage au Bénin se déroule sans imprévu.</p></Reveal>
      <div className="badges-grid">
        <article className="badge"><ShieldCheck size={20} strokeWidth={1.4}/><div><h3>Paiement sécurisé</h3><p>Transactions protégées par cryptage SSL, partenaire bancaire béninois de confiance.</p></div></article>
        <article className="badge"><Clock size={20} strokeWidth={1.4}/><div><h3>Annulation flexible</h3><p>Modifiez ou annulez votre réservation jusqu’à 15 jours avant le départ, sans frais.</p></div></article>
        <article className="badge"><Sparkles size={20} strokeWidth={1.4}/><div><h3>Guide local certifié</h3><p>Tous nos accompagnateurs sont des guides officiels du patrimoine béninois, formés et passionnés.</p></div></article>
      </div>
    </section>
    <TravelCTA/>
  </>;
}
