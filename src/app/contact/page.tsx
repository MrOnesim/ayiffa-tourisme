import type { Metadata } from "next";
import { Mail, MessageCircle, MapPin, Phone, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { PageIntro, TravelCTA } from "@/components/ui";
import { TravelForm } from "@/components/travel-form";
import { site } from "@/lib/content";
import { EmLines } from "@/components/lines";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
import { getPageMetadata } from "@/lib/page-metadata";
export async function generateMetadata(): Promise<Metadata> { return getPageMetadata(await getServerLocale(), "contact", "/contact"); }
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ destination?: string; voyageurs?: string; startDate?: string }> }) {
  const params = await searchParams;
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  const t = dict.pages.contact;
  const ui = dict.ui;
  const parsedStartDate = typeof params.startDate === "string" ? new Date(`${params.startDate}T12:00:00Z`) : new Date(Number.NaN);
  const startDate = typeof params.startDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(params.startDate) && !Number.isNaN(parsedStartDate.getTime()) && parsedStartDate.toISOString().slice(0, 10) === params.startDate && params.startDate >= new Date().toISOString().slice(0, 10) ? params.startDate : "";
  const travellers = typeof params.voyageurs === "string" && /^\d+$/.test(params.voyageurs) ? Number(params.voyageurs) : 2;
  return <><PageIntro label={t.label} title={t.titleH1} description={t.description}/><div className="container contact-layout"><aside className="contact-aside"><p className="eyebrow">{ui.contactEyebrow}</p><h2><EmLines text={ui.contactTitle}/></h2><p>{ui.contactIntro}</p><div className="contact-methods"><div className="contact-method"><Mail size={20} strokeWidth={1.4}/><div><span>{ui.writeUs}</span><a href={`mailto:${site.email}`}>{site.email}</a></div></div><div className="contact-method"><Phone size={20} strokeWidth={1.4}/><div><span>{ui.callUs}</span><a href={`tel:${site.phoneHref}`}>{site.phone}</a></div></div><div className="contact-method"><MapPin size={21} strokeWidth={1.4}/><div><span>{ui.ourBase}</span><p>{site.address}</p></div></div></div><a className="button button-dark" href={site.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/>{ui.whatsappContact}<ArrowUpRight size={17}/></a><small>{ui.whatsappNote}</small><div className="contact-photo"><Image src="/images/ganvie vu du ciel.jpeg" alt={ui.contactPhotoAlt} fill sizes="(max-width: 700px) 100vw, 35vw"/></div><div className="contact-next-steps"><p className="mini-label">{ui.stepsEyebrow}</p><ol><li><span>01</span>{ui.stepPrepare}</li><li><span>02</span>{ui.stepSend}</li><li><span>03</span>{ui.stepConfirm}</li></ol></div></aside><TravelForm initialDestination={typeof params.destination === "string" ? params.destination : ""} initialCircuit="" initialTravellers={travellers} initialStartDate={startDate}/></div></>;
}
