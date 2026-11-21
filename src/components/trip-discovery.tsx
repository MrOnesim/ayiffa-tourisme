"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown, Compass, MapPin, Users } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { useLocale } from "@/components/locale-provider";
import { getDictionary } from "@/lib/get-dictionary";

// Use the localized categories themselves as option values so the query string
// always matches the destinations catalogue, whatever the active language.
const interestSlugs = ["ouidah", "ganvie", "grand-popo"] as const;

export function TripDiscovery() {
  const { destinations } = useContent();
  const { locale } = useLocale();
  const t = getDictionary(locale).pages.home.discovery;
  const interests = interestSlugs
    .map(slug => destinations.find(destination => destination.slug === slug)?.category)
    .filter((category): category is string => Boolean(category))
    .map(category => ({ value: category, label: category }));
  return <section className="container discovery-container signature-discovery" aria-labelledby="discovery-title">
    <div className="discovery-heading"><div><Compass size={18} strokeWidth={1.4}/><h2 id="discovery-title">{t.title}</h2></div><Link href="/contact">{t.link}<ArrowUpRight size={15}/></Link></div>
    <form action="/destinations" className="discovery-bar" aria-label={t.title}>
      <label className="discovery-field"><MapPin size={21} strokeWidth={1.4}/><span><span className="field-caption">{t.destinationLabel}</span><span className="select-wrapper"><select name="destination" defaultValue="" aria-label={t.destinationLabel}><option value="">{t.destinationPlaceholder}</option>{destinations.map(destination => <option value={destination.slug} key={destination.slug}>{destination.name}</option>)}</select><ChevronDown size={15}/></span></span></label>
      <label className="discovery-field"><Compass size={22} strokeWidth={1.4}/><span><span className="field-caption">{t.styleLabel}</span><span className="select-wrapper"><select name="envie" defaultValue="" aria-label={t.styleLabel}><option value="">{t.stylePlaceholder}</option>{interests.map(interest => <option key={interest.value} value={interest.value}>{interest.label}</option>)}</select><ChevronDown size={15}/></span></span></label>
      <label className="discovery-field discovery-travellers"><Users size={22} strokeWidth={1.4}/><span><span className="field-caption">{t.travellersLabel}</span><span className="select-wrapper"><select name="voyageurs" defaultValue="2" aria-label={t.travellersLabel}>{[1,2,3,4,5,6,7,8].map(number => <option key={number} value={number}>{number} {t.travellerUnit}{number > 1 ? t.travellerPlural : ""}</option>)}</select><ChevronDown size={15}/></span></span></label>
      <button type="submit" className="button button-terra">{t.submit}<ArrowUpRight size={19}/></button>
    </form>
  </section>;
}
