import type { Metadata } from "next";
import { CircuitCatalogue } from "@/components/catalogue";
import { CircuitCompare } from "@/components/circuit-compare";
import { PageIntro, TravelCTA, FAQ } from "@/components/ui";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
import { getPageMetadata } from "@/lib/page-metadata";
export async function generateMetadata():Promise<Metadata>{return getPageMetadata(await getServerLocale(),"circuits","/circuits");}
export default async function CircuitsPage(){const locale=await getServerLocale();const t=getDictionary(locale).pages.circuits;return <><PageIntro label={t.label} title={t.titleH1} description={t.description}/><CircuitCatalogue/><CircuitCompare/><FAQ limit={3}/><TravelCTA compact/></>;}
