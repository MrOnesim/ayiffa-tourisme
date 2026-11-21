import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageIntro } from "@/components/ui";
import { EmLines, RichText } from "@/components/lines";
import { getLocalizedContent } from "@/lib/content-locales";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
import { getPageMetadata } from "@/lib/page-metadata";
import { interpolate } from "@/lib/text";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(await getServerLocale(), "legal", "/mentions-legales");
}

export default async function LegalPage() {
  const locale = await getServerLocale();
  const { site } = getLocalizedContent(locale);
  const t = getDictionary(locale).legal.mentions;
  const vars = { name: site.name, address: site.address, email: site.email };
  return <>
    <PageIntro label={t.label} title={<EmLines text={`${t.titleLead}\n${t.titleEm}`}/>} description={t.description}/>
    <article className="container legal-content">
      <div className="notice"><Info size={18}/><div>{t.notice}</div></div>
      <h2>{t.h1}</h2>
      <p><RichText html={interpolate(t.p1a, vars)}/></p>
      <p>{t.p1b}</p>
      <h2>{t.h2}</h2>
      <p>{t.p2}</p>
      <h2>{t.h3}</h2>
      <p>{t.p3}</p>
      <h2>{t.h4}</h2>
      <p>{t.p4}</p>
      <h2>{t.h5}</h2>
      <p>{t.p5}</p>
      <h2>{t.h6}</h2>
      <p><RichText html={t.p6}/></p>
    </article>
  </>;
}
