import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock3, MapPin, Compass, Info } from "lucide-react";
import { circuits } from "@/lib/content";
import { Breadcrumbs, ButtonLink, CircuitCard, FAQ, SectionHeading } from "@/components/ui";
import { SunEmblem } from "@/components/brand";
import { EmLines } from "@/components/lines";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
import { getLocalizedContent } from "@/lib/content-locales";
export function generateStaticParams(){return circuits.map(c=>({slug:c.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const locale=await getServerLocale();
  const seo=getDictionary(locale).seo;
  const c=getLocalizedContent(locale).circuits.find(c=>c.slug===slug);
  if(!c)return{title:seo.circuitNotFound};
  return{title:c.name,description:c.description,alternates:{canonical:`/circuits/${slug}`},openGraph:{title:c.name,description:c.description,images:[{url:c.image,alt:c.alt}]}};
}
export default async function CircuitPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const locale = await getServerLocale();
  const ui = getDictionary(locale).ui;
  const localized = getLocalizedContent(locale);
  const circuit = localized.circuits.find(c=>c.slug===slug);
  if(!circuit)notFound();
  return <><section className="detail-hero circuit-hero"><Image src={circuit.image} alt={circuit.alt} fill sizes="100vw" preload/><div className="container"><Breadcrumbs light items={[{label:ui.circuitsNav,href:"/circuits"},{label:circuit.name}]}/><p className="eyebrow">{circuit.category}</p><h1>{circuit.name}</h1><p>{circuit.subtitle}</p></div></section><div className="container detail-layout"><div className="detail-body"><Link href="/circuits" className="back-link"><ArrowLeft size={15}/>{ui.backCircuits}</Link><div className="trip-facts"><span><Clock3 size={18}/>{circuit.duration}</span><span><MapPin size={18}/>{circuit.location}</span><span><Compass size={18}/>{ui.toPersonalize}</span></div><section><p className="eyebrow">{ui.spiritEyebrow}</p><h2><EmLines text={ui.spiritTitle}/></h2><p className="lead-text">{circuit.description}</p></section><section><h2>{ui.differenceTitle}</h2><ul className="highlight-list">{circuit.highlights.map(h=><li key={h}><Check size={17}/>{h}</li>)}</ul></section><section><p className="eyebrow">{ui.formationEyebrow}</p><h2>{circuit.days>1?ui.formationTitleLong:ui.formationTitleShort}</h2><div className="itinerary">{circuit.steps.map((step,index)=><div className="itinerary-step" key={step.title}><span>0{index+1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></div>)}</div></section><div className="notice"><Info size={19}/><p>{circuit.note}</p></div></div><aside className="planning-card"><SunEmblem/><p className="mini-label">{circuit.duration} · {circuit.location}</p><h2><EmLines text={ui.circuitPlanningTitle}/></h2><p>{ui.circuitPlanningText}</p><ButtonLink href={`/contact?circuit=${circuit.slug}`}>{ui.quoteButton}</ButtonLink><Link href={`/contact?circuit=${circuit.slug}&sujet=informations`} className="planning-secondary">{ui.discussButton}</Link><small>{ui.circuitOfferNote}</small></aside></div><section className="section section-sage"><div className="container"><SectionHeading label={ui.relatedCircuitsEyebrow} href="/circuits" linkText={ui.backCircuits}><>{ui.relatedCircuitsLead} <em>{ui.relatedCircuitsEm}</em></></SectionHeading><div className="circuit-grid">{localized.circuits.filter(c=>c.slug!==slug).slice(0,3).map(c=><CircuitCard key={c.slug} circuit={c}/>)}</div></div></section><FAQ limit={3}/></>;
}
