import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, CalendarDays, MapPin, Info } from "lucide-react";
import { destinations } from "@/lib/content";
import { Breadcrumbs, ButtonLink, DestinationCard, SectionHeading, FAQ } from "@/components/ui";
import { SunEmblem } from "@/components/brand";
import { EmLines } from "@/components/lines";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
import { getLocalizedContent } from "@/lib/content-locales";
export function generateStaticParams(){return destinations.map(d=>({slug:d.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const locale=await getServerLocale();
  const seo=getDictionary(locale).seo;
  const d=getLocalizedContent(locale).destinations.find(d=>d.slug===slug);
  if(!d)return{title:seo.destinationNotFound};
  return{title:`${d.name} : ${seo.destinationSuffix}`,description:d.intro,alternates:{canonical:`/destinations/${slug}`},openGraph:{title:`${d.name} : AYIFFA TOURISME`,description:d.intro,images:[{url:d.image,alt:d.imageAlt}]}};
}
export default async function DestinationPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const locale = await getServerLocale();
  const ui = getDictionary(locale).ui;
  const localized = getLocalizedContent(locale);
  const destination = localized.destinations.find(d=>d.slug===slug);
  if(!destination)notFound();
  return <><section className="detail-hero"><Image src={destination.image} alt={destination.imageAlt} fill sizes="100vw" preload/><div className="container"><Breadcrumbs light items={[{label:ui.destinationsNav,href:"/destinations"},{label:destination.name}]}/><p className="eyebrow"><MapPin size={14}/>{destination.region} · {ui.benin.toUpperCase()}</p><h1>{destination.name}</h1><p>{destination.tagline}</p></div></section><div className="container detail-layout"><div className="detail-body"><Link href="/destinations" className="back-link"><ArrowLeft size={15}/>{ui.backDestinations}</Link><section><p className="eyebrow">{ui.invitationEyebrow}</p><h2><EmLines text={ui.invitationTitle}/></h2><p className="lead-text">{destination.intro}</p><p>{destination.story}</p>{destination.imageNote&&<div className="photo-note">{destination.imageNote}</div>}</section><section><p className="eyebrow">{ui.seeEyebrow}</p><h2>{ui.seeTitle}</h2><ul className="highlight-list">{destination.highlights.map(h=><li key={h}><Check size={17} strokeWidth={1.5}/>{h}</li>)}</ul></section><section><p className="eyebrow"><CalendarDays size={15}/>{ui.practicalEyebrow}</p><h2>{ui.practicalTitle}</h2><p>{ui.practicalText}</p></section><div className="notice"><Info size={18}/><p>{ui.detailNotice}</p></div></div><aside className="planning-card"><SunEmblem/><p className="mini-label">{ui.planningEyebrow}</p><h2>{destination.name},<br/><em>{ui.planningTitle}</em></h2><p>{ui.planningText}</p><ButtonLink href={`/contact?destination=${destination.slug}`}>{ui.planStay}</ButtonLink><Link className="planning-secondary" href={`/contact?destination=${destination.slug}&sujet=informations`}>{ui.detailQuestion}</Link><small>{ui.noObligation}<br/>{ui.quoteOnRequest}</small></aside></div><section className="section related-section"><div className="container"><SectionHeading label={ui.relatedDestinationsEyebrow} href="/destinations" linkText={ui.backDestinations}><>{ui.relatedDestinationsLead} <em>{ui.relatedDestinationsEm}</em></></SectionHeading><div className="destination-grid">{localized.destinations.filter(d=>d.slug!==slug).slice(0,3).map((d,i)=><DestinationCard key={d.slug} destination={d} index={i}/>)}</div></div></section><FAQ limit={3}/></>;
}
