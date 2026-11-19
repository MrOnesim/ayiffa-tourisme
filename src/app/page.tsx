import type { Metadata } from "next";
import { MapPinned, HeartHandshake, Leaf, Route, SlidersHorizontal, MessagesSquare } from "lucide-react";
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
    <section className="section container trust-badges" id="confiance"><Reveal variant="soft"><p className="eyebrow"><span/>UN PROJET, EN TOUTE CLARTÉ</p><h2>Préparons votre séjour ensemble</h2><p>Nous précisons avec vous le programme, les prestations, le tarif et les conditions avant toute réservation.</p></Reveal>
      <div className="badges-grid">
        <article className="badge"><MapPinned size={20} strokeWidth={1.4} aria-hidden="true"/><div><h3>Un point de départ local</h3><p>AYIFFA TOURISME est ancrée à Ouidah et propose de découvrir les lieux du Bénin.</p></div></article>
        <article className="badge"><SlidersHorizontal size={20} strokeWidth={1.4} aria-hidden="true"/><div><h3>Un itinéraire à votre mesure</h3><p>Partagez vos envies et votre rythme pour définir ensemble les étapes du séjour.</p></div></article>
        <article className="badge"><MessagesSquare size={20} strokeWidth={1.4} aria-hidden="true"/><div><h3>Des conditions expliquées</h3><p>Le devis et les modalités sont à confirmer directement avec l’agence avant tout engagement.</p></div></article>
      </div>
    </section>
    <TravelCTA/>
  </>;
}
