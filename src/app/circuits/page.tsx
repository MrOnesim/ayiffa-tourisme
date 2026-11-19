import type { Metadata } from "next";
import { CircuitCatalogue } from "@/components/catalogue";
import { PageIntro, TravelCTA, FAQ } from "@/components/ui";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
export const metadata:Metadata={title:"Circuits & voyages au Bénin",description:"Découvrez les visites à Ouidah, l’immersion à Gogotinkpon et les séjours de 8 ou 10 jours présentés par AYIFFA TOURISME. Programmes personnalisés sur devis.",alternates:{canonical:"/circuits"}};
export default async function CircuitsPage(){const locale=await getServerLocale();const t=getDictionary(locale).pages.circuits;return <><PageIntro label={t.label} title={t.titleH1} description={t.description}/><CircuitCatalogue/><FAQ limit={3}/><TravelCTA compact/></>;}
