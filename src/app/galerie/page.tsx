import type { Metadata } from "next";
import Link from "next/link";
import { Gallery } from "@/components/gallery";
import { PageIntro, TravelCTA } from "@/components/ui";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
export const metadata: Metadata = { title: "Carnet d’images : Le Bénin autrement", description: "Un carnet photographique du Bénin : Ganvié, Ouidah, Grand-Popo, Abomey-Calavi et les paysages de Dassa. Photographies documentaires et crédits accessibles.", alternates: { canonical: "/galerie" } };
export default async function GalleryPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale).pages.gallery;
  return <><PageIntro label={t.label} title={t.titleH1} description={t.description}/><section className="container section"><p className="gallery-intro-note">Sélectionnez une photographie pour l’agrandir et découvrir son auteur. <Link href="/credits" className="text-link">Consulter les crédits</Link></p><Gallery full/></section><TravelCTA compact/></>;
}