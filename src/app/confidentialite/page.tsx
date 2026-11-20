import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageIntro } from "@/components/ui";
import { EmLines, RichText } from "@/components/lines";
import { site } from "@/lib/content";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
import { getPageMetadata } from "@/lib/page-metadata";
import { interpolate } from "@/lib/text";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(await getServerLocale(), "privacy", "/confidentialite");
}

export default async function PrivacyPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale).legal.privacy;
  const vars = { email: site.email };
  return <>
    <PageIntro label={t.label} title={<EmLines text={`${t.titleLead}\n${t.titleEm}`}/>} description={t.description}/>
    <article className="container legal-content">
      <div className="notice"><Info size={18}/><div>{t.notice}</div></div>
      <h2>{t.h1}</h2>
      <p>{t.p1}</p>
      <h2>{t.h2}</h2>
      <p>{t.p2}</p>
      <h2>{t.h3}</h2>
      <p>{t.p3}</p>
      <h2>{t.h4}</h2>
      <p>{t.p4}</p>
      <h2>{t.h5}</h2>
      <p>{t.p5}</p>
      <h2>{t.designH}</h2>
      <p>{t.designP1}</p>
      <p>{t.designP2}</p>
      <p>{t.designP3}</p>
      <h2>{t.h6}</h2>
      <p>{t.p6}</p>
      <h2>{t.h7}</h2>
      <p><RichText html={interpolate(t.p7, vars)}/></p>
    </article>
  </>;
}
