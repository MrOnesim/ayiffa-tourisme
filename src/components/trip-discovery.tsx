"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Compass, MapPin, Users } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { useLocale } from "@/components/locale-provider";
import { getDictionary } from "@/lib/get-dictionary";

// Use the localized categories themselves as option values so the query string
// always matches the destinations catalogue, whatever the active language.
const interestSlugs = ["ouidah", "ganvie", "grand-popo"] as const;

const shortcutImages = [
  { src: "/images/ville ouidah vu du ciel.jpeg", altKey: "galleryAlt1" },
  { src: "/images/ganvie vu du ciel.jpeg", altKey: "galleryAlt2" },
  { src: "/images/deux voi vu du ciel.jpeg", altKey: "galleryAlt3" },
] as const;

export function TripDiscovery() {
  const { destinations } = useContent();
  const { locale } = useLocale();
  const dictionary = getDictionary(locale);
  const t = dictionary.pages.home.discovery;
  const ui = dictionary.ui;
  const interests = interestSlugs
    .map(slug => destinations.find(destination => destination.slug === slug)?.category)
    .filter((category): category is string => Boolean(category))
    .map(category => ({ value: category, label: category }));

  const shortcutCards = interestSlugs.flatMap((slug, index) => {
    const destination = destinations.find(item => item.slug === slug);
    if (!destination) return [];
    return [{
      key: slug,
      href: `/destinations?envie=${encodeURIComponent(destination.category)}`,
      label: destination.name,
      image: shortcutImages[index].src,
      alt: ui[shortcutImages[index].altKey],
    }];
  });

  return <section className="container discovery-container signature-discovery" aria-labelledby="discovery-title">
    <div className="discovery-heading"><div><Compass size={18} strokeWidth={1.4}/><h2 id="discovery-title">{t.title}</h2></div><Link href="/contact">{t.link}<ArrowUpRight size={15}/></Link></div>
    <form action="/destinations" className="discovery-bar" aria-label={t.title}>
      <label className="discovery-field">
        <span className="discovery-stamp" aria-hidden="true"><MapPin size={18} strokeWidth={1.5}/></span>
        <span className="discovery-field-copy"><span className="field-caption">{t.destinationLabel}</span><span className="select-wrapper"><select name="destination" defaultValue="" aria-label={t.destinationLabel}><option value="">{t.destinationPlaceholder}</option>{destinations.map(destination => <option value={destination.slug} key={destination.slug}>{destination.name}</option>)}</select><ChevronDown size={15}/></span></span>
      </label>
      <label className="discovery-field">
        <span className="discovery-stamp" aria-hidden="true"><Compass size={18} strokeWidth={1.5}/></span>
        <span className="discovery-field-copy"><span className="field-caption">{t.styleLabel}</span><span className="select-wrapper"><select name="envie" defaultValue="" aria-label={t.styleLabel}><option value="">{t.stylePlaceholder}</option>{interests.map(interest => <option key={interest.value} value={interest.value}>{interest.label}</option>)}</select><ChevronDown size={15}/></span></span>
      </label>
      <label className="discovery-field discovery-travellers">
        <span className="discovery-stamp" aria-hidden="true"><Users size={18} strokeWidth={1.5}/></span>
        <span className="discovery-field-copy"><span className="field-caption">{t.travellersLabel}</span><span className="select-wrapper"><select name="voyageurs" defaultValue="2" aria-label={t.travellersLabel}>{[1,2,3,4,5,6,7,8].map(number => <option key={number} value={number}>{number} {t.travellerUnit}{number > 1 ? t.travellerPlural : ""}</option>)}</select><ChevronDown size={15}/></span></span>
      </label>
      <button type="submit" className="button button-terra">{t.submit}<ArrowUpRight size={19}/></button>
    </form>
    <div className="discovery-shortcuts" aria-label={t.shortcutLabel}>
      <span>{t.shortcutLabel}</span>
      <div className="shortcut-cards">
        {shortcutCards.map(card => <Link key={card.key} href={card.href} className="shortcut-card"><Image src={card.image} alt={card.alt} fill sizes="(max-width: 480px) 100vw, 33vw"/><span className="shortcut-card-shade" aria-hidden="true"/><span className="shortcut-card-label">{card.label}<ArrowUpRight size={13} aria-hidden="true"/></span></Link>)}
      </div>
    </div>
  </section>;
}
