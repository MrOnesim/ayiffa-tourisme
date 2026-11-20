import type { Metadata } from "next";
import { PageIntro, TravelCTA } from "@/components/ui";
import { ExperiencesList } from "@/components/experiences-list";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
import { getPageMetadata } from "@/lib/page-metadata";
export async function generateMetadata(): Promise<Metadata> { return getPageMetadata(await getServerLocale(), "experiences", "/experiences"); }
export default async function ExperiencesPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale).pages.experiences;
  return <><PageIntro label={t.label} title={t.titleH1} description={t.description}/><ExperiencesList/><TravelCTA/></>;
}