import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getLocalizedContent } from "@/lib/content-locales";
import { CinemaProvider } from "@/components/cinema-provider";
import { LocaleProvider } from "@/components/locale-provider";
import "./globals.css";
import "./cinematic.css";
import "./visit-inspired.css";
import "./signature.css";
import "./atlas.css";
import "./readability.css";
import { appliedIdentity } from "@/lib/applied-identity";
import { getServerLocale } from "@/lib/get-locale-server";
import { getDictionary } from "@/lib/get-dictionary";
import { getRootMetadata } from "@/lib/page-metadata";

const sans = Manrope({ weight: ["400", "500", "600", "700", "800"], style: "normal", subsets: ["latin", "latin-ext"], variable: "--font-sans", display: "swap" });
const editorial = Cormorant_Garamond({ weight: ["600", "700"], style: ["normal", "italic"], subsets: ["latin", "latin-ext"], variable: "--font-editorial", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  return getRootMetadata(await getServerLocale());
}
export const viewport: Viewport = {width:"device-width",initialScale:1,themeColor:"#163e31"};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  const { site } = getLocalizedContent(locale);
  const structuredData = {"@context":"https://schema.org","@type":"TravelAgency",name:site.name,url:site.url,email:site.email,address:{"@type":"PostalAddress",addressLocality:"Ouidah",addressRegion:locale === "fr" ? "Atlantique" : locale === "es" ? "Atlántico" : locale === "de" ? "Atlantik" : "Atlantic",addressCountry:"BJ"},areaServed:{"@type":"Country",name:dict.ui.benin},description:dict.seo.structuredDescription};
  return <html lang={locale} className={`${sans.variable} ${editorial.variable}`}><body className="ayiffa-signature" data-design={appliedIdentity.id}><a href="#contenu" className="skip-link">{dict.ui.skipLink}</a><LocaleProvider initialLocale={locale}><CinemaProvider><Header/><main id="contenu">{children}</main><Footer/></CinemaProvider></LocaleProvider><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}}/><Analytics/><SpeedInsights/></body></html>;
}
