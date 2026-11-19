import type { Metadata } from "next";
import { DestinationCatalogue } from "@/components/catalogue";
import { PageIntro, TravelCTA } from "@/components/ui";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
export const metadata:Metadata={title:"Destinations au Bénin",description:"Ouidah, Ganvié, Grand-Popo et les paysages du Bénin. Explorez les destinations d’AYIFFA TOURISME et imaginez votre séjour personnalisé.",alternates:{canonical:"/destinations"}};
export default async function DestinationsPage({searchParams}:{searchParams:Promise<{destination?:string;envie?:string;voyageurs?:string;startDate?:string}>}) {
  const params=await searchParams;
  const locale=await getServerLocale();
  const t=getDictionary(locale).pages.destinations;
  return <><PageIntro label={t.label} title={t.titleH1} description={t.description}/><DestinationCatalogue initialDestination={typeof params.destination==="string"?params.destination:""} initialCategory={typeof params.envie==="string"?params.envie:""} travellers={typeof params.voyageurs==="string"?params.voyageurs:""} startDate={typeof params.startDate==="string"?params.startDate:""}/><TravelCTA compact/></>;
}
