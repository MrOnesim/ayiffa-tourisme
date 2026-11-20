import type { Metadata } from "next";
import { DestinationCatalogue } from "@/components/catalogue";
import { LivingAtlas } from "@/components/living-atlas";
import { PageIntro, TravelCTA } from "@/components/ui";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
import { getPageMetadata } from "@/lib/page-metadata";
export async function generateMetadata():Promise<Metadata>{return getPageMetadata(await getServerLocale(),"destinations","/destinations");}
export default async function DestinationsPage({searchParams}:{searchParams:Promise<{destination?:string;envie?:string;voyageurs?:string;startDate?:string}>}) {
  const params=await searchParams;
  const locale=await getServerLocale();
  const t=getDictionary(locale).pages.destinations;
  return <><PageIntro label={t.label} title={t.titleH1} description={t.description}/><LivingAtlas/><DestinationCatalogue initialDestination={typeof params.destination==="string"?params.destination:""} initialCategory={typeof params.envie==="string"?params.envie:""} travellers={typeof params.voyageurs==="string"?params.voyageurs:""} startDate={typeof params.startDate==="string"?params.startDate:""}/><TravelCTA compact/></>;
}
