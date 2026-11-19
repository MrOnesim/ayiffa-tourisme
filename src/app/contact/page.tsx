import type { Metadata } from "next";
import { Mail, MessageCircle, MapPin, Phone, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { PageIntro, TravelCTA } from "@/components/ui";
import { TravelForm } from "@/components/travel-form";
import { site } from "@/lib/content";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
export const metadata: Metadata = { title: "Contact : Parlons de votre voyage", description: "Contactez AYIFFA TOURISME pour préparer votre séjour au Bénin. Formulaire de demande, e-mail et WhatsApp.", alternates: { canonical: "/contact" } };
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ destination?: string; voyageurs?: string; startDate?: string }> }) {
  const params = await searchParams;
  const locale = await getServerLocale();
  const t = getDictionary(locale).pages.contact;
  const parsedStartDate = typeof params.startDate === "string" ? new Date(`${params.startDate}T12:00:00Z`) : new Date(Number.NaN);
  const startDate = typeof params.startDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(params.startDate) && !Number.isNaN(parsedStartDate.getTime()) && parsedStartDate.toISOString().slice(0, 10) === params.startDate && params.startDate >= new Date().toISOString().slice(0, 10) ? params.startDate : "";
  const travellers = typeof params.voyageurs === "string" && /^\d+$/.test(params.voyageurs) ? Number(params.voyageurs) : 2;
  return <><PageIntro label={t.label} title={t.titleH1} description={t.description}/><div className="container contact-layout"><aside className="contact-aside"><p className="eyebrow">UNE ÉQUIPE, UNE CONVERSATION</p><h2>Le Bénin vous attend.<br/><em>Parlons-en.</em></h2><p>Vos dates, vos envies, les personnes qui vous accompagnent… Prenons le temps d’imaginer un voyage à votre image.</p><div className="contact-methods"><div className="contact-method"><Mail size={20} strokeWidth={1.4}/><div><span>Écrivez-nous</span><a href={`mailto:${site.email}`}>{site.email}</a></div></div><div className="contact-method"><Phone size={20} strokeWidth={1.4}/><div><span>Appelez-nous</span><a href={`tel:${site.phoneHref}`}>{site.phone}</a></div></div><div className="contact-method"><MapPin size={21} strokeWidth={1.4}/><div><span>Notre point d’ancrage</span><p>{site.address}</p></div></div></div><a className="button button-dark" href={site.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/>Échanger sur WhatsApp<ArrowUpRight size={17}/></a><small>Numéro public adapté au format béninois à dix chiffres. L’activation de WhatsApp est à confirmer ; l’e-mail reste une autre possibilité de contact.</small><div className="contact-photo"><Image src="/images/ganvie.jpg" alt="Une pirogue à voile sur le lac Nokoué, Bénin" fill sizes="(max-width: 700px) 100vw, 35vw"/></div><div className="contact-next-steps"><p className="mini-label">UN PREMIER PAS, EN TOUTE CLARTÉ</p><ol><li><span>01</span>Préparez votre projet dans le formulaire.</li><li><span>02</span>Transmettez votre récapitulatif à l’agence.</li><li><span>03</span>Confirmez votre programme et votre devis ensemble.</li></ol></div></aside><TravelForm initialDestination={typeof params.destination === "string" ? params.destination : ""} initialCircuit="" initialTravellers={travellers} initialStartDate={startDate}/></div></>;
}