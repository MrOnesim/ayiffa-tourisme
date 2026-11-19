"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, MapPin, Clock3, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Destination, Circuit } from "@/lib/content";
import { useContent } from "@/lib/use-content";
import { SunEmblem } from "./brand";
import { TiltFrame } from "./motion-primitives";

export function ButtonLink({href, children, variant = "dark", className = ""}: {href:string; children:ReactNode; variant?:"dark"|"lime"|"outline"|"light"|"terra"; className?:string}) {
  return <Link href={href} className={`button button-${variant} ${className}`}>{children}<ArrowUpRight size={18} strokeWidth={1.7} aria-hidden="true"/></Link>;
}
export function TextLink({href,children,className=""}:{href:string;children:ReactNode;className?:string}) {
  return <Link href={href} className={`text-link ${className}`}>{children}<ArrowUpRight size={18} aria-hidden="true"/></Link>;
}
export function SectionHeading({label,children,description,href,linkText}:{label:string;children:ReactNode;description?:string;href?:string;linkText?:string}) {
  return <div className="section-heading"><div><p className="eyebrow"><span/>{label}</p><h2>{children}</h2></div><div className="section-heading-aside">{description&&<p>{description}</p>}{href&&<TextLink href={href}>{linkText||"Tout découvrir"}</TextLink>}</div></div>;
}
export function DestinationCard({destination, index=0}:{destination:Destination;index?:number}) {
  return <TiltFrame><Link href={`/destinations/${destination.slug}`} className="destination-card">
    <Image src={destination.image} alt={destination.imageAlt} fill sizes="(max-width: 600px) 90vw, (max-width: 1000px) 46vw, 30vw"/>
    <div className="destination-shade"/>
    <span className="destination-tag">{destination.category}</span><span className="destination-index">0{index+1}</span>
    <div className="destination-card-bottom"><div><span className="location-label"><MapPin size={13}/>{destination.region}, Bénin</span><h3>{destination.name}</h3><p>{destination.tagline}</p></div><span className="round-arrow"><ArrowUpRight size={22} strokeWidth={1.4}/></span></div>
  </Link></TiltFrame>;
}
export function CircuitCard({circuit}:{circuit:Circuit}) {
  return <article className={`circuit-card card-lift`}><Link href={`/circuits/${circuit.slug}`} className="circuit-card-image" aria-label={`Voir le circuit ${circuit.name}`}><Image src={circuit.image} alt={circuit.alt} fill sizes="(max-width: 700px) 90vw, (max-width: 1000px) 45vw, 31vw"/><span className="duration-tag"><Clock3 size={13} aria-hidden="true"/>{circuit.duration}</span><span className="circuit-image-arrow"><ArrowUpRight size={23} aria-hidden="true"/></span></Link><div className="circuit-card-content"><p className="mini-label">{circuit.category}</p><h3><Link href={`/circuits/${circuit.slug}`}>{circuit.name}</Link></h3><p>{circuit.subtitle}</p><div className="circuit-card-footer"><span><MapPin size={13} aria-hidden="true"/>{circuit.location}<span className="dot" aria-hidden="true"/>Sur devis</span><Link href={`/circuits/${circuit.slug}`} aria-label={`Découvrir ${circuit.name}`}><ArrowRight size={19} aria-hidden="true"/></Link></div></div></article>;
}
export function Breadcrumbs({items,light=false}:{items:{label:string;href?:string}[];light?:boolean}) {
  return <nav aria-label="Fil d’Ariane" className={`breadcrumbs ${light?"breadcrumbs-light":""}`}><Link href="/">Accueil</Link>{items.map((item,index)=><span key={index}><ChevronRight size={11}/>{item.href?<Link href={item.href}>{item.label}</Link>:<span aria-current="page">{item.label}</span>}</span>)}</nav>;
}
export function PageIntro({label,title,description,children}:{label:string;title:ReactNode;description:string;children?:ReactNode}) {
  return <section className="page-intro"><div className="container"><SunEmblem className="page-intro-emblem"/><Breadcrumbs items={[{label}]}/><div className="page-intro-content"><div><p className="eyebrow"><span/>{label}</p><h1>{title}</h1></div><p className="page-intro-description">{description}</p></div>{children}</div></section>;
}
export function TravelCTA({compact=false}:{compact?:boolean}) {
  return <section className={`travel-cta ${compact?"travel-cta-compact":""}`}><Image src="/images/grand-popo.jpg" alt="Le littoral de Grand-Popo, entre plage, cocotiers et océan Atlantique" fill sizes="100vw"/><div className="travel-cta-shade"/><div className="container travel-cta-content"><SunEmblem/><p className="eyebrow">ET SI L’ON ÉCRIVAIT LA SUITE ENSEMBLE ?</p><h2>Votre prochain grand souvenir<br/><em>commence ici.</em></h2><p>Une envie, une idée, un rêve de Bénin. Parlons-en.</p><ButtonLink href="/contact" variant="terra">Parlons de votre voyage au Bénin</ButtonLink></div></section>;
}
export function FAQ({limit}:{limit?:number}) {
  const { faqs } = useContent();
  return <section className="faq-section container section" id="questions"><div><p className="eyebrow"><span/>AVANT LE DÉPART</p><h2>Vous vous demandez<br/><em>peut-être…</em></h2><p>Le voyage commence aussi<br/>par les bonnes questions.</p></div><div className="faq-list">{faqs.slice(0,limit).map((faq,index)=><details key={faq.question}><summary><span className="faq-number">0{index+1}</span>{faq.question}<span className="faq-plus">+</span></summary><p>{faq.answer}</p></details>)}</div></section>;
}
