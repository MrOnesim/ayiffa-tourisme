import type { Metadata } from "next";
import { PageIntro, TravelCTA } from "@/components/ui";
import { ExperiencesList } from "@/components/experiences-list";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
export const metadata: Metadata = { title: "Expériences : Rencontrer le Bénin autrement", description: "Culture, patrimoine, pirogues et paysages du littoral : explorez les expériences de découverte du Bénin avec AYIFFA TOURISME.", alternates: { canonical: "/experiences" } };
export default async function ExperiencesPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale).pages.experiences;
  return <><PageIntro label={t.label} title={t.titleH1} description={t.description}/><ExperiencesList/><TravelCTA/></>;
}