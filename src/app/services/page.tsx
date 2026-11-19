import type { Metadata } from "next";
import { Compass, Ship, SlidersHorizontal, Users } from "lucide-react";
import { PageIntro, TextLink, FAQ, TravelCTA } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
export const metadata: Metadata = { title: "Nos services — Votre voyage sur mesure", description: "Visites guidées, croisières, circuits personnalisés et séjours privatisés au Bénin. Découvrez les prestations présentées par AYIFFA TOURISME.", alternates: { canonical: "/services" } };
const services = [
  { Icon: Compass, label: "01 · DÉCOUVRIR AVEC UN AUTRE REGARD", title: "Des visites qui racontent une histoire.", text: "À Ouidah et sur les sites touristiques présentés par l’agence, un guide vous accompagne pour comprendre les lieux, leur mémoire et leur culture. Le parcours et les visites sont définis avec vous.", href: "/destinations/ouidah", link: "Découvrir les visites guidées" },
  { Icon: Ship, label: "02 · LAISSER LE VOYAGE PRENDRE SON TEMPS", title: "Des découvertes au fil de l’eau.", text: "Le site de l’agence présente des croisières à Avlékété, Gogotinkpon, Pahou sur le lac Toho et sur la lagune de Ouidah. Chaque sortie est organisée selon les conditions de navigation et les disponibilités locales.", href: "/circuits/gogotinkpon", link: "Explorer l’immersion à Gogotinkpon" },
  { Icon: SlidersHorizontal, label: "03 · PARTIR DE VOS ENVIES", title: "Le sur-mesure, tout naturellement.", text: "Nos idées de voyage sont un point de départ. Choisissez vos centres d’intérêt, partagez vos contraintes et vos dates : l’agence prépare une proposition personnalisée, avec des prestations et un tarif à confirmer dans un devis.", href: "/contact", link: "Imaginer mon voyage" },
  { Icon: Users, label: "04 · VOYAGER AVEC LES SIENS", title: "Un séjour rien que pour vous.", text: "AYIFFA TOURISME propose de privatiser et personnaliser un séjour pour une découverte en couple, en famille ou entre amis. Le nombre de voyageurs, le rythme et l’organisation sont précisés au moment de préparer le programme.", href: "/contact", link: "Préparer un séjour privé" },
];
export default async function ServicesPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale).pages.services;
  return <><PageIntro label={t.label} title={t.titleH1} description={t.description}/><div className="container service-list">{services.map(({ Icon, label, title, text, href, link }) => <Reveal key={label}><article className="service-row"><div className="service-icon"><Icon size={29} strokeWidth={1.2}/></div><div><p className="mini-label">{label}</p><h2>{title}</h2></div><div><p>{text}</p><TextLink href={href}>{link}</TextLink></div></article></Reveal>)}</div><FAQ limit={4}/><TravelCTA compact/></>;
}