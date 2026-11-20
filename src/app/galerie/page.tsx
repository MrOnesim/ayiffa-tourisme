import type { Metadata } from "next";
import Link from "next/link";
import { Gallery } from "@/components/gallery";
import { PageIntro, TravelCTA } from "@/components/ui";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
import { getPageMetadata } from "@/lib/page-metadata";
export async function generateMetadata(): Promise<Metadata> { return getPageMetadata(await getServerLocale(), "gallery", "/galerie"); }
export default async function GalleryPage() {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  const t = dict.pages.gallery;
  const ui = dict.ui;
  return <><PageIntro label={t.label} title={t.titleH1} description={t.description}/><section className="container section"><p className="gallery-intro-note">{ui.galleryNote} <Link href="/credits" className="text-link">{ui.galleryCredits}</Link></p><Gallery full/></section><TravelCTA compact/></>;
}